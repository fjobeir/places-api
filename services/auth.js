const jwt = require('jsonwebtoken');
const models = require('../models/index');
const bcrypt = require("bcryptjs");

var authService = {
    signUser: function (user) {
        const token = jwt.sign(
            {
                email: user.email,
                id: user.id,
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );
        return token;
    },
    verifyUser: function (token) {
        if (!token) {
            return false
        }
        try {
            let decoded = jwt.verify(token, 'secretkey');
            return models.Admin.findByPk(decoded.id).then((admin) => {
                if (admin) {
                    return admin
                } else {
                    return false
                }
            })
        } catch (err) {
            console.log(err)
            return false
        }
    },
    hashPassword: function (plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;
    },
    comparePasswords: function (plainTextPassword, hashedPassword) {
        return bcrypt.compareSync(plainTextPassword, hashedPassword)
    }
}
module.exports = authService;