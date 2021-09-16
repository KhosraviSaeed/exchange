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
exports.userRoutes = void 0;
var express = require("express");
var _ = require("lodash");
var mongodb_1 = require("mongodb");
var uuid_1 = require("uuid");
var mongoose = require("mongoose");
var response_1 = require("../middlewares/response");
var auth_1 = require("../middlewares/auth");
var validation_1 = require("../middlewares/validation");
var tryCatch_1 = require("../middlewares/tryCatch");
var user_1 = require("../db/user");
var currencies_1 = require("../db/currencies");
var myError_1 = require("../api/myError");
var acceptedOffers_1 = require("../db/acceptedOffers");
var ActiveOffers_1 = require("../db/ActiveOffers");
var withdrawOffers_1 = require("../db/withdrawOffers");
var getPrice_1 = require("../db/getPrice");
var redis = require("../api/redis");
var socket_1 = require("../api/socket");
var onlineLoginUsers = socket_1.getonlineLoginUsers();
exports.userRoutes = express.Router();
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.userRoutes.get('/getUserWallet', auth_1.isAuthorized, tryCatch_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var rialPrice;
    return redis.hashget("dollarPrice")
        .then(function (rial) {
        rialPrice = Number(rial / 10);
        user_1.User.findOne({ _id: userId })
            .then(function (user) {
            if (user && user._id.toString() === userId.toString()) {
                var walletArray_1 = [];
                var userWallet = user.wallet;
                var totalAsstetsPrice_1 = 0;
                var totalAsstetsPriceRial = 0;
                var status_1 = true;
                var walletMap = userWallet.map(function (wall) {
                    return redis.hashGetAll(wall.currency.toString())
                        .then(function (wallCurr) {
                        if (wallCurr) {
                            var tempWalletArray_1 = {
                                currencyName: wallCurr.currencyName,
                                persianName: wallCurr.per_name,
                                shortName: wallCurr.ab_name,
                                icon: wallCurr.icon,
                                _id: wall.currency.toString(),
                                value: wall.value,
                                commitment: wall.commitment,
                                totalPrice: 0,
                                totalRialPrice: 0
                            };
                            return redis.hashGetAll(wallCurr.ab_name + '-g')
                                .then(function (rate) {
                                if (rate) {
                                    tempWalletArray_1.totalPrice = wall.value * Number(rate.current);
                                    totalAsstetsPrice_1 += tempWalletArray_1.totalPrice;
                                    if (rialPrice) {
                                        tempWalletArray_1.totalRialPrice = Math.ceil(Number(tempWalletArray_1.totalPrice) * rialPrice);
                                        walletArray_1.push(tempWalletArray_1);
                                    }
                                    else {
                                        walletArray_1["totalRialPrice"] = -1;
                                        walletArray_1.push(tempWalletArray_1);
                                    }
                                }
                                else {
                                    status_1 = false;
                                    tempWalletArray_1['totalPrice'] = -1;
                                    walletArray_1.push(tempWalletArray_1);
                                }
                            })["catch"](function (err) {
                                throw (err);
                            });
                        }
                        else {
                            var error = new myError_1["default"]('currency not found!', 400, 5, 'ارز پیدا نشد.!', 'خطا رخ داد');
                            next(error);
                        }
                    })["catch"](function (err) {
                        throw (err);
                    });
                });
                Promise.all(walletMap)
                    .then(function () {
                    response_1["default"](res, 'user wallet data:', walletArray_1);
                })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('user not found!', 400, 5, 'کاربر مربوطه پیدا نشد!', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
exports.userRoutes.get('/getUserAcceptedOffers', auth_1.isAuthorized, validation_1.userValidationRules('query', 'kind'), validation_1.validate, tryCatch_1["default"](function (req, res, next) {
    var kind = req.query.kind;
    var userId = req.session.userId;
    var query = {};
    if (kind === "1") {
        query = { creator: userId };
    }
    else if (kind === "2") {
        query = { acceptor: userId };
    }
    acceptedOffers_1.Accepted_Offers.find(query)
        .then(function (offers) {
        if (offers && Array.isArray(offers) && offers.length > 0) {
            var dataArray_1 = [];
            currencies_1.Currencies.find()
                .then(function (curs) {
                offers.forEach(function (off) {
                    var givenCur = _.find(curs, function (i) { return i._id.toString() === off.curGivenId.toString(); });
                    var takenCur = _.find(curs, function (i) { return i._id.toString() === off.curTakenId.toString(); });
                    if (givenCur && takenCur) {
                        dataArray_1.push({
                            giveCurname: givenCur.currencyName,
                            //giveCurValue: off.curGivenVal,
                            //givenCurPersianName: givenCur.per_name,
                            //givenCurShortName: givenCur.ab_name,
                            //givenCurIcon: givenCur.icon,
                            takenCurname: takenCur.currencyName,
                            //takenCurValue: off.curTakenVal,
                            //takenCurpersianName: takenCur.per_name,
                            //takenCurShortName: takenCur.ab_name,
                            //takenCurIcon: takenCur.icon,
                            //createDate: off.offeredDate,
                            acceptedDate: off.created_at
                        });
                    }
                    else {
                        return;
                    }
                });
                var orderedDataArray = _.orderBy(dataArray_1, function (_a) {
                    var acceptedDate = _a.acceptedDate;
                    return acceptedDate;
                }, ['asc']);
                response_1["default"](res, 'fdasdf', orderedDataArray);
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('there is no offer', 400, 5, 'سفارشی یافت نشد.!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.userRoutes.get('/getUserActiveOffers', auth_1.isAuthorized, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, curId, query, rialObj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.session);
                userId = req.session.userId;
                curId = req.query.curIdOp;
                query = [];
                query.push.apply(query, [{ userId: userId }, { expDate: { $gt: Date.now() } }]);
                if (!mongodb_1.ObjectID.isValid(curId)) return [3 /*break*/, 2];
                return [4 /*yield*/, currencies_1.Currencies.findOne({ name: 'RIAL' })
                        .then(function (rial) {
                        if (rial && rial.name === 'RIAL') {
                            rialObj = rial;
                            query.push({ $or: [
                                    { $and: [{ curGivenId: curId }, { curTakenId: rial._id }] },
                                    { $and: [{ curTakenId: curId }, { curGivenId: rial._id }] }
                                ] });
                        }
                    })["catch"](function (err) {
                        console.log(err);
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                ActiveOffers_1.Active_Offers.find({ $and: query })
                    .then(function (offers) {
                    if (offers && Array.isArray(offers) && offers.length > 0) {
                        var dataArray_2 = [];
                        if (mongodb_1.ObjectID.isValid(curId)) {
                            redis.hashGetAll(curId.toString())
                                .then(function (curObj) {
                                var offersMap = offers.map(function (offer) {
                                    if (offer.curTakenId.toString() === rialObj._id.toString()) {
                                        dataArray_2.push({
                                            GcurrencyName: curObj.currencyName,
                                            GpersianName: curObj.per_name,
                                            GshortName: curObj.ab_name,
                                            Gvalue: offer.curGivenVal,
                                            Gicon: curObj.icon,
                                            TcurrencyName: rialObj.currencyName,
                                            TpersianName: rialObj.per_name,
                                            TshortName: rialObj.ab_name,
                                            Tvalue: offer.curTakenVal,
                                            Ticon: rialObj.icon,
                                            txType: 'sell',
                                            createDate: offer.created_at,
                                            expireDate: offer.expDate,
                                            offerId: offer.offerId
                                        });
                                    }
                                    else {
                                        dataArray_2.push({
                                            GcurrencyName: curObj.currencyName,
                                            GpersianName: curObj.per_name,
                                            GshortName: curObj.ab_name,
                                            Gvalue: offer.curTakenVal,
                                            Gicon: curObj.icon,
                                            TcurrencyName: rialObj.currencyName,
                                            TpersianName: rialObj.per_name,
                                            TshortName: rialObj.ab_name,
                                            Tvalue: offer.curGivenVal,
                                            Ticon: rialObj.icon,
                                            txType: 'buy',
                                            createDate: offer.created_at,
                                            expireDate: offer.expDate,
                                            offerId: offer.offerId
                                        });
                                    }
                                });
                                Promise.all(offersMap)
                                    .then(function () {
                                    var orderedDataArray = _.orderBy(dataArray_2, function (_a) {
                                        var createDate = _a.createDate;
                                        return createDate;
                                    }, ['desc']);
                                    response_1["default"](res, 'fdasdf', orderedDataArray);
                                })["catch"](function (err) {
                                    next(err);
                                });
                            })["catch"](function (err) {
                                console.log(err);
                            });
                        }
                        else {
                            currencies_1.Currencies.find()
                                .then(function (curs) {
                                offers.forEach(function (off) {
                                    var givenCur = _.find(curs, function (i) { return i._id.toString() === off.curGivenId.toString(); });
                                    var takenCur = _.find(curs, function (i) { return i._id.toString() === off.curTakenId.toString(); });
                                    if (givenCur && takenCur) {
                                        dataArray_2.push({
                                            //giveCurValue :off.curGivenVal,
                                            giveCurname: givenCur.currencyName,
                                            //givenCurPersianName : givenCur.per_name,
                                            //givenCurShortName : givenCur.ab_name,
                                            //givenCurIcon : givenCur.icon,
                                            takenCurname: takenCur.currencyName,
                                            //takenCurValue : off.curTakenVal,
                                            //takenCurpersianName: takenCur.per_name,
                                            //takenCurShortName : takenCur.ab_name,
                                            //takenCurIcon : takenCur.icon,
                                            createDate: off.created_at,
                                            expireDate: off.expiredDate
                                        });
                                    }
                                    else {
                                        return;
                                    }
                                });
                                var orderedDataArray = _.orderBy(dataArray_2, function (_a) {
                                    var createDate = _a.createDate;
                                    return createDate;
                                }, ['desc']);
                                response_1["default"](res, 'fdasdf', orderedDataArray);
                            })["catch"](function (err) {
                                next(err);
                            });
                        }
                    }
                    else {
                        response_1["default"](res, 'fdasdf', []);
                    }
                })["catch"](function (err) {
                    next(err);
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.userRoutes.get('/getUserWithdrawnOffers', auth_1.isAuthorized, tryCatch_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    withdrawOffers_1.Withdraw_Offers.findOne({ userId: userId })
        .then(function (theDoc) {
        if (theDoc && theDoc.userId.toString() === userId) {
            if (theDoc.offers && Array.isArray(theDoc.offers) && theDoc.offers.length > 0) {
                var modifiedOffers = _.orderBy(theDoc.offers, ['created_at', ['desc']]);
                response_1["default"](res, '', modifiedOffers);
            }
            else {
                var error = new myError_1["default"]('the user does not have any withdrawnOffers', 400, 44, 'کاربر هیچ پیشنهاد بازپسگیری شده ندارد.', 'خطا رخ داد');
                next(error);
            }
        }
        else {
            var error = new myError_1["default"]('the user does not have any withdrawnOffers', 400, 44, 'کاربر هیچ پیشنهاد بازپسگیری شده ندارد.', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.userRoutes.get('/getOfferById', auth_1.isAuthorized, validation_1.userValidationRules('query', 'type'), validation_1.userValidationRules('query', 'offerId'), validation_1.validate, tryCatch_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var offerId = req.query.offerId;
    var type = req.query.type;
    var data;
    currencies_1.Currencies.find()
        .then(function (currecies) {
        if (type === "1") {
            ActiveOffers_1.Active_Offers.findOne({ $and: [{ offerId: offerId }, { expDate: { $gt: Date.now() } }] })
                .then((function (theOffer) {
                if (theOffer && theOffer.offerId === offerId) {
                    if (theOffer.userId.toString() === userId) {
                        var givenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer.curGivenId.toString(); });
                        var takenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer.curTakenId.toString(); });
                        data = {
                            givenCurName: givenCur.name,
                            takenCurName: takenCur.name,
                            offerCreatedDate: theOffer.created_at,
                            offerExpireDate: theOffer.expDate
                        };
                        response_1["default"](res, '', data);
                    }
                    else {
                        var error = new myError_1["default"]('you do not have pemissions', 400, 5, 'شما دسترسی ندارید!', 'خطا رخ داد');
                        next(error);
                    }
                }
                else {
                    var error = new myError_1["default"]('there is no oofer with given offerId in Acive offers', 400, 5, 'پیشنهاد یافت نشد!', 'خطا رخ داد');
                    next(error);
                }
            }))["catch"](function (err) {
                next(err);
            });
        }
        else if (type === "2") {
            acceptedOffers_1.Accepted_Offers.findOne({ offerId: offerId })
                .then((function (theOffer) {
                if (theOffer && theOffer.offerId === offerId) {
                    if (theOffer.acceptor.toString() === userId || theOffer.creator.toString() === userId) {
                        var givenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer.curGivenId.toString(); });
                        var takenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer.curTakenId.toString(); });
                        data = {
                            givenCurName: givenCur.name,
                            takenCurName: takenCur.name,
                            offerCreatedDate: theOffer.created_at,
                            offerAcceptedDate: theOffer.acceptedDate
                        };
                        response_1["default"](res, '', data);
                    }
                    else {
                        var error = new myError_1["default"]('you do not have pemissions', 400, 5, 'شما دسترسی ندارید!', 'خطا رخ داد');
                        next(error);
                    }
                }
                else {
                    var error = new myError_1["default"]('there is no oofer with given offerId in Accepted offers', 400, 5, 'پیشنهاد یافت نشد!', 'خطا رخ داد');
                    next(error);
                }
            }))["catch"](function (err) {
                next(err);
            });
        }
        else if (type === "3") {
            withdrawOffers_1.Withdraw_Offers.findOne({ 'offers.offerId': offerId })
                .then(function (theDoc) {
                if (theDoc) {
                    if (theDoc.userId.toString() === userId) {
                        var theOffer_1 = _.find(theDoc.offers, function (i) { return i.offerId === offerId; });
                        var givenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer_1.curGivenId.toString(); });
                        var takenCur = _.find(currecies, function (i) { return i._id.toString() === theOffer_1.curTakenId.toString(); });
                        data = {
                            givenCurName: givenCur.name,
                            takenCurName: takenCur.name,
                            offerCreatedDate: theOffer_1.offeredDate,
                            offerwhitdrawDate: theOffer_1.created_at
                        };
                        response_1["default"](res, '', data);
                    }
                    else {
                        var error = new myError_1["default"]('you do not have pemissions', 400, 5, 'شما دسترسی ندارید!', 'خطا رخ داد');
                        next(error);
                    }
                }
                else {
                    var error = new myError_1["default"]('there is no oofer with given offerId in withdraw offers', 400, 5, 'پیشنهاد یافت نشد!', 'خطا رخ داد');
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
exports.userRoutes.get('/acceptOffer', auth_1.isAuthorized, validation_1.userValidationRules('query', 'offerId'), validation_1.validate, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var acceptorId, offerId, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                acceptorId = req.session.userId;
                offerId = req.query.offerId;
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                ActiveOffers_1.Active_Offers.findOne({ offerId: offerId })
                    .then(function (offer) {
                    if (offer && offer.offerId === offerId) {
                        var creatorId_1 = offer.userId;
                        if (creatorId_1.toString() !== acceptorId.toString()) {
                            var exp = new Date(offer.expDate).getTime();
                            if (exp >= Date.now()) {
                                console.log(exp);
                                console.log(offer.expDate);
                                session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, user_1.User.findOne({ _id: acceptorId }).session(session)
                                                .then(function (acceptor) {
                                                var takenObjInAccWal = _.find(acceptor.wallet, function (e) { return e.currency.toString() === offer.curTakenId.toString(); });
                                                if (takenObjInAccWal && takenObjInAccWal.value >= offer.curTakenVal) {
                                                    return user_1.User.findOne({ _id: creatorId_1 }).session(session)
                                                        .then(function (creator) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var givenObjInCreWal, takenObjInCreWal, currencyObj, giveObjInAccWal, currencyObj, bodyAccOffer_1, error;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!(creator && creator._id.toString() === creatorId_1.toString())) return [3 /*break*/, 6];
                                                                    givenObjInCreWal = _.find(creator.wallet, function (e) { return e.currency.toString() === offer.curGivenId.toString(); });
                                                                    if (!givenObjInCreWal) return [3 /*break*/, 5];
                                                                    // take from creator and give to acceptor
                                                                    givenObjInCreWal.commitment -= Number(offer.curGivenVal);
                                                                    takenObjInCreWal = _.find(creator.wallet, function (i) { return i.currency.toString() === offer.curTakenId.toString(); });
                                                                    if (takenObjInCreWal) {
                                                                        takenObjInCreWal.value += offer.curTakenVal;
                                                                    }
                                                                    else {
                                                                        currencyObj = {
                                                                            currency: offer.curTakenId,
                                                                            value: offer.curTakenVal
                                                                        };
                                                                        creator.wallet.push(currencyObj);
                                                                    }
                                                                    takenObjInAccWal.value -= offer.curTakenVal;
                                                                    giveObjInAccWal = _.find(acceptor.wallet, function (e) { return e.currency.toString() === offer.curGivenId.toString(); });
                                                                    if (giveObjInAccWal) {
                                                                        giveObjInAccWal.value += offer.curGivenVal;
                                                                    }
                                                                    else {
                                                                        currencyObj = {
                                                                            currency: offer.curGivenId,
                                                                            value: offer.curGivenVal
                                                                        };
                                                                        acceptor.wallet.push(currencyObj);
                                                                    }
                                                                    bodyAccOffer_1 = {
                                                                        acceptor: acceptorId,
                                                                        creator: creatorId_1,
                                                                        offerId: offer.offerId,
                                                                        curGivenId: offer.curGivenId,
                                                                        curGivenVal: offer.curGivenVal,
                                                                        curTakenId: offer.curTakenId,
                                                                        curTakenVal: offer.curTakenVal,
                                                                        offeredDate: offer.created_at,
                                                                        expiredDate: offer.expDate
                                                                    };
                                                                    currencies_1.Currencies.findOne({ _id: offer.curGivenId })
                                                                        .then(function (currency) {
                                                                        var currentPrice = bodyAccOffer_1.curTakenVal;
                                                                        var min;
                                                                        var max;
                                                                        redis.hashGetAll('L_' + currency.ab_name)
                                                                            .then(function (redisGetObj) {
                                                                            if (redisGetObj != null) {
                                                                                if (currentPrice < redisGetObj['min']) {
                                                                                    min = currentPrice;
                                                                                }
                                                                                else {
                                                                                    min = redisGetObj['min'];
                                                                                    if (currentPrice > redisGetObj['max']) {
                                                                                        max = currentPrice;
                                                                                    }
                                                                                    else {
                                                                                        max = redisGetObj['max'];
                                                                                    }
                                                                                }
                                                                                redis.hashHMset('L_' + currency.ab_name, {
                                                                                    currentPrice: currentPrice,
                                                                                    min: min,
                                                                                    max: max
                                                                                });
                                                                            }
                                                                            else {
                                                                                redis.hashHMset('L_' + currency.ab_name, {
                                                                                    currentPrice: currentPrice,
                                                                                    min: currentPrice,
                                                                                    max: currentPrice
                                                                                });
                                                                            }
                                                                        })["catch"](function (err) {
                                                                            throw (err);
                                                                        });
                                                                    })["catch"](function (err) {
                                                                        throw (err);
                                                                    });
                                                                    return [4 /*yield*/, acceptedOffers_1.Accepted_Offers.create([bodyAccOffer_1], { session: session })];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, creator.save()];
                                                                case 2:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, acceptor.save()];
                                                                case 3:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, offer.remove()];
                                                                case 4:
                                                                    _a.sent();
                                                                    return [3 /*break*/, 6];
                                                                case 5:
                                                                    error = new myError_1["default"]('creator wallet does not have given object', 400, 5, 'در کیف پول فرشنده ارز مورد نظر پیدا نشد', 'خطا رخ داد');
                                                                    throw (error);
                                                                case 6: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })["catch"](function (err) {
                                                        throw (err);
                                                    });
                                                }
                                                else {
                                                    var error = new myError_1["default"]('There is no enough currency in acceptor wallet or acceptor does not have the currency', 400, 5, 'ارز مورد در کیف پول خریدار نیست یا موجودی آن کافی نیست', 'خطا رخ داد');
                                                    throw (error);
                                                }
                                            })["catch"](function (err) {
                                                throw (err);
                                            })];
                                    });
                                }); })
                                    .then(function () {
                                    response_1["default"](res, 'Offer accepted succesfully ', offerId, {});
                                })["catch"](function (err) {
                                    next(err);
                                })["finally"](function () {
                                    session.endSession();
                                });
                            }
                            else {
                                var error = new myError_1["default"]('offer is expired', 400, 5, 'پیشنهاد منقضی شده است.', 'خطا رخ داد');
                                next(error);
                            }
                        }
                        else {
                            var error = new myError_1["default"]('acceptor and creator must be different', 400, 5, 'فروشنده و خریدار باید متفاوت باشند.', 'خطا رخ داد');
                            next(error);
                        }
                    }
                    else {
                        var error = new myError_1["default"]('There is no offer with the given offer Id', 400, 5, 'شناسه پیشنهادی یافت نشد.', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.userRoutes.post('/withdrawOffer', auth_1.isAuthorized, 
// userValidationRules('query','offerId'),
// validate,
tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, offerIds, nowithOffer, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.session.userId;
                offerIds = req.body.offerIds;
                nowithOffer = false;
                console.log('offerIds: ', offerIds);
                console.log('userId: ', userId);
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, user_1.User.findOne({ _id: userId }).session(session)
                                .then(function (user) {
                                return ActiveOffers_1.Active_Offers.find({ $and: [{ offerId: { $in: offerIds } }, { userId: userId }] }).session(session)
                                    .then(function (offers) {
                                    if (offers && offers.length > 0) {
                                        return withdrawOffers_1.Withdraw_Offers.findOne({ userId: userId }).session(session)
                                            .then(function (withOffer) { return __awaiter(void 0, void 0, void 0, function () {
                                            var offersMap;
                                            return __generator(this, function (_a) {
                                                if (!withOffer) {
                                                    nowithOffer = true;
                                                    withOffer = {
                                                        userId: userId,
                                                        offers: []
                                                    };
                                                }
                                                offersMap = offers.map(function (offer, i) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var bodyWithOffer, userWalCurGivenObj, error;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                bodyWithOffer = {
                                                                    userId: userId,
                                                                    offers: {
                                                                        offerId: offer.offerId,
                                                                        curGivenId: offer.curGivenId,
                                                                        curGivenVal: offer.curGivenVal,
                                                                        curTakenId: offer.curTakenId,
                                                                        curTakenVal: offer.curTakenVal,
                                                                        offeredDate: offer.created_at,
                                                                        expiredDate: offer.expDate,
                                                                        withdrawDate: Date.now()
                                                                    }
                                                                };
                                                                userWalCurGivenObj = _.find(user.wallet, function (i) { return i.currency.toString() === offer.curGivenId.toString(); });
                                                                if (!(userWalCurGivenObj && userWalCurGivenObj.commitment >= Number(offer.curGivenVal))) return [3 /*break*/, 2];
                                                                userWalCurGivenObj.value += offer.curGivenVal;
                                                                userWalCurGivenObj.commitment -= Number(offer.curGivenVal);
                                                                withOffer.offers.push(bodyWithOffer.offers);
                                                                console.log('i: ', i);
                                                                return [4 /*yield*/, offer.remove()];
                                                            case 1:
                                                                _a.sent();
                                                                return [3 /*break*/, 3];
                                                            case 2:
                                                                error = new myError_1["default"]('user does not have the given currency in his/her wallet', 400, 5, 'کاربر ارز مورد نظر را در کیف پول ندارد.', 'خطا رخ داد');
                                                                throw (error);
                                                            case 3: return [2 /*return*/];
                                                        }
                                                    });
                                                }); });
                                                return [2 /*return*/, Promise.all(offersMap)
                                                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!nowithOffer) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, withdrawOffers_1.Withdraw_Offers.create([withOffer], { session: session })];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [3 /*break*/, 4];
                                                                case 2: return [4 /*yield*/, withOffer.save()];
                                                                case 3:
                                                                    _a.sent();
                                                                    _a.label = 4;
                                                                case 4: return [4 /*yield*/, user.save()];
                                                                case 5:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })["catch"](function (err) {
                                                        throw err;
                                                    })];
                                            });
                                        }); })["catch"](function (err) {
                                            throw (err);
                                        });
                                    }
                                    else {
                                        var error = new myError_1["default"]('There is no offer with the given Id', 400, 5, 'شناسه پیشنهادی یافت نشد.', 'خطا رخ داد');
                                        throw (error);
                                    }
                                })["catch"](function (err) {
                                    throw (err);
                                });
                            })["catch"](function (err) {
                                throw (err);
                            })];
                    });
                }); })
                    .then(function () {
                    response_1["default"](res, 'Offer removed Successfully. ', true, {});
                })["catch"](function (err) {
                    console.log('error: ', err);
                    next(err);
                })["finally"](function () {
                    session.endSession();
                });
                return [2 /*return*/];
        }
    });
}); }));
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.userRoutes.post('/createOffer', auth_1.isAuthorized, validation_1.userValidationRules('body', 'curGivenId'), validation_1.userValidationRules('body', 'curGivenVal'), validation_1.userValidationRules('body', 'curTakenId'), validation_1.userValidationRules('body', 'curTakenVal'), 
//userValidationRules('body', 'expDate'),
validation_1.validate, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, curGivenId, curGivenVal, curTakenId, curTakenVal, expDate, offerId, bodyOffer, exp, session, err, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.session.userId;
                curGivenId = req.body.curGivenId;
                curGivenVal = req.body.curGivenVal;
                curTakenId = req.body.curTakenId;
                curTakenVal = req.body.curTakenVal;
                expDate = req.body.expDate;
                exp = new Date(expDate);
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                if (exp.getTime() >= Date.now()) {
                    if (curGivenId != curTakenId) {
                        currencies_1.Currencies.findOne({ _id: curGivenId })
                            .then(function (curGivenObj) {
                            currencies_1.Currencies.findOne({ _id: curTakenId })
                                .then(function (curTakenObj) {
                                if (curGivenObj && curTakenObj && curGivenObj._id.toString() === curGivenId.toString() &&
                                    curTakenObj._id.toString() === curTakenId.toString()) {
                                    session.withTransaction(function () {
                                        // console.log("sasan")
                                        return user_1.User.findOne({ _id: userId }).session(session)
                                            .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                            var userWallet, error, error, err;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(user && user._id.toString() === userId.toString())) return [3 /*break*/, 7];
                                                        userWallet = _.find(user.wallet, function (e) { return e.currency.toString() === curGivenId.toString(); }) // object of specific currency in user's wallet
                                                        ;
                                                        if (!userWallet) return [3 /*break*/, 5];
                                                        if (!(userWallet.value >= curGivenVal)) return [3 /*break*/, 3];
                                                        offerId = uuid_1.v4();
                                                        bodyOffer = {
                                                            userId: userId,
                                                            offerId: offerId,
                                                            curGivenId: curGivenId,
                                                            curGivenVal: curGivenVal,
                                                            curTakenId: curTakenId,
                                                            curTakenVal: curTakenVal,
                                                            expDate: expDate,
                                                            rank: user.rank
                                                        };
                                                        userWallet.value = userWallet.value - curGivenVal;
                                                        userWallet.commitment = userWallet.commitment + Number(curGivenVal);
                                                        return [4 /*yield*/, ActiveOffers_1.Active_Offers.create([bodyOffer], { session: session })];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, user.save()];
                                                    case 2:
                                                        _a.sent();
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        error = new myError_1["default"]('Given: user has not enough credit in his/her wallet', 400, 5, 'کاربر مقدار کافی از ارز برای پیشنهاد داده شده را ندارد.', 'خطا رخ داد');
                                                        throw (error);
                                                    case 4: return [3 /*break*/, 6];
                                                    case 5:
                                                        error = new myError_1["default"]('User does not have this kind of currency', 400, 5, 'کیف پول کاربر ارز پیشنهادی را ندارد.', 'خطا رخ داد');
                                                        throw (error);
                                                    case 6: return [3 /*break*/, 8];
                                                    case 7:
                                                        err = new myError_1["default"]('userId not found', 400, 5, 'خطا رخ داد', 'کاربری با این شناسه کاربری پیدا نشد.');
                                                        throw (err);
                                                    case 8: return [2 /*return*/];
                                                }
                                            });
                                        }); })["catch"](function (err) {
                                            throw (err);
                                        });
                                    })
                                        .then(function () {
                                        response_1["default"](res, 'Offer created succesfully ', offerId, {});
                                        var modifiedBodyOffer = {
                                            offerId: bodyOffer.offerId,
                                            curGivenId: bodyOffer.curGivenId,
                                            curGivenVal: bodyOffer.curGivenVal,
                                            curTakenId: bodyOffer.curTakenId,
                                            curTakenVal: bodyOffer.curTakenVal,
                                            expDate: bodyOffer.expDate
                                        };
                                        redis.hashSetMembers(userId)
                                            .then(function (result) {
                                            console.log('result: ', result);
                                        });
                                        onlineLoginUsers.emit('new_offer', modifiedBodyOffer);
                                    })["catch"](function (err) {
                                        console.log('error: ', err);
                                        next(err);
                                    })["finally"](function () {
                                        session.endSession();
                                    });
                                }
                                else {
                                    var err = new myError_1["default"]('curTakenId error', 400, 5, 'ارز وارد شده صحیح نیست', 'خطا رخ داد');
                                    next(err);
                                }
                            })["catch"](function (err) {
                                next(err);
                            });
                        })["catch"](function (err) {
                            next(err);
                        });
                    }
                    else {
                        err = new myError_1["default"]('curGivenId must be different from curTakenId', 400, 5, 'ارز ها برای تبادل باید متفاوت باشند.', 'خطا رخ داد');
                        next(err);
                    }
                }
                else {
                    err = new myError_1["default"]('expire date must be in the future(not before creating offer date)', 400, 5, 'تاریخ انقضای پیشنهاد باید بعد از ایجاد پیشنهاد باشد.', 'خطا رخ داد');
                    next(err);
                }
                return [2 /*return*/];
        }
    });
}); }));
exports.userRoutes.post('/getPrice', auth_1.isAuthorized, validation_1.userValidationRules('body', 'currency'), validation_1.userValidationRules('body', 'quantity'), validation_1.validate, tryCatch_1["default"](function (req, res, next) {
    var userId = req.session.userId;
    var currency = req.body.currency;
    var quantity = req.body.quantity;
    user_1.User.findOne({ _id: userId })
        .then(function (user) {
        if (user && user._id.toString() === userId) {
            getPrice_1.GetPrice.findOne({ $and: [{ currency: currency }, { userId: user._id }] })
                .then(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                var curRialPrice, bodyPrice, newGetPrice, newGetPrice;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, redis.getCurrentPrice(currency)];
                        case 1:
                            curRialPrice = _a.sent();
                            bodyPrice = {
                                currency: currency,
                                userId: user._id,
                                quantity: quantity,
                                rialPricePerUnit: curRialPrice
                            };
                            if (doc) {
                                doc.remove();
                                newGetPrice = new getPrice_1.GetPrice(__assign({}, bodyPrice));
                                newGetPrice.save()
                                    .then(function () {
                                    response_1["default"](res, 'old getPrice doc removed and a new one created', curRialPrice, {});
                                })["catch"](function (err) {
                                    next(err);
                                });
                            }
                            else {
                                newGetPrice = new getPrice_1.GetPrice(__assign({}, bodyPrice));
                                newGetPrice.save()
                                    .then(function () {
                                    response_1["default"](res, 'getPrice doc created', curRialPrice, {});
                                })["catch"](function (err) {
                                    next(err);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('user not found', 400, 5, 'کاربر پیدا نشد', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.userRoutes.post('/addCurrencyValue', auth_1.isAuthorized, validation_1.userValidationRules('body', 'currencyId'), validation_1.userValidationRules('body', 'currencyValue'), validation_1.validate, tryCatch_1["default"](function (req, res, next) {
    var currency = req.body.currencyId;
    var value = Number(req.body.currencyValue);
    console.log("req.body.currencyValue  is type of ", typeof (req.body.currencyValue));
    var userId = req.session.userId;
    currencies_1.Currencies.findOne({ _id: currency })
        .then(function (cur) {
        if (cur && cur._id.toString() === currency) {
            user_1.User.findOne({ _id: userId })
                .then(function (user) {
                if (user && user._id.toString() === userId) {
                    var wall = _.find(user.wallet, function (i) { return i.currency.toString() === currency.toString(); });
                    if (wall) {
                        console.log("wallet value is type of ", typeof (wall.value));
                        console.log(" value is type of ", typeof (value));
                        wall.value += value;
                    }
                    else {
                        user.wallet.push({ currency: cur._id, value: value });
                    }
                    user.save()
                        .then(function () {
                        response_1["default"](res, "value added successfully");
                    })["catch"](function (err) {
                        next(err);
                    });
                }
                else {
                    var error = new myError_1["default"]('user not found!', 400, 5, 'کاربر مربوطه پیدا نشد!', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('currency not found!', 400, 5, 'ارز ها برای تبادل باید متفاوت باشند.', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.userRoutes.post('/transferCuurency', auth_1.isAuthorized, validation_1.userValidationRules('body', 'currencyId'), validation_1.userValidationRules('body', 'currencyValue'), validation_1.userValidationRules('body', 'receiverUsername'), validation_1.validate, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var currency, value, receiverUsername, query, userId, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currency = req.body.currencyId;
                value = req.body.currencyValue;
                receiverUsername = req.body.receiverUsername;
                userId = req.session.userId;
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                currencies_1.Currencies.findOne({ _id: currency })
                    .then(function (curr) {
                    if (curr && curr._id.toString() === currency) {
                        session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, user_1.User.findOne({ _id: userId }).session(session)
                                        .then(function (sender) {
                                        if (sender && sender._id.toString() === userId) {
                                            var theCur = _.find(sender.wallet, function (i) { return i.currency.toString() === currency; });
                                            if (theCur) {
                                                if (Number(theCur.value) >= Number(value)) {
                                                    theCur.value -= value;
                                                    if (validation_1.isEmailValid(receiverUsername)) {
                                                        query = { 'email.address': receiverUsername };
                                                    }
                                                    else if (validation_1.isValidMobilePhone(receiverUsername)) {
                                                        query = { 'phoneNumber.number': receiverUsername };
                                                    }
                                                    return user_1.User.findOne(query).session(session)
                                                        .then(function (receiver) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var theCur2, error;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!receiver) return [3 /*break*/, 7];
                                                                    theCur2 = _.find(receiver.wallet, function (i) { return i.currency.toString() === currency; });
                                                                    if (!theCur2) return [3 /*break*/, 3];
                                                                    theCur2.value += value;
                                                                    return [4 /*yield*/, receiver.save()];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, sender.save()];
                                                                case 2:
                                                                    _a.sent();
                                                                    return [3 /*break*/, 6];
                                                                case 3:
                                                                    receiver.wallet.push({ currency: currency, value: value });
                                                                    return [4 /*yield*/, receiver.save()];
                                                                case 4:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, sender.save()];
                                                                case 5:
                                                                    _a.sent();
                                                                    _a.label = 6;
                                                                case 6: return [3 /*break*/, 8];
                                                                case 7:
                                                                    error = new myError_1["default"]('The reciever does not exist!', 400, 5, 'نام کاربری گیرنده معتبر نیست!', 'خطا رخ داد');
                                                                    throw (error);
                                                                case 8: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })["catch"](function (err) {
                                                        throw (err);
                                                    });
                                                }
                                                else {
                                                    var error = new myError_1["default"]('you do not have enough currency', 400, 5, 'موجودی کافی نیست !', 'خطا رخ داد');
                                                    throw (error);
                                                }
                                            }
                                            else {
                                                var error = new myError_1["default"]('you do not have this currency', 400, 5, 'ارز فوق در کیف پول شما موجود نیست !', 'خطا رخ داد');
                                                throw (error);
                                            }
                                        }
                                        else {
                                            var error = new myError_1["default"]('The user does not exist!', 400, 5, 'چنین کاربری در سیستم ثبت نشده است!', 'خطا رخ داد');
                                            throw (error);
                                        }
                                    })["catch"](function (err) {
                                        throw (err);
                                    })];
                            });
                        }); })
                            .then(function () {
                            response_1["default"](res);
                        })["catch"](function (err) {
                            console.log('error: ', err);
                            next(err);
                        })["finally"](function () {
                            session.endSession();
                        });
                    }
                    else {
                        var error = new myError_1["default"]('the currency is not valid', 400, 5, 'ارز فوق متعبر نیست !', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.userRoutes.post('/chargeAcount', auth_1.isAuthorized, 
// if we want to aurhorize again we need aonther middleware
tryCatch_1["default"](function (req, res, next) {
    var rialObjectId = process.env.OBJECTID_RIAL;
    var value = req.body.value;
    var userId = req.session.userId;
    user_1.User.findOne({ _id: userId })
        .then(function (user) {
        var wall = _.find(user.wallet, function (i) { return i.currency.toString() === rialObjectId; });
        wall.value += value;
        user.save()
            .then(function () {
            response_1["default"](res);
        })["catch"](function (err) {
            next(err);
        });
    })["catch"](function (err) {
        next(err);
    });
}));
