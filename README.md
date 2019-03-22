Serverless GraphQL
------------------

The aim of this project is to show off a simple way to place a GraphQL front end over a GCP datastore all with serverless technology.

### Environment File

You will have to create an environment file or user NODE_ENV=example to use the .env.example file.  You can make a copy and change any necessary values with values from your own GCP account.

### Setup

Install and initialize Google Cloud SDK:
https://cloud.google.com/sdk/

### Build

You can run `npm run build:production` and the built index.js file will be in the root directory of this project ready to be deployed.

Because this project is built with webpack you can use ES6 modules and async/await syntax.

### Deployment

You can run `npm run deploy:production` if you have a matching `.env.production.yaml` file created with your production credentials.
