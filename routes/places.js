var express = require('express');
var router = express.Router();
var placeController= require('../controllers/placeController')
var path = require('path');
const multer  = require('multer')
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
  const acceptFile= function(req,file,cb){
      const acceptedMimType=[
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
      ]
      if(acceptedMimType.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(null,false)
    }
  }
  const upload = multer({ storage: storage,
     fileFilter:acceptFile,
    limits:{fileSize:104857600}
    })
router.get('/', placeController.index);
router.post('/', isAuthenticated, upload.single('picture'),placeController.store);
router.get('/:id', placeController.show);
router.put('/:id', isAuthenticated, upload.single('picture'), placeController.update);
router.delete('/:id', isAuthenticated, placeController.delete);
module.exports = router;