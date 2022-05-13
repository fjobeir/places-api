var models = require('../models')

var {
    categoryTransformer,
    categoriesTransformer
} = require('../transformers/categoryTransformers')
const fs = require('fs');

exports.index = function (req, res) {
    var response = {
        success: false,
        data: []
    }
    models.Category.findAll({
        include: [
            models.Place
        ]
    })
        .then(categories => {
            if (Array.isArray(categories)) {
                response.success = true
                response.data = categoriesTransformer(categories)
            }
        }).finally(() => {
            res.send(response)
        });
}

exports.store = async function (req, res) {
    var response = {
        success: true,
        messages: [],
        data: {}
    }

    const title = req.body.title.trim()
    if (title.length < 3) {
        response.messages.push('Please add a valid title')
        response.success = false
    }

    if (!req.file) {
        response.messages.push('Please add an icon')
        response.success = false
        res.send(response)
        return
    }


    if (response.success === true) {
        await models.Category.create({
            title: req.body.title,
            icon: req.file.filename
        }).then(newCategory => {

            response.messages.push('Category added')
            response.data = newCategory
        })
    }
    res.send(response)
}

exports.show = async function (req, res) {
    var response = {
        success: false,
        data: {},
        messages: []
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push('Please provide a valid ID')
        res.send(response)
        return
    }
    const category = await models.Category.findByPk(id, {
        include: [
            models.Place
        ]
    })
    if (category) {
        response.success = true
        response.data = categoryTransformer(category)
    } else {
        response.messages.push('Category not found')
        res.status(404)
    }
    res.send(response)
}
exports.update = async function (req, res) {
    var response = {
        success: false,
        data: {},
        messages: []
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push('Please provide a valid ID')
        res.send(response)
        return
    }
    const category = await models.Category.findByPk(id)
    if (category) {
        const title = req.body.title
        if (title) {
            category.title = title
        }
        if (req.file) {
            fs.unlink('uploads/' + category.icon, () => { })
            category.icon = req.file.filename
        }
        category.save().then(function(category) {
            response.data = categoryTransformer(category)
            response.success = true
            response.messages.push('Category has been updated')
            res.send(response)
        })
        
    } else {
        response.messages.push('Category not found')
        res.send(response)
    }
    
}
exports.delete = async function (req, res) {
    var response = {
        success: false,
        data: {},
        messages: []
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.messages.push('Please provide a valid ID')
        res.send(response)
        return
    }
    const deleted = await models.Category.destroy({
        where: {
            id: id
        }
    })
    if (deleted == 1) {
        response.success = true
        response.messages.push('Category has been deleted')
    } else {
        response.messages.push('Category has not been deleted')
    }
    res.send(response)
}