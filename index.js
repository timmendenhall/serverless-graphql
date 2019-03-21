const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('express-jwt');
const Firestore = require('@google-cloud/firestore');

// Load the environment file based on NODE_ENV
require('custom-env').env(true);

const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
    timestampsInSnapshots: true,
});

// Init express
const app = express();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
type Query {
    feedbacks: [Feedback!]!
    feedback(id: ID!): Feedback
    me: User
}

type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createFeedback(rating: Int!, comment: String!): Feedback!
}

type AuthPayload {
    token: String!
    user: User!
}

type User {
    id: ID!
    email: String!
    name: String!
    feedbacks: [Feedback!]!
}

type Feedback {
    id: ID!
    rating: Int!
    comment: String!
    author: User!
}
`);

// The root provides a resolver function for each API endpoint
const root = {
    Query: {
        feedbacks: (obj, args, context, info) => {
            return 'feedbacks';
        },
        feedback: (obj, args, context, info) => {
            return 'feedback';
        }
    },
};

app.use('/',
    jwt({secret: process.env.JWT_SHARED_SECRET}),
    graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    // graphiql: process.env.NODE_ENV === 'development',
}));

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.graphql = app;
