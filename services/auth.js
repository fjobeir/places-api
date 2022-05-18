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
    verifyUser: async function (token) {
        if (!token) {
            return false
        }
        try {
            let decoded = jwt.verify(token, 'secretkey');
            const admin = await models.Admin.findByPk(decoded.id)
            if (admin) {
                return admin
            } else {
                return false
            }
        } catch (error) {
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