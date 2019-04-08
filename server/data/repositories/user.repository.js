const bcrypt = require('bcrypt');
const { UserModel } = require('../models/index');
const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
    addUser({ email, username, password }) {
        return bcrypt.hash(password, 10).then(hash => ({
            email,
            username,
            password: hash
        })).then(user => this.create(user));
    }
}

module.exports = new UserRepository(UserModel);
