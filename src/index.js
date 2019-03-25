import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from 'passport';
import bodyParser from 'body-parser';
// const jwt = require('express-jwt');
import { addNew, getAll } from './util/storage';
import User from './models/User';
import schema from './schema.js';
import './passport';

// Init express
const app = express();

// The root provides a resolver function for each API endpoint
const root = {
    feedbacks: (obj, args, context) => {
        return [];
    },
    feedback: (obj, args, context) => {
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
    users: async (obj, args, context) => {
        const users = await getAll({kind: 'User'});
        return users.map(user => {
            return new User(user[datastore.KEY].id, user.name, user.email, null, user.hash, user.salt);
        });
    }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/',
    // jwt({secret: process.env.JWT_SHARED_SECRET}),
    graphqlHTTP((request, response, graphQLParams) => ({
        schema: schema,
        context: {
            user: request.user
        },
        rootValue: root,
        graphiql: true,
        // graphiql: process.env.ENVIRONMENT_NAME !== 'production',
    }))
);

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/', session: false}),
    (req, res) => {
        // console.log('User: ', req.user);
        // console.log('body: ', req.body);
        return res.json({
            message: 'success',
            user: req.user
        });
    }
);


exports.graphql = app;
// const port = process.env.PORT || 8000;
// app.listen(port, () => console.log(`DEV App listening on port: ${port}!`));