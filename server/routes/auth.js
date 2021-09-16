"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.authRoutes = void 0;
var express = require("express");
exports.authRoutes = express.Router();
var uuid4 = require("uuid4");
var crypto = require("crypto");
var mongoose = require("mongoose");
var logger_1 = require("../api/logger");
var amqp_1 = require("../api/amqp");
var myError_1 = require("../api/myError");
var user_1 = require("../db/user");
var validation_1 = require("../middlewares/validation");
var response_1 = require("../middlewares/response");
var tryCtach_1 = require("../middlewares/tryCtach");
var auth_1 = require("../middlewares/auth");
var fetch = require("node-fetch");
var preventBruteForce_1 = require("../middlewares/preventBruteForce");
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
// This end point check "Authentication" of users from MongoDB.
exports.authRoutes.get('/auth', preventBruteForce_1.rateLimiterMiddleware, tryCtach_1["default"](function (req, res, next) {
    if (!req.session.userId) {
        logger_1.logger.error('Unauthorized cookie');
        var error = new myError_1["default"]('Unauthorized cookie', 400, 1, 'کاربر حق دسترسی ندارد!', 'خطا رخ داد');
        next(error);
    }
    else {
        response_1["default"](res, '', { isAuth: true });
    }
}));
// This end point delete "Token" of users who want to logout from MongoDB.
exports.authRoutes.get('/logout', preventBruteForce_1.rateLimiterMiddleware, auth_1.isAuthorized, tryCtach_1["default"](function (req, res, next) {
    var agant = req.useragent;
    var userActivity = {
        action: 'LOGOUT',
        timestamp: Date.now(),
        device: agant.source,
        ip: req.ip
    };
    user_1.User.findOneAndUpdate({ _id: req.session.userId }, { $push: { userActivities: userActivity } })["catch"](function (err) {
        logger_1.logger.error("Updating user activity has some error: " + err + " ");
    });
    req.session.destroy();
    response_1["default"](res);
}));
exports.authRoutes.get('/verifyEmails', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('query', 'string'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var id = req.query.string;
    user_1.VerificationCode.findOne({ name: id })
        .then(function (doc) {
        if (!doc) {
            var error = new myError_1["default"]('Verification Code is not valid!', 400, 5, 'کد راستی آزمایی معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
        else {
            user_1.User.findOne({ emailVerificationString: doc._id })
                .then(function (user) {
                if (user && user.emailVerificationString.toString() === doc._id.toString()) {
                    user.email.validated = true;
                    user.emailVerificationString = undefined;
                    user.email.address = doc.email;
                    user.save()
                        .then(function () {
                        var data = {
                            email: user.email.address
                        };
                        doc.remove()["catch"](function (err) {
                            logger_1.logger.error(err);
                        });
                        response_1["default"](res, 'Email is verified', data);
                    })["catch"](function (err) {
                        next(err);
                    });
                }
                else {
                    var error = new myError_1["default"]('Verification Code is not valid!', 400, 5, 'کد راستی آزمایی معتبر نیست!', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                logger_1.logger.error("The query on User Collection with emailVerificationString " + id + " has some errors: " + err);
                next(err);
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.authRoutes.get('/requestForPhoneCode', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('query', 'phoneNumber'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var phoneNumber = validation_1.numbersFormatter(req.query.phoneNumber, 'en');
    var code = Math.floor(Math.random() * 10000);
    var data = {
        pattern_code: process.env.SMS_API_PHONE_PATTERN_CODE,
        originator: process.env.SMS_API_DEFINITE_SENDER_NUMBER,
        recipient: phoneNumber.toString(),
        values: { "verification-code": code.toString() }
    };
    var body = {
        phoneNumber: phoneNumber,
        sessionId: req.cookies.sessionId,
        code: code
    };
    var verificationPhoneCode = new user_1.VerificationPhoneCode(__assign({}, body));
    verificationPhoneCode.save()
        .then(function () {
        if (userId) {
            user_1.User.findOne({ _id: userId })
                .then(function (user) {
                if (user && user._id.toString() === userId) {
                    user['tempPhoneNumber'] = verificationPhoneCode._id;
                    user.save()
                        .then(function () {
                        fetch('http://rest.ippanel.com/v1/messages/patterns/send', {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Authorization': process.env.SMS_API_ACCESS_KEY,
                                'Content-Type': 'application/json',
                                'Accept': '*/*',
                                'Connection': 'Keep-Alive'
                            }
                        })["catch"](function (err) {
                            var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                            throw (error);
                        })
                            .then(function (res) { return res.json(); })
                            .then(function (response) {
                            if (response.status === 'OK') {
                                response_1["default"](res, '');
                            }
                            else {
                                var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                                next(error);
                            }
                        })["catch"](function (err) {
                            next(err);
                        });
                    })["catch"](function (err) {
                        next(err);
                    });
                }
                else {
                }
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            fetch('http://rest.ippanel.com/v1/messages/patterns/send', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': process.env.SMS_API_ACCESS_KEY,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Connection': 'Keep-Alive'
                }
            })["catch"](function (err) {
                var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                throw (error);
            })
                .then(function (res) { return res.json(); })
                .then(function (response) {
                if (response.status === 'OK') {
                    response_1["default"](res, '');
                }
                else {
                    var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                next(err);
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.authRoutes.get('/verifyPhoneCode', preventBruteForce_1.rateLimiterMiddleware, tryCtach_1["default"](function (req, res, next) {
    var phoneCode = req.query.phoneCode;
    var userId = req.session.userId;
    var sessionId = req.cookies.sessionId;
    user_1.VerificationPhoneCode.findOne({ $and: [{ sessionId: sessionId }, { code: phoneCode }] })
        .then(function (item) {
        if (item && item.sessionId === sessionId) {
            if (item.code === phoneCode) {
                var query = void 0;
                if (userId) {
                    query = { tempPhoneNumber: item._id };
                }
                else {
                    query = { 'phoneNumber.number': item.phoneNumber };
                }
                user_1.User.findOne(query)
                    .then(function (user) {
                    if (user) {
                        user.phoneNumber.number = item.phoneNumber;
                        user.phoneNumber.validated = true;
                        user['tempPhoneNumber'] = undefined;
                        user.save()
                            .then(function () {
                            item.remove()["catch"](function (err) {
                                logger_1.logger.error(err);
                            });
                            response_1["default"](res, '', item.phoneNumber);
                        })["catch"](function (err) {
                            next(err);
                        });
                    }
                    else {
                        var error = new myError_1["default"]('The code is not valid!', 400, 11, 'کد وارد شده معتبر نیست!', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('The code is not valid!', 400, 11, 'کد وارد شده معتبر نیست!', 'خطا رخ داد');
                next(error);
            }
        }
        else {
            var error = new myError_1["default"]('The code is not valid!', 400, 11, 'کد وارد شده معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS  /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
// This end point get the users' information and save those in MongoDB.
exports.authRoutes.post('/register', 
//rateLimiterMiddleware,
validation_1.userValidationRules('body', 'name'), validation_1.userValidationRules('body', 'lastName'), validation_1.userValidationRules('body', 'username'), validation_1.userValidationRules('body', 'password'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var username = req.body.username;
    var rand;
    var mailOptions;
    var dataSms;
    var code;
    var isEmail = false;
    var isPhoneNumber = false;
    var setNewTempPhone = function () {
        return null;
    };
    var setEmailVeificationCode = function () {
        return null;
    };
    if (validation_1.isEmailValid(username)) {
        isEmail = true;
    }
    else if (validation_1.isValidMobilePhone(username)) {
        isPhoneNumber = true;
    }
    if (isPhoneNumber) {
        code = Math.floor(Math.random() * 10000);
        dataSms = {
            pattern_code: process.env.SMS_API_PHONE_PATTERN_CODE,
            originator: process.env.SMS_API_DEFINITE_SENDER_NUMBER,
            recipient: username.toString(),
            values: { "verification-code": code.toString() }
        };
    }
    if (isEmail) {
        //const rand = process.env.NODE_ENV === 'test' ? 'cb0059c2-5566-4967-8c9d-1126d1e9eda4' : uuid4()
        rand = uuid4();
        var link = process.env.API + "/verify?type=email&string=" + rand;
        mailOptions = {
            from: process.env.SENDER_ADDRESS,
            to: username,
            subject: 'Please confirm your Email account',
            html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
        };
    }
    var body;
    var user;
    var verificationPhoneCode;
    if (isEmail) {
        setEmailVeificationCode = function () {
            var bodyEmailCode = {
                name: rand
            };
            var newEmailCode = new user_1.VerificationCode(__assign({}, bodyEmailCode));
            return newEmailCode.save()
                .then(function () {
                body = {
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: { address: username },
                    password: req.body.password,
                    label: ['USER'],
                    emailVerificationString: newEmailCode._id
                };
                user = new user_1.User(__assign({}, body));
            })["catch"](function (err) {
                throw err;
            });
        };
    }
    else if (isPhoneNumber) {
        setNewTempPhone = function () {
            var bodyPhoneCode = {
                phoneNumber: validation_1.numbersFormatter(username, 'en'),
                sessionId: req.cookies.sessionId,
                code: code
            };
            verificationPhoneCode = new user_1.VerificationPhoneCode(__assign({}, bodyPhoneCode));
            return verificationPhoneCode.save()
                .then(function () {
                body = {
                    name: req.body.name,
                    lastName: req.body.lastName,
                    phoneNumber: {
                        number: validation_1.numbersFormatter(username, 'en'),
                        validated: false
                    },
                    password: req.body.password,
                    label: ['USER']
                };
                user = new user_1.User(__assign({}, body));
            })["catch"](function (err) {
                if (err.name = 'MongoError' && err.code === 11000) {
                    logger_1.logger.error("The save action on Verification Collection with document " + bodyPhoneCode + " has some errors: " + err);
                    var error = new myError_1["default"]('!', 400, 9, 'لطفا چند دقیقه بعد از درخواست قبلی صبر نمیایید!', 'خطا رخ داد ');
                    throw (error);
                }
                else
                    throw (err);
            });
        };
    }
    Promise.all([setNewTempPhone(), setEmailVeificationCode()])
        .then(function () {
        user.save()
            .then(function (usr) {
            var data = {
                email: user.email.address,
                tempPhoneNumber: verificationPhoneCode ? verificationPhoneCode._id : undefined,
                isActive: user.isActive
            };
            if (isEmail) {
                var body1 = {
                    aUsername: username,
                    aPass: req.body.password,
                    aPassConfirm: req.body.password,
                    aFullname: req.body.name + req.body.lastName,
                    aTitle: username,
                    userId: usr._id,
                    aGrps: ["5fb38b5de54aaa00062de4cb"],
                    aEmail: username
                };
                var body1Json = JSON.stringify(body1);
                console.log(body1Json);
                fetch("http://localhost:3001/tickets/register", {
                    method: 'POST',
                    body: body1Json,
                    headers: {
                        accessToken: process.env.ACCESS_TOKEN,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (res) { return res.json(); })
                    .then(function (response) { console.log('response: ', response); })["catch"](function (err) { console.log('err: ', err); });
                response_1["default"](res, 'Registration is done successfully', data, { isEmail: isEmail });
                amqp_1.publishQueueConnection(mailOptions);
            }
            else if (isPhoneNumber) {
                var body1 = {
                    aUsername: username,
                    aPass: req.body.password,
                    aPassConfirm: req.body.password,
                    aFullname: req.body.name + req.body.lastName,
                    aTitle: username,
                    //aGrps: [group._id.toString()],
                    userId: usr._id,
                    aEmail: username.concat("@gmail.com")
                };
                var body1Json = JSON.stringify(body1);
                fetch("http://localhost:3001/tickets/register", {
                    method: 'POST',
                    body: body1Json,
                    headers: {
                        accessToken: process.env.ACCESS_TOKEN,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (res) { return res.json(); })
                    .then(function (response) { });
                response_1["default"](res, 'Registration is done successfully', data, { isPhoneNumber: isPhoneNumber });
                fetch('http://rest.ippanel.com/v1/messages/patterns/send', {
                    method: 'POST',
                    body: JSON.stringify(dataSms),
                    headers: {
                        'Authorization': process.env.SMS_API_ACCESS_KEY,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Connection': 'Keep-Alive'
                    }
                })["catch"](function (err) {
                    var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                    logger_1.logger.error(error.message);
                })
                    .then(function (res) { return res.json(); }) // expecting a json response
                    .then(function (response) {
                    if (response.status !== 'OK') {
                        var error = new myError_1["default"]('The Sms service is not responding!', 400, 11, 'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.', 'خطا رخ داد');
                        logger_1.logger.error(error.message);
                    }
                })["catch"](function (err) {
                    logger_1.logger.error(err);
                });
            }
        })["catch"](function (err) {
            if (err.name = 'MongoError' && err.code === 11000) {
                logger_1.logger.error("The save action on User Collection with document " + req.body.lastName + " has some errors: " + err);
                var error = new myError_1["default"]('The user has registered already!', 400, 9, 'شما قبلا ثبت نام کرده اید!', 'خطا رخ داد ');
                next(error);
            }
            else {
                next(err);
            }
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.authRoutes.post('/sendEmailVerificationLink', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('body', 'email'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var email = req.body.email;
    user_1.User.findOne({ email: email })
        .then(function (user) {
        if (!user) {
            var error = new myError_1["default"]("Email address " + email + " is not valid!", 400, 12, 'آدرس ایمیل معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
        else {
            // const rand = uuid4()
            var rand = process.env.NODE_ENV === 'test' ? 'cb0059c2-5566-4967-8c9d-1126d1e9eda5' : uuid4();
            var link = process.env.API + "/verify?type=email&string=" + rand;
            var mailOptions_1 = {
                from: process.env.SENDER_ADDRESS,
                to: email,
                subject: 'Please confirm your Email account',
                html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
            };
            var bodyEmailCode = {
                name: rand
            };
            var newEmailCode_1 = new user_1.VerificationCode(__assign({}, bodyEmailCode));
            newEmailCode_1.save()
                .then(function () {
                user.updateOne({ $set: { emailVerificationString: newEmailCode_1._id } })
                    .then(function () {
                    var data = {
                        email: email
                    };
                    response_1["default"](res, 'Please verify your email', data);
                    amqp_1.publishQueueConnection(mailOptions_1);
                })["catch"](function (err) {
                    next(err);
                });
            })["catch"](function (err) {
                next(err);
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.authRoutes.post('/sendPasswordVerificationLink', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('body', 'email'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var email = req.body.email;
    user_1.User.findOne({ email: email })
        .then(function (user) {
        if (!user) {
            var error = new myError_1["default"]('Email address is not valid!', 400, 12, 'آدرس ایمیل معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
        else {
            var rand = process.env.NODE_ENV === 'test' ? 'e39459ee-18b4-4967-aaaa-f22fb26a8beb' : uuid4();
            // const rand = uuid4()
            var link = process.env.API + "/verify?type=password&string=" + rand;
            var mailOptions_2 = {
                from: process.env.SENDER_ADDRESS,
                to: email,
                subject: 'Please confirm your Email account',
                html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
            };
            var hash = crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
                .update(rand)
                .digest('hex');
            var verificationCode_1 = new user_1.VerificationCode({ code: hash });
            verificationCode_1.save()
                .then(function () {
                user.updateOne({ $set: { resetPasswordVerificationString: mongoose.Types.ObjectId(verificationCode_1._id) } })
                    .then(function () {
                    response_1["default"](res, 'Please verify your email');
                    amqp_1.publishQueueConnection(mailOptions_2);
                })["catch"](function (err) {
                    next(err);
                });
            })["catch"](function (err) {
                next(err);
            });
        }
    })["catch"](function (err) {
        logger_1.logger.error("The find action on User Collection with email " + email + " has some errors: " + err);
        next(err);
    });
}));
exports.authRoutes.post('/resetPassword', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('body', 'id'), validation_1.userValidationRules('body', 'password'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var id = req.body.id;
    var hash = crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
        .update(id)
        .digest('hex');
    user_1.VerificationCode.findOne({ code: hash })
        .then(function (doc) {
        if (!doc) {
            logger_1.logger.warn("ResetPasswordVerificationString " + hash + " is not valid!");
            var error = new myError_1["default"]('Verification Code is not valid!', 400, 5, 'کد راستی آزمایی معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
        else {
            user_1.User.findOne({ resetPasswordVerificationString: doc._id })
                .then(function (user) {
                if (!user) {
                    logger_1.logger.error("The query on User Collection with resetPasswordVerificationString " + id + " has response null!");
                    var error = new myError_1["default"]('Verification Code is not valid!', 400, 5, 'کد راستی آزمایی معتبر نیست!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    user.password = req.body.password;
                    user.resetPasswordVerificationString = undefined;
                    user_1.VerificationCode.deleteOne({ code: hash })["catch"](function (err) {
                        logger_1.logger.error(err);
                    });
                    user.save()
                        .then(function () {
                        var data = {
                            email: user.email.address
                        };
                        response_1["default"](res, 'password is successfuly reset', data);
                    })["catch"](function (err) {
                        next(err);
                    });
                }
            })["catch"](function (err) {
                next(err);
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.authRoutes.post('/resetPasswordWithPhone', preventBruteForce_1.rateLimiterMiddleware, validation_1.userValidationRules('body', 'password'), validation_1.userValidationRules('body', 'passwordConfirm'), 
// userValidationRules('body', 'verificationCode'),
validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    console.log(req.body);
    var password = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;
    var verificationCode = req.body.verificationCode;
    var sessionId = req.cookies.sessionId;
    if (password !== passwordConfirm) {
        var error = new myError_1["default"]('passwords do not match!', 400, 11, 'پسورد ها باهم همخوانی ندارند', 'خطا رخ داد');
        next(error);
    }
    else {
        user_1.VerificationPhoneCode.findOne({ $and: [{ code: verificationCode }, { sessionId: sessionId }] })
            .then(function (item) {
            if (item && item.code.toString() === verificationCode.toString() && item.sessionId.toString() === sessionId.toString()) {
                user_1.User.findOne({ 'phoneNumber.number': item.phoneNumber })
                    .then(function (user) {
                    if (user && user.phoneNumber && user.phoneNumber.number === item.phoneNumber) {
                        if (user.phoneNumber.validated === true) {
                            user.password = password;
                            user.save()
                                .then(function () {
                                item.remove()
                                    .then(function () {
                                    response_1["default"](res, '', user.phoneNumber.number);
                                })["catch"](function (err) { next(err); });
                            })["catch"](function (err) {
                                next(err);
                            });
                        }
                        else {
                            var error = new myError_1["default"]('The phoneNumber is not validated!', 400, 18, 'شماره مورد نظر هنوز راستی آزمایی نشده است!', 'خطا رخ داد');
                            next(error);
                        }
                    }
                    else {
                        var error = new myError_1["default"]('The code is not valid!', 400, 11, 'کد معتبر نیست', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('The code is not valid!', 400, 11, 'کد معتبر نیست', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    }
}));
exports.authRoutes.post('/changePassword', preventBruteForce_1.rateLimiterMiddleware, auth_1.isAuthorized, validation_1.userValidationRules('body', 'password'), validation_1.validate, validation_1.userValidationRules('body', 'newPassword'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    user_1.User.findOne({ email: req.session.email })
        .then(function (user) {
        if (!user) {
            logger_1.logger.warn('Email address is not valid!');
            var error = new myError_1["default"]('Email address is not valid!', 12, 400, 'آدرس ایمیل معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
        else {
            user.comparePasswordPromise(req.body.password)
                .then(function (isMatch) {
                if (!isMatch) {
                    logger_1.logger.warn('Password is not valid!');
                    var error = new myError_1["default"]('Inputs are not valid!', 400, 15, 'ورودی های درخواستی معتبر نیستند!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    user.password = req.body.newPassword;
                    user.save()
                        .then(function () {
                        response_1["default"](res, 'password is successfuly changed');
                    })["catch"](function (err) {
                        next(err);
                    });
                }
            })["catch"](function (err) {
                next(err);
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
// This end point execute the following actions:
// 1. Find the document of a user who send the email.doc
// 2. Compare the Passord to hash of the password which is stored in MongoDB.
// 3. Generate a token and save it in MongoDB.
// 4. Send the tocken as a cookie to client.
exports.authRoutes.post('/login', 
//rateLimiterMiddleware,
//preventBruteForce,
validation_1.userValidationRules('body', 'username'), validation_1.userValidationRules('body', 'password'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var agent = req.useragent;
    var username = req.body.username;
    var isEmail = false;
    var isPhoneNumber = false;
    var query;
    if (validation_1.isEmailValid(username)) {
        isEmail = true;
        query = { 'email.address': username };
    }
    else if (validation_1.isValidMobilePhone(username)) {
        isPhoneNumber = true;
        query = { 'phoneNumber.number': username };
    }
    user_1.User.findOne(query)
        .then(function (user) {
        if (!user) {
            var error = new myError_1["default"]('Email or Password are not valid!', 400, 8, 'نام کاربری یا گذرواژه معتبر نیستند!', 'خطا رخ داد');
            next(error);
        }
        else if (user && isEmail && user.email.validated !== true) {
            var error = new myError_1["default"]('The email is not verified!', 400, 17, 'آدرس ایمیل شما هنوز راستی آزمایی نشده است!', 'خطا رخ داد');
            next(error);
        }
        else if (user && isPhoneNumber && user.phoneNumber.number && user.phoneNumber.validated !== true) {
            var error = new myError_1["default"]('The mobile phone is not verified!', 400, 18, 'شماره موبایل شما هنوز راستی آزمایی نشده است!', 'خطا رخ داد');
            next(error);
        }
        else if (user && user.isActive !== true) {
            var error = new myError_1["default"]('The account is not active!', 400, 18, 'حساب کاربری شما غیرفعال شده است!', 'خطا رخ داد');
            next(error);
        }
        else {
            user.comparePasswordPromise(req.body.password)
                .then(function (isMatch) {
                if (!isMatch) {
                    logger_1.logger.info('Passwords are not match');
                    var error = new myError_1["default"]('Username or Password are not valid!', 400, 8, 'نام کاربری یا گذرواژه معتبر نیستند!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    var userActivity = {
                        action: 'LOGIN',
                        timestamp: Date.now(),
                        device: agent.source,
                        ip: req.ip
                    };
                    user.userActivities.push(userActivity);
                    user.save()
                        .then(function () {
                        req.session.userId = user._id;
                        var profile = {
                            name: user.name,
                            lastName: user.lastName,
                            userId: user._id,
                            userType: user.userType
                        };
                        response_1["default"](res, '', profile);
                    })["catch"](function (err) {
                        logger_1.logger.error("Adding activity has some errors: " + err);
                        var error = new myError_1["default"]('Error happened during the login!', 500, 16, 'در ورود شما مشکلی پیش آمده است!', 'خطا در سرور');
                        next(error);
                    });
                }
            })["catch"](function (err) {
                logger_1.logger.error("comparePassword method has some errors: " + err);
                var error = new myError_1["default"]('Error happened during the login!', 500, 16, 'در ورود شما مشکلی پیش آمده است!', 'خطا در سرور');
                next(error);
            });
        }
    })["catch"](function (err) {
        logger_1.logger.error("The find action on User Collection with email " + req.body.email + " has some errors: " + err);
        var error = new myError_1["default"]('Error happened during the login!', 500, 16, 'در ورود شما مشکلی پیش آمده است!', 'خطا در سرور');
        next(error);
    });
}));
