var models = require('../models');
var authService = require('../services/auth');

exports.index = function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const token = req.headers.authorization.split(' ')[1]
    isVerfied = authService.verifyUser(token);
    if (!token || !isVerfied) {
        res.status(401);
        response.success = false
        response.message.push("You must be authonticated.")
        res.send(response)
        return
    }
    models.Admin.findAll({})
        .then(admins => {
            console.log("adminnnn", admins)
            if (Array.isArray(admins)) {
                response.data = admins
                response.success = true
            } else {
                response.message.push("hi")
            }
        }).finally(() => {
            res.send(response)
        })
}
exports.signup = async function (req, res, next) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const [user, created] = await models.Admin.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: authService.hashPassword(req.body.password)
        }
    });
    if (created) {
        response.message.push("User successfully created")
        response.success = true
        res.send(response);
    } else {
        response.message.push("This user already exists")
        response.success = false
        res.send(response);
    }
}
exports.login = async function (req, res, next) {
    console.log("req.body.email")
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Admin.findOne({
        where: {
            email: req.body.email
        }
    }).then(admin => {
        console.log("adminnn", admin)
        if (!admin) {
            response.message.push("Login Failed")
            response.success = false
            res.send(response);
        } else {
            let passwordMatch = authService.comparePasswords(req.body.password, admin.password);
            if (passwordMatch) {
                let token = authService.signUser(admin);
                response.message.push("Login successful")
                response.success = true
                response.token = token
                res.send(response);
            } else {
                response.message.push("Wrong password")
                response.success = false
                res.send(response);
            }
        }
    })
        .catch(err => {
            res.status(400);
            response.message.push("There was a problem in logging in. Make sure of the information you entered")
            response.success = false
            res.send(response)
        });
}
exports.show = async function (req, res, next) {
    const id = req.params.id
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const token = req.headers.authorization.split(' ')[1]
    isVerfied = authService.verifyUser(token);
    if (!token || !isVerfied) {
        res.status(401);
        response.success = false
        response.message.push("You must be authonticated.")
        res.send(response)
        return
    }
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const admin = await models.Admin.findByPk(id)
    if (admin) {
        response.success = true;
        response.data = admin
    } else {
        response.message.push("admin not found")
        res.status(404)
    }
    res.send(response)
}
//update User
exports.update = async function (req, res, next) {
    let response = {
        message: [],
        success: false,
        data: {}
    }
    const token = req.headers.authorization.split(' ')[1]
    isVerfied = authService.verifyUser(token);
    if (!token || !isVerfied) {
        res.status(401);
        response.success = false
        response.message.push("You must be authonticated.")
        res.send(response)
        return
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const updated = await models.Admin.findByPk(id)
    console.log("updated",)
    if (updated) {
        if (req.body.name) {
            updated.name = req.body.name
        }
        if (req.body.password) {
            updated.password = authService.hashPassword(req.body.password)
        }
        if (req.body.email) {
            updated.email = req.body.email
        }
        updated.save()
        response.message.push('Successfully Updated')
        response.success = true
        response.data = updated
    } else {
        res.status(400);
        response.message.push('There was a problem updating the user.  Please check the user information.')
        response.success = false
    }
    res.send(response)
}
//delete user
exports.delete = async function (req, res, next) {
    let response = {
        message: [],
        success: false,
        data: {}
    }
    const token = req.headers.authorization.split(' ')[1]
    isVerfied = authService.verifyUser(token);
    if (!token || !isVerfied) {
        res.status(401);
        response.success = false
        response.message.push("You must be authonticated.")
        res.send(response)
        return
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const deleted = await models.Admin.destroy({
        where: {
            id: id
        }
    })
    if (deleted == 1) {
        response.message.push("Admin has been deleted")
        response.success = true
    } else {
        response.message.push("Admin has not been deleted")
    }
    res.send(response)
}