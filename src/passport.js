import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getOne } from './util/storage';
import User from './models/User';

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    async (email, password, done) => {

        const user = await getOne({kind: 'User', byProperty: 'email', byValue: email});

        if (!user) {
            return done(null, false, { errors: { 'email or password': 'is invalid' } });
        }

        const userModel = new User(user.id, user.name, user.email, null, user.hash, user.salt);

        if (!userModel.validatePassword(password)) {
            return done(null, false, { errors: { 'email or password': 'is invalid' } });
        }

        // Removing salt/hash so it doesn't accidentally make it's way upstream
        userModel.hash = null;
        userModel.salt = null;

        return done(null, userModel);
    }
));
