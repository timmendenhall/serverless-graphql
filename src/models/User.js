import crypto from 'crypto';

export default class User {
    constructor(id, name, email, password, hash, salt) {
        this.id = id;
        this.name = name;
        this.email = email;

        if (password) {
            this.setPassword(password);
        } else if (hash && salt) {
            this.hash = hash;
            this.salt = salt;
        }
    }

    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    }

    validatePassword(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    };
}