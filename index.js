const express = require('express');
const graphqlHTTP = require('express-graphql');
const jwt = require('express-jwt');
const Firestore = require('@google-cloud/firestore');
const { schema } = require('./schema.js');

const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
    timestampsInSnapshots: true,
});

// Init express
const app = express();

// The root provides a resolver function for each API endpoint
const root = {
    Query: {
        feedbacks: (obj, args, context, info) => {
            return [
                {
                    id: 'id1',
                    rating: 5,
                    comment: 'Hello comment'
                },
                {
                    id: 'id2',
                    rating: 4,
                    comment: 'Hello comment again'
                }
            ];
        },
        feedback: (obj, args, context, info) => {
            return {
                id: 'id1',
                rating: 5,
                comment: 'Hello comment'
            };
        }
    },
};

app.use('',
    // jwt({secret: process.env.JWT_SHARED_SECRET}),
    graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    // graphiql: process.env.ENVIRONMENT_NAME !== 'production',
}));

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.graphql = app;
