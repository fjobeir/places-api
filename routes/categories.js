var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController')
const multer = require('multer')
var path = require('path');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const acceptedFile = function(req, file, cb) {
    const acceptedMimetypes = [
        'image/jpeg',
        'image/jpg',
        'image/png'
    ]
    if (acceptedMimetypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const iconUploader = multer({
    storage: storage,
    fileFilter: acceptedFile,
    limits: { fileSize: 104857600 }
})

const app = express()

router.get('/', categoryController.index);
router.post('/', isAuthenticated, iconUploader.single('icon'), categoryController.store);
router.get('/:id', categoryController.show)
router.put('/:id', isAuthenticated, iconUploader.single('icon'), categoryController.update)
router.delete('/:id', isAuthenticated, categoryController.delete)

module.exports = router;
