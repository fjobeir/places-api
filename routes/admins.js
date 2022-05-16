var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const { isDifferentAdmin } = require('../middlewares/isDifferentAdmin');

router.get('/', isAuthenticated, adminController.index);
router.post('/', isAuthenticated, adminController.signup);
router.post('/login', adminController.login);
router.get('/:id', isAuthenticated, adminController.show);
router.put('/:id', isAuthenticated, adminController.update);
router.delete('/:id', isAuthenticated, isDifferentAdmin, adminController.delete);

module.exports = router;
