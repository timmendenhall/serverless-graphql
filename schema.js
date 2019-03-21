const { buildSchema } = require('graphql');

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

module.exports.schema = schema;