var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')

router.get('/', adminController.index);
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/:id', adminController.show);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router;
