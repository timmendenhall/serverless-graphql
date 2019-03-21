const express = require('express');
const graphqlHTTP = require('express-graphql');
// const jwt = require('express-jwt');
const uuidv1 = require('uuid/v1');
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Datastore } = require('@google-cloud/datastore');
const { schema } = require('./schema.js');

// Init express
const app = express();

const datastore = new Datastore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

class User {
    constructor(name, email, password) {
        this.id = uuidv1();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

// The root provides a resolver function for each API endpoint
const root = {

    feedbacks: (obj, args) => {
        return [];
    },
    feedback: (obj, args) => {
        return null;
    },
    // Old object / args, but, name/email/password comes in first here
    signup: ({name, email, password}, _) => {
        // The kind for the new entity
        const kind = 'User';
        // The Cloud Datastore key for the new entity
        const taskKey = datastore.key([kind]);

        // Prepares the new entity
        const user = {
            key: taskKey,
            data: {
                name,
                email,
                password
            }
        };

        return datastore.save(user).then((user) => {
            return new User(name, email, password);
        });
    }
};

app.use('',
    // jwt({secret: process.env.JWT_SHARED_SECRET}),
    graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    // graphiql: process.env.ENVIRONMENT_NAME !== 'production',
}));

exports.graphql = app;
