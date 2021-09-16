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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.adminRoutes = void 0;
var express = require("express");
var logger_1 = require("../api/logger");
var myError_1 = require("../api/myError");
var auth_1 = require("../middlewares/auth");
var user_1 = require("../db/user");
var admin_1 = require("../db/admin");
var currencies_1 = require("../db/currencies");
var validation_1 = require("../middlewares/validation");
var response_1 = require("../middlewares/response");
var tryCtach_1 = require("../middlewares/tryCtach");
var roles = ['Admin', 'Manager', 'Supporter'];
var managerEditableFields = ['name', 'lastName', 'email', 'isActive', 'role'];
var supporterEditableFields = ['name', 'lastName', 'email', 'isActive', 'role'];
var userEditableFields = ['isActive', 'userType'];
exports.adminRoutes = express.Router();
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// AUTH ENDPOINTS   ////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.adminRoutes.post('/addCurrency', 
// isAdmin,
validation_1.userValidationRules('body', 'currencyName'), validation_1.userValidationRules('body', 'persianName'), validation_1.userValidationRules('body', 'abName'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var currencyName = req.body.currencyName;
    var perName = req.body.persianName;
    var abName = req.body.abName;
    var icon = req.body.icon;
    currencies_1.Currencies.findOne({ name: currencyName })
        .then(function (curr) {
        if (curr) {
            var error = new myError_1["default"]('this currency is already exsis', 400, 5, 'ارز فوق  وجود دارد !', 'خطا رخ داد');
            next(error);
        }
        else {
            if ((currencyName === 'BITCOIN' && perName === 'بیت کوین' && abName === 'BTC')
                || (currencyName === 'RIAL' && perName === 'ریال' && abName === 'IRR')
                || (currencyName === 'TRON' && perName === 'ترون' && abName === 'TRX')
                || (currencyName === 'ETHEREUM' && perName === 'اتریوم' && abName === 'ETH')) {
                var currency = {
                    name: currencyName,
                    per_name: perName,
                    ab_name: abName,
                    icon: icon
                };
                var newCurrency_1 = new currencies_1.Currencies(__assign({}, currency));
                newCurrency_1.save()
                    .then(function () {
                    response_1["default"](res, "currency created successfully", newCurrency_1._id);
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('Currency persian name or ab name are not match with currency name', 400, 11, 'نام فارسی ارز یا نام مخفف ارز با نام ارز مطابقت ندارد.', 'خطا رخ داد');
                next(error);
            }
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/register', validation_1.userValidationRules('body', 'email'), validation_1.userValidationRules('body', 'password'), validation_1.userValidationRules('body', 'name'), validation_1.userValidationRules('body', 'lastName'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var email = req.body.email;
    var body = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: email,
        password: req.body.password,
        role: roles[0]
    };
    admin_1.Admin.findOne({ role: roles[0] })
        .then(function (person) {
        if (person && person.role === roles[0]) {
            var error = new myError_1["default"]('The admin already exists!', 400, 4, 'ادمین قبلا ثبت شده است!', 'خطا رخ داد');
            next(error);
        }
        else {
            var user_2 = new admin_1.Admin(__assign({}, body));
            user_2.save()
                .then(function () {
                var data = {
                    email: user_2.email,
                    role: user_2.role
                };
                response_1["default"](res, 'Registration is done successfully', data);
            })["catch"](function (err) {
                if (err.name = 'MongoError' && err.code === 11000) {
                    logger_1.logger.error("The save action on User Collection with document " + email + " has some errors: " + err);
                    var error = new myError_1["default"]('The user has registered already!', 400, 9, 'شما قبلا ثبت نام کرده اید!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    logger_1.logger.error("The save action on User Collection with document " + email + " has some errors: " + err);
                    var error = new myError_1["default"]('Error happened during the registration!', 500, 9, 'در فرآیند ثبت نام مشکلی پیش آمده است!', 'خطا در سرور');
                    next(error);
                }
            });
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/login', validation_1.userValidationRules('body', 'email'), validation_1.userValidationRules('body', 'password'), validation_1.validate, 
// preventBruteForce,
tryCtach_1["default"](function (req, res, next) {
    var agent = req.useragent;
    admin_1.Admin.findOne({ email: req.body.email })
        .then(function (person) {
        if (!person) {
            var error = new myError_1["default"]('Email or Password are not valid!', 400, 8, 'ایمیل یا گذرواژه معتبر نیستند!', 'خطا رخ داد');
            next(error);
        }
        else if (person.isActive !== true) {
            var error = new myError_1["default"]('The account is not active!', 400, 18, 'حساب کاربری شما غیرفعال شده است!', 'خطا رخ داد');
            next(error);
        }
        else {
            person.comparePasswordPromise(req.body.password)
                .then(function (isMatch) {
                if (!isMatch) {
                    logger_1.logger.warn('Passwords are not match');
                    var error = new myError_1["default"]('Email or Password are not valid!', 400, 8, 'ایمیل یا گذرواژه معتبر نیستند!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    var adminActivity = {
                        action: 'LOGIN',
                        timestamp: Date.now(),
                        device: agent.source,
                        ip: req.ip
                    };
                    person.adminActivities.push(adminActivity);
                    person.save()
                        .then(function () {
                        req.session.adminId = person._id;
                        var profile = {
                            name: person.name,
                            lastName: person.lastName,
                            userId: person._id,
                            role: person.role
                        };
                        response_1["default"](res, '', profile);
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
exports.adminRoutes.post('/changePassword', auth_1.isAdmin, validation_1.userValidationRules('body', 'password'), validation_1.userValidationRules('body', 'newPassword'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person && person._id.toString() === adminId) {
            person.comparePasswordPromise(req.body.password)
                .then(function (isMatch) {
                if (!isMatch) {
                    logger_1.logger.warn('Password is not valid!');
                    var error = new myError_1["default"]('Inputs are not valid!', 400, 15, 'ورودی های درخواستی معتبر نیستند!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    person.password = req.body.newPassword;
                    person.save()
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
        else {
            logger_1.logger.warn('Email address is not valid!');
            var error = new myError_1["default"]('UserId is not valid!', 400, 12, 'آدرس ایمیل معتبر نیست!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
// This end point delete "Token" of users who want to logout from MongoDB.
exports.adminRoutes.get('/logout', auth_1.isAdmin, tryCtach_1["default"](function (req, res, next) {
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
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// ADMINS ENDPOINTS   ////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.adminRoutes.get('/getTheManager', auth_1.isAdmin, validation_1.userValidationRules('query', 'username'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var username = req.query.username;
    admin_1.Admin.findOne({ $and: [{ email: username }, { role: roles[1] }] })
        .then(function (person) {
        if (person && person.email === username) {
            var result = {
                _id: person._id,
                name: person.name,
                lastName: person.lastName,
                email: person.email,
                isActive: person.isActive === true ?
                    'مجوز فعالیت دارد' :
                    'مجوز فعالیت او لغو شده است',
                role: 'مدیر',
                adminActivities: person.adminActivities
            };
            response_1["default"](res, '', result);
        }
        else {
            var error = new myError_1["default"]('The Manager does not exist!', 400, 11, 'چنین مدیری وجود ندارد!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.get('/getManagersList', auth_1.isAdmin, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person && person._id.toString() === adminId && person.role === roles[0]) {
            admin_1.Admin.find({ role: roles[1] })
                .then(function (managers) {
                managers = managers.map(function (i) {
                    return {
                        lastName: i.lastName,
                        username: i.email,
                        isActive: i.isActive ?
                            'مجوز فعالیت دارد' :
                            'مجوز فعالیت او لغو شده است'
                    };
                });
                response_1["default"](res, '', managers);
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/editManagers', auth_1.isAdmin, validation_1.userValidationRules('body', '_id'), validation_1.userValidationRules('body', 'managerName'), validation_1.userValidationRules('body', 'managerLastName'), validation_1.userValidationRules('body', 'managerEmail'), validation_1.userValidationRules('body', 'managerIsActive'), validation_1.userValidationRules('body', 'managerRole'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    var managerId = req.body._id;
    var body = {
        name: req.body.managerName,
        lastName: req.body.managerLastName,
        email: req.body.managerEmail,
        isActive: req.body.managerIsActive,
        role: req.body.managerRole
    };
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person.role === roles[0]) {
            admin_1.Admin.findOne({ _id: managerId })
                .then(function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(manager && manager._id.toString() === managerId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Object.keys(body).map(function (element) {
                                    if (body["" + element] || ((element === 'isActive') && (body['isActive'] === true || body['isActive'] === false))) {
                                        if (managerEditableFields.includes(element)) {
                                            manager["" + element] = body["" + element];
                                        }
                                        else {
                                            logger_1.logger.warn('Some fields are not existed or valid.');
                                            var error = new myError_1["default"]('Some fields are not existed or valid.', 400, 1, 'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!', 'خطا رخ داد');
                                            throw (error);
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            manager.save()
                                .then(function () {
                                var result = {
                                    _id: manager._id,
                                    name: manager.name,
                                    lastName: manager.lastName,
                                    email: manager.email,
                                    isActive: manager.isActive,
                                    role: manager.role,
                                    adminActivities: manager.adminActivities
                                };
                                response_1["default"](res, 'The data is chenged successfully!', result);
                            })["catch"](function (err) {
                                next(err);
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            logger_1.logger.warn('The manager does not exist!');
                            error = new myError_1["default"]('The manager does not exist!', 400, 1, 'چنین مدیری در سامانه ثبت نشده است!', 'خطا رخ داد');
                            next(error);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })["catch"](function (err) {
                var message = err.message ? err.message : err;
                logger_1.logger.error(message);
                next(err);
            });
        }
        else {
            logger_1.logger.warn('You are not authorized to do this task!');
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/addManagers', auth_1.isAdmin, validation_1.userValidationRules('body', 'email'), validation_1.userValidationRules('body', 'password'), validation_1.userValidationRules('body', 'name'), validation_1.userValidationRules('body', 'lastName'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person.role === roles[0]) {
            var admin_2 = new admin_1.Admin({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                lastName: req.body.lastName,
                role: roles[1]
            });
            admin_2.save()
                .then(function () {
                var manager = {
                    email: admin_2.email,
                    name: admin_2.name,
                    lastName: admin_2.lastName,
                    role: admin_2.role
                };
                response_1["default"](res, 'The manager is added successfully!', manager);
            })["catch"](function (err) {
                if (err.name = 'MongoError' && err.code === 11000) {
                    logger_1.logger.warn("The save action on User Collection with document " + req.body.lastName + " has some errors: " + err);
                    var error = new myError_1["default"]('The user has registered already!', 400, 9, 'کاربر قبلا ثبت نام کرده است!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    logger_1.logger.error("The save action on User Collection with document " + req.body.lastName + " has some errors: " + err);
                    var error = new myError_1["default"]('Error happened during the registration!', 500, 9, 'در فرآیند ثبت نام مشکلی پیش آمده است!', 'خطا رخ داد');
                    next(error);
                }
            });
        }
        else {
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.get('/getTheSupporter', validation_1.userValidationRules('query', 'username'), validation_1.validate, auth_1.isAdmin, tryCtach_1["default"](function (req, res, next) {
    var username = req.query.username;
    admin_1.Admin.findOne({ $and: [{ email: username }, { role: roles[2] }] })
        .then(function (person) {
        if (person && person.email === username) {
            var result = {
                _id: person._id,
                name: person.name,
                lastName: person.lastName,
                email: person.email,
                isActive: person.isActive === true ?
                    'مجوز فعالیت دارد' :
                    'مجوز فعالیت او لغو شده است',
                role: 'پشتیبان',
                adminActivities: person.adminActivities
            };
            response_1["default"](res, '', result);
        }
        else {
            var error = new myError_1["default"]('The supporter does not exist!', 400, 11, 'چنین پشتیبانی وجود ندارد!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.get('/getSupportersList', auth_1.isAdmin, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person && person._id.toString() === adminId && [roles[0], roles[1]].includes(person.role)) {
            admin_1.Admin.find({ role: roles[2] })
                .then(function (supporters) {
                supporters = supporters.map(function (i) {
                    return {
                        lastName: i.lastName,
                        username: i.email,
                        isActive: i.isActive ?
                            'مجوز فعالیت دارد' :
                            'مجوز فعالیت او لغو شده است'
                    };
                });
                response_1["default"](res, '', supporters);
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/editSupporters', auth_1.isAdmin, validation_1.userValidationRules('body', '_id'), validation_1.userValidationRules('body', 'supporterName'), validation_1.userValidationRules('body', 'supporterLastName'), validation_1.userValidationRules('body', 'supporterEmail'), validation_1.userValidationRules('body', 'supporterIsActive'), validation_1.userValidationRules('body', 'supporterRole'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    var supporterId = req.body._id;
    var body = {
        name: req.body.supporterName,
        lastName: req.body.supporterLastName,
        email: req.body.supporterEmail,
        isActive: req.body.supporterIsActive,
        role: req.body.supporterRole
    };
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person.role === roles[0] || person.role === roles[1]) {
            admin_1.Admin.findOne({ _id: supporterId })
                .then(function (supporter) { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(supporter && supporter._id.toString() === supporterId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Object.keys(body).map(function (element) {
                                    if (body["" + element] || (element === 'isActive') && (body['isActive'] === true || body['isActive'] === false)) {
                                        console.log(element);
                                        if (supporterEditableFields.includes(element)) {
                                            supporter["" + element] = body["" + element];
                                        }
                                        else {
                                            logger_1.logger.warn('Some fields are not existed or valid.');
                                            var error = new myError_1["default"]('Some fields are not existed or valid.', 400, 1, 'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!', 'خطا رخ داد');
                                            throw (error);
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            supporter.save()
                                .then(function () {
                                var result = {
                                    _id: supporter._id,
                                    name: supporter.name,
                                    lastName: supporter.lastName,
                                    email: supporter.email,
                                    isActive: supporter.isActive,
                                    role: supporter.role,
                                    adminActivities: supporter.adminActivities
                                };
                                response_1["default"](res, 'The data is chenged successfully!', result);
                            })["catch"](function (err) {
                                var message = err.message ? err.message : err;
                                logger_1.logger.error(message);
                                next(err);
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            logger_1.logger.warn('The supporter does not exist!');
                            error = new myError_1["default"]('The supporter does not exist!', 400, 1, 'چنین پشتیبانی در سامانه ثبت نشده است!', 'خطا رخ داد');
                            next(error);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })["catch"](function (err) {
                var message = err.message ? err.message : err;
                logger_1.logger.error(message);
                next(err);
            });
        }
        else {
            logger_1.logger.warn('You are not authorized to do this task!');
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/addSupporters', auth_1.isAdmin, validation_1.userValidationRules('body', 'email'), validation_1.userValidationRules('body', 'password'), validation_1.userValidationRules('body', 'name'), validation_1.userValidationRules('body', 'lastName'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var adminId = req.session.adminId;
    admin_1.Admin.findOne({ _id: adminId })
        .then(function (person) {
        if (person.role === roles[0] || person.role === roles[1]) {
            var admin_3 = new admin_1.Admin({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                lastName: req.body.lastName,
                role: roles[2]
            });
            admin_3.save()
                .then(function () {
                var supporter = {
                    email: admin_3.email,
                    name: admin_3.name,
                    lastName: admin_3.lastName,
                    role: admin_3.role
                };
                response_1["default"](res, 'The manager is added successfully!', supporter);
            })["catch"](function (err) {
                if (err.name = 'MongoError' && err.code === 11000) {
                    logger_1.logger.warn("The save action on User Collection with document " + req.body.lastName + " has some errors: " + err);
                    var error = new myError_1["default"]('The user has registered already!', 400, 9, 'کاربر قبلا ثبت نام کرده است!', 'خطا رخ داد');
                    next(error);
                }
                else {
                    logger_1.logger.error("The save action on User Collection with document " + req.body.lastName + " has some errors: " + err);
                    var error = new myError_1["default"]('Error happened during the registration!', 500, 9, 'در فرآیند ثبت نام مشکلی پیش آمده است!', 'خطا رخ داد');
                    next(error);
                }
            });
        }
        else {
            var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.adminRoutes.post('/editUserProfile', auth_1.isAdmin, validation_1.userValidationRules('body', '_id'), validation_1.userValidationRules('body', 'userIsActive'), validation_1.userValidationRules('body', 'userUserType'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    console.log(req.body);
    var userId = req.body._id;
    var adminId = req.session.adminId;
    var body = {
        isActive: req.body.userIsActive,
        userType: req.body.userUserType
    };
    user_1.User.findOne({ _id: userId })
        .then(function (user) {
        if (user && user._id.toString() === userId) {
            admin_1.Admin.findOne({ _id: adminId })
                .then(function (person) { return __awaiter(void 0, void 0, void 0, function () {
                var error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(person && person._id.toString() === adminId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, Object.keys(body).map(function (element) {
                                    if (body["" + element] || (element === 'isActive') && (body['isActive'] === true || body['isActive'] === false)) {
                                        if (userEditableFields.includes(element)) {
                                            if (element === 'userType' && body["" + element] === 'Vip') {
                                                if (person.role === roles[0]) {
                                                    user["" + element] = body["" + element];
                                                }
                                                else {
                                                    var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
                                                    throw (error);
                                                }
                                            }
                                            else {
                                                if ([roles[0], roles[1]].includes(person.role)) {
                                                    user["" + element] = body["" + element];
                                                }
                                                else {
                                                    var error = new myError_1["default"]('You are not authorized to do this task!', 400, 1, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
                                                    throw (error);
                                                }
                                            }
                                        }
                                        else {
                                            logger_1.logger.warn('Some fields are not existed or valid.');
                                            var error = new myError_1["default"]('Some fields are not existed or valid.', 400, 1, 'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!', 'خطا رخ داد');
                                            throw (error);
                                        }
                                    }
                                })];
                        case 1:
                            _a.sent();
                            user.save()
                                .then(function () {
                                var result = {
                                    _id: user._id,
                                    isActive: user.isActive,
                                    userType: user.userType,
                                    name: user.name,
                                    lastName: user.lastName,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber
                                };
                                response_1["default"](res, 'The user is changed successfully!', result);
                            })["catch"](function (err) {
                                var message = err.message ? err.message : err;
                                logger_1.logger.error(message);
                                next(err);
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            logger_1.logger.warn('The admin does not exist!');
                            error = new myError_1["default"]('The admin does not exist!', 400, 1, 'چنین ادمینی در سامانه ثبت نشده است!', 'خطا رخ داد');
                            next(error);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); })["catch"](function (err) {
                next(err);
            });
        }
        else {
            logger_1.logger.warn('The user does not exist!');
            var error = new myError_1["default"]('The user does not exist!', 400, 1, 'چنین کاربری در سامانه ثبت نشده است!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
