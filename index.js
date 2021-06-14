#!/usr/bin/env node

const auth0 = require('auth0');
let PromisePool = require('es6-promise-pool')

const configJson = require('./config.json');
const getUsers = require('./create-users/users.json');

const http = require('http');
const originalOnSocket = http.ClientRequest.prototype.onSocket;
require('http').ClientRequest.prototype.onSocket = function(socket) {
  const that = this;
  socket.setTimeout(this.timeout ? this.timeout : 30000);
  socket.on('timeout', function() {
    that.abort();
  });
  originalOnSocket.call(this, socket);
};

const getMgmtClient = () => {
  if (this.mgmtClient) {
    return this.mgmtClient;
  }
  this.mgmtClient = new auth0.ManagementClient({
    domain: configJson.AUTH0_DOMAIN,
    clientId: configJson.AUTH0_CLIENT_ID,
    clientSecret: configJson.AUTH0_CLIENT_SECRET,
    tokenProvider: {
      enableCache: true,
      cacheTTLInSeconds: 60
    },
    retry: {
      enabled: true,
      maxRetries: 10
    }
  });
  return this.mgmtClient;
};

const app = {
  init: async configJson => {
    let mgmtClient = getMgmtClient();
    let maxParallelRequests = 10;
    let count = 0;
    let total = 2000;

    let promiseProducer = function() {
      console.log("create counter at: ", count, "out of total: ", total)
      if (count < total) {
        let currentUser = getUsers[count];
        console.log("current userid", currentUser)
        count++;

        return new Promise((ok, fail) => mgmtClient.createUser(currentUser,
          function(err, user) {
            if (err) {
              console.log("errored user", currentUser);
              fail(err);
            } else {
              ok(user);
            }
          }));
      } else {
        console.log("Returning null")
        return null;
      }
    };



    let pool = new PromisePool(promiseProducer, maxParallelRequests);
    pool.start()
      .then(function() {
        console.log('Complete');
        count = 0;
      })
      .catch(function(e) {
        console.log('error', e);

      });

  }
};

app.init(configJson);
module.exports = app;
