var models = require('../models');
var authService = require('../services/auth');

exports.index = function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    models.Admin.findAll({})
        .then(admins => {
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
        success: true,
        messages: [],
        data: {}
    }
    if (!req.body?.name?.length) {
        response.messages.push("Please add a name")
        response.success = false
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body?.email))) {
        response.messages.push("Please add a valid email")
        response.success = false
    }
    if (req?.body?.password?.length < 6) {
        response.messages.push("Please add a valid password")
        response.success = false
    }
    if (req?.body?.password != req?.body?.password_confirmation) {
        response.messages.push("Your password and password confirmation do not match")
        response.success = false
    }
    if (!response.success) {
        res.send(response)
        return
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
        response.messages.push("User successfully created")
        response.success = true
        res.send(response);
    } else {
        response.messages.push("This user already exists")
        response.success = false
        res.send(response);
    }
}
exports.login = async function (req, res, next) {
    var response = {
        success: false,
        messages: [],
        data: {}
    }
    models.Admin.findOne({
        where: {
            email: req.body.email
        }
    }).then(admin => {
        console.log("adminnn", admin)
        if (!admin) {
            response.messages.push("Login Failed")
            response.success = false
            res.send(response);
        } else {
            let passwordMatch = authService.comparePasswords(req.body.password, admin.password);
            if (passwordMatch) {
                let token = authService.signUser(admin);
                response.messages.push("Login successful")
                response.success = true
                response.token = token
                res.send(response);
            } else {
                response.messages.push("Wrong password")
                response.success = false
                res.send(response);
            }
        }
    })
        .catch(err => {
            res.status(400);
            response.messages.push("There was a problem in logging in. Make sure of the information you entered")
            response.success = false
            res.send(response)
        });
}
exports.show = async function (req, res, next) {
    const id = req.params.id
    var response = {
        success: false,
        messages: [],
        data: {}
    }
    if (isNaN(id)) {
        response.messages.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const admin = await models.Admin.findByPk(id)
    if (admin) {
        response.success = true;
        response.data = admin
    } else {
        response.messages.push("admin not found")
        res.status(404)
    }
    res.send(response)
}
//update User
exports.update = async function (req, res, next) {
    let response = {
        messages: [],
        success: true,
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    if (!req.body?.name?.length) {
        response.messages.push("Please add a name")
        response.success = false
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body?.email))) {
        response.messages.push("Please add a valid email")
        response.success = false
    }
    if (req?.body?.password != req?.body?.password_confirmation) {
        response.messages.push("Your password and password confirmation do not match")
        response.success = false
    }
    if (!response.success) {
        res.send(response)
        return
    }
    const updated = await models.Admin.findByPk(id)
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
        updated.save().then((admin) => {
            response.messages.push('Successfully Updated')
            response.success = true
            response.data = admin
            res.send(response)
        })
    } else {
        res.status(400);
        response.messages.push('There was a problem updating the user.  Please check the user information.')
        response.success = false
        res.send(response)
    }
    
}
//delete user
exports.delete = async function (req, res, next) {
    let response = {
        messages: [],
        success: false,
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push("Please provide a valid ID")
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
        response.messages.push("Admin has been deleted")
        response.success = true
    } else {
        response.messages.push("Admin has not been deleted")
    }
    res.send(response)
}