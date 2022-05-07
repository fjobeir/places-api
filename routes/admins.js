var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')
const { isAuthenticated } = require('../middlewares/isAuthenticated');

router.get('/', isAuthenticated, adminController.index);
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/:id', isAuthenticated, adminController.show);
router.put('/:id', isAuthenticated, adminController.update);
router.delete('/:id', isAuthenticated, adminController.delete);

module.exports = router;
