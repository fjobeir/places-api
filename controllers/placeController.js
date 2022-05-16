var models = require('../models');
var { placeTransformer, placesTransformer } = require('../transformers/placeTransformers')
var authService = require('../services/auth');
const fs = require('fs')
const sequelize = require('sequelize')

exports.index = async function (req, res) {
    var response = {
        success: true,
        message: [],
        data: {}
    }

    const lng = req.query.lng
    const lat = req.query.lat
    const attributes = ['id', 'title', 'picture', 'description', 'longitude', 'latitude']

    if (lng && lat) {
        attributes.push(
            [sequelize.literal("6371 * acos(cos(radians("+lat+")) * cos(radians(latitude)) * cos(radians("+lng+") - radians(longitude)) + sin(radians("+lat+")) * sin(radians(latitude)))"), 'distance']
        )
    }

    models.Place.findAll({
        include: [
            models.Category
        ],
        attributes: attributes,
        order: (lat && lng) ? sequelize.col('distance') : ['title'],
        limit: 12,
        raw: true,
        nest: true,
    })
        .then(places => {
            if (Array.isArray(places)) {
                response.data = placesTransformer(places)
                response.success = true
            }
        }).finally(() => {
            res.send(response)
        })
}
exports.store = async function (req, res) {
    var response = {
        success: true,
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
    const title = req.body.title.trim()
    if (title.length < 3) {
        response.message.push('please add a valid title')
        response.success = false
    }
    if (!req.file) {
        response.message.push('Please add a photo')
        response.success = false
        res.send(response)
        return
    }
    if (response.success === true) {
        await models.Place.create({
            title: req.body.title,
            picture: req.file.filename,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            category_id: req.body.category_id,
        }).then(newPlace => {
            response.data = newPlace
        })
    }
    res.send(response)
}
exports.show = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const place = await models.Place.findByPk(id, {
        include: [
            models.Category
        ]
    })
    if (place) {
        response.success = true;
        response.data = placeTransformer(place)
    } else {
        response.message.push("place not found")
        res.status(404)
    }
    res.send(response)
}
exports.update = async function (req, res) {
    var response = {
        success: true,
        message: [],
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const place = await models.Place.findByPk(id)
    if (place) {
        if (req.body.title) {
            place.title = req.body.title
        }
        if (req.body.description) {
            place.description = req.body.description
        }
        if (req.body.latitude) {
            place.latitude = req.body.latitude
        }
        if (req.body.longitude) {
            place.longitude = req.body.longitude
        }
        if (req.body.category_id) {
            place.category_id = req.body.category_id
        }
        if (req.file) {
            fs.unlink('uploads/' + place.picture, () => { })
            place.picture = req.file.filename
        }
        place.save().then((place) => {
            response.data = placeTransformer(place)
            response.message.push("place has been updated")
            response.success = true
            res.send(response)
        })
        
    } else {
        response.message.push("not found")
        res.send(response)
    }
    
}
exports.delete = async function (req, res) {
    var response = {
        success: false,
        message: [],
        data: {}
    }
    const id = req.params.id
    if (isNaN(id)) {
        response.message.push("Please provide a valid ID")
        response.success = false
        res.send(response)
        return
    }
    const deleted = await models.Place.destroy({
        where: {
            id: id
        }
    })
    if (deleted == 1) {
        response.message.push("Place has been deleted")
        response.success = true
    } else {
        response.message.push("Place has not been deleted")
    }
    res.send(response)
}