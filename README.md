

## Installation

```bash
  cd /path/to/bulk-create/
  npm install
```

## Configuration

The configuration for this tool is contained in the `config.json` file found in the root of the folder. 

> This tool requires Auth0 Management API credentials from a M2M Client. Make sure your ClientId is allowed to request tokens from Management API in [Auth0 Dashboard](https://manage.auth0.com/#/apis).
> The application must be authorized for the following scopes:
>
> - create:users

The Auth0 Management API is meant to be used by back-end servers or trusted parties performing administrative tasks. Generally speaking, anything that can be done through the Auth0 dashboard (and more) can also be done through this API.

```js
{
  "AUTH0_DOMAIN": "TENANT_NAME.auth0.com",
  "AUTH0_CLIENT_ID": "MGMT_API_CLIENT_ID",
  "AUTH0_CLIENT_SECRET": "MGMT_API_CLIENT_SECRET"
}
```

## Operation

```bash
  cd /path/to/bulk-create/
  node index.js
```
The script takes 10 concurrent threads and tested for 2000 users. Please change the parellelism accordingly from line 43-45