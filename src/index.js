import express from 'express';
import graphqlHTTP from 'express-graphql';
// const jwt = require('express-jwt');
import { addNew, getAll } from './util/storage';
import User from './models/User';
import schema from './schema.js';

// Init express
const app = express();

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
        const user = new User(null, name, email, password);

        user.id = await addNew({
            data: {name, email, hash: user.hash, salt: user.salt},
            kind: 'User'
        });

        return user;
    },
    users: async (obj, args) => {
        const users = await getAll({kind: 'User'});
        return users.map(user => {
            return new User(user[datastore.KEY].id, user.name, user.email, null, user.hash, user.salt);
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
