import express from 'express';
import graphqlHTTP from 'express-graphql';
// const jwt = require('express-jwt');
// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
import { Datastore } from '@google-cloud/datastore';
import schema from './schema.js';

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

const addNewEntity = async ({data, kind}) => {
    // The Cloud Datastore key for the new entity
    const taskKey = datastore.key([kind]);

    // Prepares the new entity
    const entity = {
        key: taskKey,
        data
    };

    const result = await datastore.save(entity);
    // Return the new ID
    return result[0].mutationResults[0].key.path[0].id;
};

const getAllEntities = async ({kind}) => {
    const query = datastore
        .createQuery(kind)
        // .limit(5);
        // .filter('thing', '=', false)
        // .order('created')

    const entities = await datastore.runQuery(query);

    // First element is results, second is response data
    return entities[0];
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
    signup: async ({name, email, password}, _) => {
        const id = await addNewEntity({
            data: {name, email, password},
            kind: 'User'
        });

        return new User(id, name, email, password);
    },
    users: async (obj, args) => {
        const users = await getAllEntities({kind: 'User'});
        return users.map(user => {
            return new User(user[datastore.KEY].id, user.name, user.email, user.password);
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
