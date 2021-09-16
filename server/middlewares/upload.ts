
import * as multer from 'multer'
import * as uuid4 from 'uuid4'
import * as path from 'path'
import * as mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

var TempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/temp')
  },
  filename: function (req, file, cb) {
    const name = new ObjectId()
    const ext = path.extname(file.originalname)
    cb(null, name + ext)
  }
})

export const editStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/temp')
  },
  filename: function (req, file, cb) {
    // const name = uuid4()
    // const ext = path.extname(file.originalname)
    cb(null, file.originalname)
  }
})

export const uploadTemp = multer({
  storage: TempStorage,
  limits: {
    fileSize: 1024 * 1024,
    files: 1,
    fields: 0
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  }
}).single('image')

export const uploadEdit = multer({
  storage: editStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024,
    files: 10,
    fields: 2
  }
}).fields([
  { name: 'images[]', maxCount: 5 },
  { name: 'image', maxCount: 1 }
])
  
