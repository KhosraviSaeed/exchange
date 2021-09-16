"use strict";
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
exports.ticketRoutes = void 0;
var express = require("express");
var fetch = require("node-fetch");
var mongoose = require("mongoose");
var logger_1 = require("../api/logger");
var myError_1 = require("../api/myError");
var auth_1 = require("../middlewares/auth");
var response_1 = require("../middlewares/response");
var validation_1 = require("../middlewares/validation");
var tryCtach_1 = require("../middlewares/tryCtach");
var user_1 = require("../db/user");
var mongodb_1 = require("mongodb");
var _ = require("lodash");
var MongoClient = require('mongodb').MongoClient;
var mongoClient = new MongoClient(process.env.MONGO_DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
var connection = mongoClient.connect();
var dbo = mongoClient.db(process.env.MONGO_DATABASE_NAME_TICKETS);
exports.ticketRoutes = express.Router();
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
// connection.then(() => {
//   var dbo = mongoClient.db(process.env.MONGO_DATABASE_NAME)
//   dbo.collection('messages').watch().on('change', next => {
//     const message = next.fullDocument;
//     const ownerId = message.owner
//     dbo.collection('accounts').findOne({ _id: ownerId }, (err, account) => {
//       const email = account.email
//       client.smembers(email, (err, reply) => {
//         const socketIds = reply
//         socketIds.forEach((socketId) => {
//           onlineLoginUsers.to(socketId).emit('my_new_message', message)
//         })
//       })
//     })
//   })
// })
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.ticketRoutes.get('/getTickets', auth_1.isAuthorized, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var newTicketsArr = [];
    var openTicketsArr = [];
    var pendingTicketsArr = [];
    var closedTicketsArr = [];
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: new mongodb_1.ObjectID(userId) })
            .then(function (account) {
            if (account && account.userId.toString() === userId) {
                var ownerId_1 = account._id;
                dbo.collection('tickets').find({ owner: ownerId_1 }).toArray()
                    .then(function (tickets) {
                    var ticketsArr = tickets.map(function (e) {
                        var comments = e.comments.map(function (elm) {
                            if (elm.owner.toString() === ownerId_1.toString()) {
                                elm['ownerType'] = 'User';
                            }
                            else {
                                elm['ownerType'] = 'Admin';
                            }
                            return elm;
                        });
                        var sortedComments = _.orderBy(comments, ['date'], ['desc']);
                        switch (e.status) {
                            case 0:
                                newTicketsArr.push({
                                    _id: e._id,
                                    status: 'جدید',
                                    date: e.date,
                                    subject: e.subject,
                                    issue: e.issue,
                                    comments: sortedComments
                                });
                                break;
                            case 1:
                                openTicketsArr.push({
                                    _id: e._id,
                                    status: 'باز',
                                    date: e.date,
                                    subject: e.subject,
                                    issue: e.issue,
                                    comments: sortedComments
                                });
                                break;
                            case 2:
                                pendingTicketsArr.push({
                                    _id: e._id,
                                    status: 'منتظر پاسخ',
                                    date: e.date,
                                    subject: e.subject,
                                    issue: e.issue,
                                    comments: sortedComments
                                });
                                break;
                            case 3:
                                closedTicketsArr.push({
                                    _id: e._id,
                                    status: 'بسته',
                                    date: e.date,
                                    subject: e.subject,
                                    issue: e.issue,
                                    comments: sortedComments
                                });
                                break;
                            default:
                                break;
                        }
                    });
                    Promise.all(ticketsArr)
                        .then(function () {
                        var modifiedTickets = {
                            newTickets: {
                                newTicketsArr: newTicketsArr,
                                quantity: newTicketsArr.length
                            },
                            openTickets: {
                                openTicketsArr: openTicketsArr,
                                quantity: openTicketsArr.length
                            },
                            pendingTickets: {
                                pendingTicketsArr: pendingTicketsArr,
                                quantity: pendingTicketsArr.length
                            },
                            closedTickets: {
                                closedTicketsArr: closedTicketsArr,
                                quantity: closedTicketsArr.length
                            }
                        };
                        console.log(modifiedTickets);
                        response_1["default"](res, 'The tickets are sent', modifiedTickets);
                    })["catch"](function (err) {
                        next(err);
                    });
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('The user does not have ticket account!', 400, 43, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.get('/startConversation', auth_1.isAuthorized, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: userId })
            .then(function (user) {
            if (user && user.userId.toString() === userId) {
                var ownerId_2 = [user._id];
                var accessToken_1 = user.accessToken;
                var supportId_1 = [];
                dbo.collection('accounts').find({ role: process.env.SUPPORT_ROLE_ID }).toArray()
                    .then(function (docs) {
                    if (docs && docs.length > 0) {
                        var docMap = docs.map(function (doc) {
                            supportId_1.push(doc._id);
                        });
                        Promise.all(docMap)
                            .then(function () {
                            var participants = ownerId_2.concat(supportId_1);
                            var body1 = {
                                owner: ownerId_2,
                                participants: participants
                            };
                            var bodyJson = JSON.stringify(body1);
                            fetch(process.env.TICKET_START_CONVERSATION, {
                                method: 'POST',
                                body: bodyJson,
                                headers: {
                                    accessToken: accessToken_1,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (response) {
                                if (response.success === true && response.conversation.participants.length > 1) {
                                    logger_1.logger.info("A conversation starts successfully for user " + userId + " by id " + response.conversation._id);
                                    response_1["default"](res, 'Conversation started successfully!', response.conversation._id);
                                }
                            })["catch"](function (err) {
                                next(err);
                            });
                        });
                    }
                    else {
                        var error = new myError_1["default"]('There is no supporter!', 400, 43, 'هیچ پشتیبانی ثبت نشده است!', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.post('/deleteTickets', auth_1.isAuthorized, 
// userValidationRules('body', 'ticketIdArray'),
// validate,
tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var ticketIdArray = req.body.ticketIdArray;
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: new mongodb_1.ObjectID(userId) })
            .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
            var ownerId, accessToken, ticketObjectIdArray_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user && user.userId.toString() === userId)) return [3 /*break*/, 2];
                        ownerId = user._id;
                        accessToken = user.accessToken;
                        ticketObjectIdArray_1 = [];
                        return [4 /*yield*/, ticketIdArray.map(function (elemet) {
                                ticketObjectIdArray_1.push(new mongodb_1.ObjectID(elemet));
                            })];
                    case 1:
                        _a.sent();
                        dbo.collection('tickets').updateMany({
                            $and: [{ _id: { $in: ticketObjectIdArray_1 } }, { owner: new mongodb_1.ObjectID(ownerId) }]
                        }, {
                            $set: { deleted: true }
                        })
                            .then(function (result) {
                            if (result && result.matchedCount != 0) {
                                if (result.modifiedCount > 0) {
                                    response_1["default"](res, 'More than 1 tickets deleted!');
                                }
                                else {
                                    response_1["default"](res, 'The ticket were deleted before');
                                }
                            }
                            else {
                                var error = new myError_1["default"]('There is no ticket with your id , and requested ticketid array!', 400, 43, 'تیکتی با اسم شما و همچنین با ایدی ورودی پیدا نشد!', 'خطا رخ داد');
                                next(error);
                            }
                        })["catch"](function (err) {
                            next(err);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                        next(error);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.get('/updateTicketStatus', auth_1.isAuthorized, validation_1.userValidationRules('query', 'ticketId'), validation_1.userValidationRules('query', 'ticketStatus'), validation_1.validate, tryCtach_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, ticketId, status;
    return __generator(this, function (_a) {
        userId = req.session.userId;
        ticketId = req.query.ticketId;
        status = req.query.ticketStatus;
        connection.then(function () {
            dbo.collection('accounts').findOne({ userId: new mongodb_1.ObjectID(userId) })
                .then(function (user) {
                if (user && user.userId.toString() === userId) {
                    var ownerId = user._id;
                    dbo.collection('tickets').updateOne({ _id: new mongodb_1.ObjectID(ticketId), owner: new mongodb_1.ObjectID(ownerId) }, { $set: { status: Number(status) } })
                        .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var error;
                        return __generator(this, function (_a) {
                            if (result && result.matchedCount != 0) {
                                if (result.modifiedCount === 1) {
                                    response_1["default"](res, 'The ticket status is changed successfully!');
                                }
                                else {
                                    response_1["default"](res, 'The ticket status is the same was before!');
                                }
                            }
                            else {
                                error = new myError_1["default"]('There is no ticket with your id , and requested ticketid!', 400, 43, 'تیکتی با اسم شما و همچنین با ایدی ورودی پیدا نشد!', 'خطا رخ داد');
                                next(error);
                            }
                            return [2 /*return*/];
                        });
                    }); })["catch"](function (err) {
                        next(err);
                    });
                }
                else {
                    var error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                next(err);
            });
        })["catch"](function (err) {
            next(err);
        });
        return [2 /*return*/];
    });
}); }));
exports.ticketRoutes.get('/getMessages', auth_1.isAuthorized, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: userId })
            .then(function (doc) {
            if (doc && doc.userId.toString() === userId) {
                var accessToken = doc.accessToken;
                fetch(process.env.TICKET_GET_MESSAGES_URL, {
                    method: 'GET',
                    headers: {
                        accessToken: accessToken,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (res) { return res.json(); })
                    .then(function (response) {
                    if (response.success === true) {
                        logger_1.logger.info("The messages of user " + userId + " is gotten successfully");
                        response_1["default"](res, 'The messages is gotten successfully!');
                    }
                    else {
                        var err = (response.error && response.error.message) ? response.error.message : '';
                        logger_1.logger.warn("Getting messages for user " + userId + " had some problems:" + ' ' + err);
                        var error = new myError_1["default"]('Error happened during the getting messages!', 500, 48, 'در به دست آوردن پیام ها مشکلی پیش آمده است.', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.post('/register', 
//isAuthorized,
tryCtach_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                connection.then(function () {
                    dbo.collection('groups').findOne({}, { session: session })
                        .then(function (group) {
                        if (group && group._id) {
                            var body1 = {
                                aUsername: req.body.aUsername,
                                aPass: req.body.aPass,
                                aPassConfirm: req.body.aPassConfirm,
                                aFullname: req.body.aFullname,
                                userId: req.body.userId,
                                aTitle: req.body.aTitle,
                                aGrps: [group._id.toString()],
                                aRole: process.env.USER_ROLE_ID,
                                aEmail: req.body.aEmail
                            };
                            var body1Json = JSON.stringify(body1);
                            fetch("http://localhost:8118/api/v1/users/create", {
                                method: 'POST',
                                body: body1Json,
                                headers: {
                                    accessToken: process.env.ACCESS_TOKEN,
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (response) {
                                if (response.success === true) {
                                    var supportId_2 = [];
                                    connection.then(function () {
                                        dbo.collection('accounts').find({ role: new mongodb_1.ObjectID("5fb21707795091261c6d2192") }).toArray()
                                            .then(function (docs) {
                                            if (docs && docs.length > 0) {
                                                var docMap = docs.map(function (doc) {
                                                    supportId_2.push(doc._id);
                                                });
                                                Promise.all(docMap)
                                                    .then(function () {
                                                    session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                        var participants;
                                                        return __generator(this, function (_a) {
                                                            participants = group.members.concat(supportId_2);
                                                            return [2 /*return*/, user_1.User.findOne({ _id: userId })
                                                                    .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                                                    var error;
                                                                    return __generator(this, function (_a) {
                                                                        if (user && user._id.toString() === userId.toString()) {
                                                                            group.members = participants;
                                                                        }
                                                                        else {
                                                                            error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                                                                            throw (error);
                                                                        }
                                                                        return [2 /*return*/];
                                                                    });
                                                                }); })["catch"](function (err) {
                                                                    throw (err);
                                                                })];
                                                        });
                                                    }); })
                                                        .then(function () {
                                                        response_1["default"](res, 'The ticket account is created successfully!');
                                                    })["catch"](function (err) {
                                                        logger_1.logger.error(err);
                                                        throw (err);
                                                    })["finally"](function () {
                                                        session.endSession();
                                                    });
                                                })["catch"](function (err) {
                                                    next(err);
                                                });
                                            }
                                            else {
                                                var error = new myError_1["default"]('There is no supporter!', 400, 43, 'هیچ پشتیبانی ثبت نشده است!', 'خطا رخ داد');
                                                next(error);
                                            }
                                        })["catch"](function (err) {
                                            next(err);
                                        });
                                    });
                                }
                                else {
                                    logger_1.logger.warn("Ticket account Could not be created for user with email " + userId);
                                    var error = new myError_1["default"]('Error happened during the creating ticket account!', 500, 49, 'در ایجاد تیکت مشکلی پیش آمده است!', 'خطا رخ داد');
                                    next(error);
                                }
                            })["catch"](function (err) {
                                next(err);
                            });
                        }
                    })["catch"](function (err) {
                        next(err);
                    });
                })["catch"](function (err) {
                    next(err);
                });
                return [2 /*return*/];
        }
    });
}); }));
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS  /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.ticketRoutes.post('/createTicket', auth_1.isAuthorized, validation_1.userValidationRules('body', 'ticketSubject'), validation_1.userValidationRules('body', 'ticketType'), validation_1.userValidationRules('body', 'ticketIssue'), validation_1.userValidationRules('body', 'ticketPriority'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var subject = req.body.ticketSubject;
    var type = req.body.ticketType;
    var issue = req.body.ticketIssue;
    var priority = req.body.ticketPriority;
    var priorityId;
    var typeId;
    var groupId;
    var accessToken;
    var objectId;
    var findPriority = function () {
        return dbo.collection('priorities').findOne({ name: priority })
            .then(function (priorityDoc) {
            if (priorityDoc && priorityDoc.name === priority) {
                priorityId = priorityDoc._id;
            }
            else {
                var error = new myError_1["default"]('Priority is not valid!', 400, 57, 'اولویت دارای اعتبار نیست!', 'خطا رخ داد');
                throw error;
            }
        })["catch"](function (err) {
            throw (err);
        });
    };
    var findType = function () {
        return dbo.collection('tickettypes').findOne({ name: type })
            .then(function (typ) {
            if (typ && typ.name === type) {
                return typeId = typ._id;
            }
            else {
                var error = new myError_1["default"]('Type is not valid!', 400, 57, 'اولویت دارای اعتبار نیست!', 'خطا رخ داد');
                throw error;
            }
        })["catch"](function (err) {
            throw (err);
        });
    };
    var findGroup = function () {
        return dbo.collection('groups').findOne({ name: "Exchange" })
            .then(function (group) {
            if (group && group.name === "Exchange") {
                return groupId = group._id;
            }
            else {
                var error = new myError_1["default"]('Group is not valid!', 400, 57, 'گروه دارای اعتبار نیست!', 'خطا رخ داد');
                throw error;
            }
        })["catch"](function (err) {
            throw (err);
        });
    };
    var findAccount = function () {
        return dbo.collection('accounts').findOne({ userId: new mongodb_1.ObjectID(userId) })
            .then(function (account) {
            console.log(account);
            if (account && account.userId.toString() === userId) {
                accessToken = account.accessToken;
                return objectId = account._id;
            }
            else {
                var error = new myError_1["default"]('user address is not valid!', 400, 12, 'کاربر دارای حساب تیکتینگ نیست', 'خطا رخ داد');
                throw error;
            }
        })["catch"](function (err) {
            throw err;
        });
    };
    connection.then(function () {
        return Promise.all([findAccount(), findGroup(), findPriority(), findType()])
            .then(function () {
            var body = {
                subject: subject,
                issue: issue,
                owner: objectId,
                group: groupId,
                type: typeId,
                priority: priorityId,
                tags: []
            };
            var bodyJson = JSON.stringify(body);
            console.log('bodyJson: ', bodyJson);
            fetch(process.env.TICKET_CREATE_TICKET_URL, {
                method: 'POST',
                body: bodyJson,
                headers: {
                    accessToken: accessToken,
                    'Content-Type': 'application/json'
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (response) {
                if (response.success === true) {
                    logger_1.logger.info("The ticket " + response.ticket._id + " for user " + userId + " is created successfully");
                    response_1["default"](res, 'Ticket created successfully!');
                }
                else {
                    logger_1.logger.error('Error happened during creating ticket account!' + ' ' + response.body);
                    var error = new myError_1["default"]('Error happened during the creating ticket account!', 500, 49, 'در ایجاد تیکت مشکلی پیش آمده است!', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                next(err);
            });
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.post('/addCommentToTicket', auth_1.isAuthorized, validation_1.userValidationRules('body', 'ticketId'), validation_1.userValidationRules('body', 'ticketComment'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var ticketId = req.body.ticketId;
    var comment = req.body.ticketComment;
    var canAddComment = false;
    var findRole = function () {
        return null;
    };
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: new mongodb_1.ObjectID(userId) })
            .then(function (doc) {
            if (doc && doc.userId.toString() === userId.toString()) {
                dbo.collection('tickets').findOne({ _id: new mongodb_1.ObjectID(ticketId) })
                    .then(function (theTicket) {
                    if (theTicket && theTicket._id.toString() === ticketId) {
                        console.log('theTicket.owner: ', theTicket.owner);
                        if (theTicket.owner.toString() === doc._id.toString()) {
                            canAddComment = true;
                        }
                        else {
                            findRole = function () {
                                return dbo.collection('roles').findOne({ _id: new mongodb_1.ObjectID(doc.roleId) })
                                    .then(function (theRole) {
                                    if (theRole && theRole.name !== 'User') {
                                        canAddComment = true;
                                    }
                                })["catch"](function (err) {
                                    throw (err);
                                });
                            };
                        }
                        Promise.all([findRole()])
                            .then(function () {
                            if (canAddComment) {
                                var accessToken = doc.accessToken;
                                var body = {
                                    _id: ticketId,
                                    ticketId: false,
                                    note: false,
                                    owner: doc._id,
                                    comment: comment
                                };
                                var bodyJson = JSON.stringify(body);
                                fetch(process.env.TICKET_ADD_COMMENT_URL, {
                                    method: 'POST',
                                    body: bodyJson,
                                    headers: {
                                        accessToken: accessToken,
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(function (res) { return res.json(); })
                                    .then(function (response) {
                                    if (response.success === true) {
                                        logger_1.logger.info("A comment for ticket " + response.ticket._id + " for user " + userId + " is added successfully");
                                        response_1["default"](res, 'Comment added successfully!');
                                    }
                                    else {
                                        logger_1.logger.warn("Creating ticket for user " + userId + " had some problems:" + ' ' + response.error.message);
                                        var error = new myError_1["default"]('Error happened during the creating ticket account!', 500, 49, 'در ایجاد تیکت مشکلی پیش آمده است!', 'خطا رخ داد');
                                        next(error);
                                    }
                                })["catch"](function (err) {
                                    next(err);
                                });
                            }
                            else {
                                var error = new myError_1["default"]('The user does not have authority!', 400, 62, 'شما مجاز به انجام چنین کاری نیستید!', 'خطا رخ داد');
                                next(error);
                            }
                        })["catch"](function (err) {
                            next(err);
                        });
                    }
                    else {
                        var error = new myError_1["default"]('ticketId is not valid!', 400, 62, 'چنین تیکتی در سیستم ثبت نشده است!', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('OwnerId is not valid!', 400, 62, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.ticketRoutes.post('/sendMessages', auth_1.isAuthorized, 
// userValidationRules('body', 'message'),
// validate,
tryCtach_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var message = req.body.message;
    connection.then(function () {
        dbo.collection('accounts').findOne({ userId: userId })
            .then(function (doc) {
            if (doc && doc.userId.toString() === userId) {
                var ownerId_3 = doc._id;
                var accessToken_2 = doc.accessToken;
                dbo.collection('conversations').findOne({ 'userMeta.userId': ownerId_3 })
                    .then(function (conversation) {
                    var conversationId = conversation._id;
                    var body = {
                        owner: ownerId_3,
                        cId: conversationId,
                        body: message
                    };
                    var bodyJson = JSON.stringify(body);
                    fetch(process.env.TICKET_SEND_MESSAGE_URL, {
                        method: 'POST',
                        body: bodyJson,
                        headers: {
                            accessToken: accessToken_2,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function (res) { return res.json(); })
                        .then(function (response) {
                        if (response.success === true) {
                            logger_1.logger.info("The message for user " + userId + " is sent successfully");
                            response_1["default"](res, 'The message is sent successfully!');
                        }
                        else {
                            var err = (response.error && response.error.message) ? response.error.message : '';
                            logger_1.logger.warn("Sending message for user " + userId + " had some problems:" + ' ' + err);
                            var error = new myError_1["default"]('Error happened during the creating ticket account!', 500, 49, 'در ایجاد تیکت مشکلی پیش آمده است!', 'خطا رخ داد');
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
                var error = new myError_1["default"]('The user does not have valid ticket account!', 400, 45, 'کاربر دارای حساب تیکتینگ نیست!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
