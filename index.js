const express = require('express');
const graphqlHTTP = require('express-graphql');
// const jwt = require('express-jwt');
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
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

const addNewEntity = ({data, kind}) => {
    // The Cloud Datastore key for the new entity
    const taskKey = datastore.key([kind]);

    // Prepares the new entity
    const entity = {
        key: taskKey,
        data
    };

    return datastore.save(entity).then((entity) => {
        // Return the new ID
        return entity[0].mutationResults[0].key.path[0].id;
    });
};

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
        return addNewEntity({
            data: {name, email, password},
            kind: 'User'
        }).then((userId) => {
            return new User(userId, name, email, password);
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
