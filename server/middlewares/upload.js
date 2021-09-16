"use strict";
exports.__esModule = true;
exports.uploadEdit = exports.uploadTemp = exports.editStorage = void 0;
var multer = require("multer");
var path = require("path");
var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectId;
var TempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/temp');
    },
    filename: function (req, file, cb) {
        var name = new ObjectId();
        var ext = path.extname(file.originalname);
        cb(null, name + ext);
    }
});
exports.editStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/temp');
    },
    filename: function (req, file, cb) {
        // const name = uuid4()
        // const ext = path.extname(file.originalname)
        cb(null, file.originalname);
    }
});
exports.uploadTemp = multer({
    storage: TempStorage,
    limits: {
        fileSize: 1024 * 1024,
        files: 1,
        fields: 0
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    }
}).single('image');
exports.uploadEdit = multer({
    storage: exports.editStorage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024,
        files: 10,
        fields: 2
    }
}).fields([
    { name: 'images[]', maxCount: 5 },
    { name: 'image', maxCount: 1 }
]);
