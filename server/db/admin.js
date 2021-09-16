"use strict";
exports.__esModule = true;
exports.Admin = void 0;
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    isActive: {
        type: Boolean,
        required: true,
        "default": true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    role: {
        type: String,
        required: true,
        "enum": ['Admin', 'Manager', 'Supporter']
    },
    wallet: [
        {
            currency: {
                type: mongoose.ObjectId,
                required: true
            },
            value: {
                type: Number,
                required: true,
                "default": 0
            }
        }
    ],
    adminActivities: [
        {
            action: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date
            },
            device: {
                type: String
            },
            loginDeviceId: {},
            ip: {
                type: String
            }
        }
    ]
});
// This functions will execute if the password field is modified.
adminSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(Number(process.env.SALT_I))
            .then(function (salt) {
            bcrypt.hash(user.password, salt)
                .then(function (hash) {
                user.password = hash;
                next();
            })["catch"](function (err) {
                next(err);
            });
        })["catch"](function (err) {
            next(err);
        });
    }
    else {
        next();
    }
});
// This method compares the password which is stored in database and
// the password which the user entered. It is used in Login.
adminSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
adminSchema.methods.comparePasswordPromise = function (candidatePassword) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        bcrypt.compare(candidatePassword, _this.password)
            .then(function (isMatch) {
            resolve(isMatch);
        })["catch"](function (err) {
            reject(err);
        });
    });
};
exports.Admin = mongoose.model('Admin', adminSchema);
