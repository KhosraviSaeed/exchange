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
exports.walletRoutes = void 0;
var express = require("express");
var async_retry_1 = require("async-retry");
var _ = require("lodash");
var mongoose = require("mongoose");
var uuidv4 = require("uuid4");
var user_1 = require("../db/user");
var admin_1 = require("../db/admin");
var getPrice_1 = require("../db/getPrice");
var acceptedOffers_1 = require("../db/acceptedOffers");
var activeOffers_1 = require("../db/activeOffers");
var validation_1 = require("../middlewares/validation");
var tryCatch_1 = require("../middlewares/tryCatch");
var auth_1 = require("../middlewares/auth");
var response_1 = require("../middlewares/response");
var redis = require("../api/redis");
var myError_1 = require("../api/myError");
var suggestOffers_1 = require("../api/suggestOffers");
var etheriumWallet = require("../api/walletApi/etheriuem");
var transferFromExchange_1 = require("../api/walletApi/transferFromExchange");
var transferToExchangeById_1 = require("../api/walletApi/transferToExchangeById");
exports.walletRoutes = express.Router();
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
exports.walletRoutes.get('/getEtheriumNonce', auth_1.isAuthorized, validation_1.userValidationRules('query', 'etheriumAccountAddress'), validation_1.validate, tryCatch_1["default"](function (req, res, next) {
    var etheriumAccountAddress = req.query.etheriumAccountAddress;
    etheriumWallet.getEtheriumNonce(etheriumAccountAddress)
        .then(function (result) {
        response_1["default"](res, 'Getting nonce completed successfully', Number(result), {});
    })["catch"](function (err) {
        next(err);
    });
}));
exports.walletRoutes.post('/buyCurrency', auth_1.isAuthorized, validation_1.userValidationRules('body', 'currency'), validation_1.validate, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, currency, quantity, price;
    return __generator(this, function (_a) {
        userId = req.session.userId;
        currency = req.body.currency;
        quantity = req.body.quantity;
        getPrice_1.GetPrice.findOne({ $and: [{ currency: currency }, { userId: userId }] })
            .then(function (priceObj) { return __awaiter(void 0, void 0, void 0, function () {
            var curRialPrice, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(priceObj && priceObj.currency.toString() === currency.toString() && priceObj.userId.toString() === userId.toString())) return [3 /*break*/, 2];
                        return [4 /*yield*/, redis.getCurrentPrice(currency)];
                    case 1:
                        curRialPrice = _a.sent();
                        if (curRialPrice > priceObj.rialPricePerUnit) {
                            price = priceObj.rialPricePerUnit;
                        }
                        else {
                            price = curRialPrice;
                        }
                        redis.hashGetAll("RIAL")
                            .then(function (rialObject) { return __awaiter(void 0, void 0, void 0, function () {
                            var errorCounter_1, session_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!Boolean(process.env.BUYFROMOFFERS)) return [3 /*break*/, 1];
                                        errorCounter_1 = 5;
                                        async_retry_1["default"](function (bail) { return __awaiter(void 0, void 0, void 0, function () {
                                            var session, offerIds, suggestedOffers;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, mongoose.startSession()];
                                                    case 1:
                                                        session = _a.sent();
                                                        offerIds = [];
                                                        return [4 /*yield*/, suggestOffers_1.suggestOffers({ userId: userId, price: priceObj.rialPricePerUnit, capacity: quantity, offerType: 'buy', currencyId: currency, rialId: rialObject.id })];
                                                    case 2:
                                                        suggestedOffers = _a.sent();
                                                        if (!(suggestedOffers && Array.isArray(suggestedOffers.subset))) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, suggestedOffers.subset.map(function (e) {
                                                                return e.id;
                                                            })];
                                                    case 3:
                                                        offerIds = _a.sent();
                                                        return [3 /*break*/, 5];
                                                    case 4: throw 'No suggested offers!';
                                                    case 5: return [2 /*return*/, session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                return [2 /*return*/, activeOffers_1.Active_Offers.find({ offerId: { $in: offerIds } }).session(session)
                                                                        .then(function (offers) {
                                                                        if (offers.length !== offerIds.length) {
                                                                            var error = new myError_1["default"]();
                                                                            throw error;
                                                                        }
                                                                        else {
                                                                            return user_1.User.findOne({ _id: userId }).session(session)
                                                                                .then(function (buyerUser) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                return __generator(this, function (_a) {
                                                                                    return [2 /*return*/, admin_1.Admin.findOne({}).session(session)
                                                                                            .then(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                            var givenObjInBuyer, takenObjInBuyer, givenCurrencyValueObject, orderAcceptor;
                                                                                            return __generator(this, function (_a) {
                                                                                                givenObjInBuyer = _.find(buyerUser.wallet, function (e) { return e.currency.toString() === priceObj.currency.toString(); });
                                                                                                takenObjInBuyer = _.find(buyerUser.wallet, function (e) { return e.currency.toString() === rialObject.id.toString(); });
                                                                                                if (!givenObjInBuyer) {
                                                                                                    givenCurrencyValueObject = {
                                                                                                        currency: priceObj.currency,
                                                                                                        value: 0
                                                                                                    };
                                                                                                    buyerUser.wallet.push(givenCurrencyValueObject);
                                                                                                    givenObjInBuyer = givenCurrencyValueObject;
                                                                                                }
                                                                                                orderAcceptor = offers.map(function (individualOffer) {
                                                                                                    var buyOrderId = uuidv4();
                                                                                                    var sellerId = individualOffer.userId;
                                                                                                    return user_1.User.findOne({ _id: sellerId }).session(session)
                                                                                                        .then(function (creator) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                                        var givenObjInCreWal, takenObjInCreWal, currencyObj, bodyAccOffer, error, error;
                                                                                                        return __generator(this, function (_a) {
                                                                                                            switch (_a.label) {
                                                                                                                case 0:
                                                                                                                    if (!(creator && creator._id.toString() === sellerId.toString())) return [3 /*break*/, 5];
                                                                                                                    givenObjInCreWal = _.find(creator.wallet, function (e) { return e.currency.toString() === individualOffer.curGivenId.toString(); });
                                                                                                                    if (!givenObjInCreWal) return [3 /*break*/, 3];
                                                                                                                    givenObjInCreWal.commitment -= Number(individualOffer.curGivenVal);
                                                                                                                    takenObjInCreWal = _.find(creator.wallet, function (i) { return i.currency.toString() === individualOffer.curTakenId.toString(); });
                                                                                                                    if (takenObjInCreWal) {
                                                                                                                        takenObjInCreWal.value += individualOffer.curTakenVal;
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        currencyObj = {
                                                                                                                            currency: individualOffer.curTakenId,
                                                                                                                            value: individualOffer.curTakenVal
                                                                                                                        };
                                                                                                                        creator.wallet.push(currencyObj);
                                                                                                                        takenObjInCreWal = currencyObj;
                                                                                                                    }
                                                                                                                    takenObjInBuyer.value -= individualOffer.curTakenVal;
                                                                                                                    givenObjInBuyer.value += individualOffer.curGivenVal;
                                                                                                                    bodyAccOffer = {
                                                                                                                        acceptor: admin._id,
                                                                                                                        creator: sellerId,
                                                                                                                        offerId: individualOffer.offerId,
                                                                                                                        curGivenId: individualOffer.curGivenId,
                                                                                                                        curGivenVal: individualOffer.curGivenVal,
                                                                                                                        curTakenId: individualOffer.curTakenId,
                                                                                                                        curTakenVal: individualOffer.curTakenVal,
                                                                                                                        offeredDate: individualOffer.created_at,
                                                                                                                        expiredDate: individualOffer.expDate,
                                                                                                                        buyOrderId: buyOrderId
                                                                                                                    };
                                                                                                                    return [4 /*yield*/, creator.save()];
                                                                                                                case 1:
                                                                                                                    _a.sent();
                                                                                                                    return [4 /*yield*/, acceptedOffers_1.Accepted_Offers.create([bodyAccOffer], { session: session })];
                                                                                                                case 2:
                                                                                                                    _a.sent();
                                                                                                                    return [3 /*break*/, 4];
                                                                                                                case 3:
                                                                                                                    error = new myError_1["default"]('creator wallet does not have given object', 400, 5, 'در کیف پول فرشنده ارز مورد نظر پیدا نشد', 'خطا رخ داد');
                                                                                                                    throw (error);
                                                                                                                case 4: return [3 /*break*/, 6];
                                                                                                                case 5:
                                                                                                                    error = new myError_1["default"]('failed to accept an offer', 400, 5, 'موفق به پذیرش یک آفر نشدیم', 'خطا رخ داد');
                                                                                                                    throw (error);
                                                                                                                case 6: return [2 /*return*/];
                                                                                                            }
                                                                                                        });
                                                                                                    }); })["catch"](function (err) {
                                                                                                        throw (err);
                                                                                                    });
                                                                                                });
                                                                                                return [2 /*return*/, Promise.all(orderAcceptor)
                                                                                                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                                                        return __generator(this, function (_a) {
                                                                                                            switch (_a.label) {
                                                                                                                case 0: 
                                                                                                                //  buyerUser.password = undefined
                                                                                                                return [4 /*yield*/, buyerUser.save()];
                                                                                                                case 1:
                                                                                                                    //  buyerUser.password = undefined
                                                                                                                    _a.sent();
                                                                                                                    return [2 /*return*/];
                                                                                                            }
                                                                                                        });
                                                                                                    }); })["catch"](function (err) {
                                                                                                        throw (err);
                                                                                                    })];
                                                                                            });
                                                                                        }); })["catch"](function (err) {
                                                                                            throw (err);
                                                                                        })];
                                                                                });
                                                                            }); })["catch"](function (err) {
                                                                                throw (err);
                                                                            });
                                                                        }
                                                                    })["catch"](function (err) {
                                                                        throw (err);
                                                                    })];
                                                            });
                                                        }); })
                                                            .then(function () {
                                                            response_1["default"](res, 'Buying process finished successfully', true, {});
                                                        })["catch"](function (err) {
                                                            errorCounter_1--;
                                                            if (errorCounter_1 == 0) {
                                                                next(err);
                                                            }
                                                            else {
                                                                throw (err);
                                                            }
                                                        })["finally"](function () {
                                                            session.endSession();
                                                        })];
                                                }
                                            });
                                        }); }, {
                                            maxTimeout: 5000,
                                            retries: 5
                                        });
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, mongoose.startSession()];
                                    case 2:
                                        session_1 = _a.sent();
                                        session_1.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, user_1.User.findOne({ _id: userId }).session(session_1)
                                                        .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var rialWalInUser, error;
                                                        return __generator(this, function (_a) {
                                                            rialWalInUser = _.find(user.wallet, function (i) { return i.currency.toString() === rialObject.id.toString(); });
                                                            if (rialWalInUser.value >= priceObj.rialPrice) {
                                                                return [2 /*return*/, admin_1.Admin.findOne({}).session(session_1)
                                                                        .then(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                                                                        var rialWalInAdmin, curWalInUser, curWalInAdmin, bodyCurrency;
                                                                        return __generator(this, function (_a) {
                                                                            switch (_a.label) {
                                                                                case 0:
                                                                                    rialWalInAdmin = _.find(admin.wallet, function (i) { return i.currency.toString() === rialObject.id.toString(); });
                                                                                    curWalInUser = _.find(user.wallet, function (i) { return i.currency.toString() === currency.toString(); });
                                                                                    curWalInAdmin = _.find(admin.wallet, function (i) { return i.currency.toString() === currency.toString(); });
                                                                                    if (!curWalInUser) return [3 /*break*/, 4];
                                                                                    curWalInUser.value += Number(priceObj.quantity);
                                                                                    curWalInAdmin.value -= Number(priceObj.quantity);
                                                                                    rialWalInUser.value -= Number(priceObj.rialPrice);
                                                                                    rialWalInAdmin.value += Number(priceObj.rialPrice);
                                                                                    return [4 /*yield*/, admin.save()];
                                                                                case 1:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, user.save()];
                                                                                case 2:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, priceObj.remove()];
                                                                                case 3:
                                                                                    _a.sent();
                                                                                    return [3 /*break*/, 8];
                                                                                case 4:
                                                                                    bodyCurrency = {
                                                                                        currency: currency,
                                                                                        value: priceObj.quantity,
                                                                                        commitment: 0
                                                                                    };
                                                                                    user.wallet.push(bodyCurrency);
                                                                                    rialWalInUser.value -= priceObj.rialPrice;
                                                                                    rialWalInAdmin.value += priceObj.rialPrice;
                                                                                    curWalInAdmin.value -= priceObj.quantity;
                                                                                    return [4 /*yield*/, admin.save()];
                                                                                case 5:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, user.save()];
                                                                                case 6:
                                                                                    _a.sent();
                                                                                    return [4 /*yield*/, priceObj.remove()];
                                                                                case 7:
                                                                                    _a.sent();
                                                                                    _a.label = 8;
                                                                                case 8: return [2 /*return*/];
                                                                            }
                                                                        });
                                                                    }); })["catch"](function (err) {
                                                                        throw err;
                                                                    })];
                                                            }
                                                            else {
                                                                error = new myError_1["default"]('User does not have enough rial credit in his/her wallet.', 400, 5, 'کاربر ارز ریالی کافی برای خرید را ندارد.', 'خطا رخ داد');
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
                                            response_1["default"](res, 'Buying process finished successfully', true, {});
                                        })["catch"](function (err) {
                                            next(err);
                                        })["finally"](function () {
                                            session_1.endSession();
                                        });
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (err) {
                            next(err);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error = new myError_1["default"]('There is no price in GetPrice', 400, 5, 'قیمت معادل ریالی پیدا نشد.', 'خطا رخ داد');
                        next(error);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); })["catch"](function (err) {
            next(err);
        });
        return [2 /*return*/];
    });
}); }));
exports.walletRoutes.post('/sellCurrency', auth_1.isAuthorized, validation_1.userValidationRules('body', 'currency'), validation_1.validate, tryCatch_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, currency, quantity;
    return __generator(this, function (_a) {
        userId = req.session.userId;
        currency = req.body.currency;
        quantity = req.body.quantity;
        getPrice_1.GetPrice.findOne({ $and: [{ currency: currency }, { userId: userId }] })
            .then(function (priceObj) {
            if (priceObj && priceObj.currency.toString() === currency.toString() && priceObj.userId.toString() === userId.toString()) {
                redis.hashGetAll("RIAL")
                    .then(function (rialObject) { return __awaiter(void 0, void 0, void 0, function () {
                    var errorCounter_2, session_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!Boolean(process.env.BUYFROMOFFERS)) return [3 /*break*/, 1];
                                errorCounter_2 = 5;
                                async_retry_1["default"](function (bail) { return __awaiter(void 0, void 0, void 0, function () {
                                    var session, offerIds, suggestedOffers;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, mongoose.startSession()];
                                            case 1:
                                                session = _a.sent();
                                                offerIds = [];
                                                return [4 /*yield*/, suggestOffers_1.suggestOffers({ userId: userId, price: priceObj.rialPricePerUnit, capacity: quantity, offerType: 'buy', currencyId: currency, rialId: rialObject.id })];
                                            case 2:
                                                suggestedOffers = _a.sent();
                                                if (!(suggestedOffers && Array.isArray(suggestedOffers.subset))) return [3 /*break*/, 4];
                                                return [4 /*yield*/, suggestedOffers.subset.map(function (e) {
                                                        return e.id;
                                                    })];
                                            case 3:
                                                offerIds = _a.sent();
                                                return [3 /*break*/, 5];
                                            case 4: throw 'No suggested offers!';
                                            case 5: return [2 /*return*/, session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, activeOffers_1.Active_Offers.find({}).session(session)
                                                                .then(function (offers) {
                                                                if (offers.length == offerIds.length) {
                                                                    console.log("testing");
                                                                }
                                                                else {
                                                                    return user_1.User.findOne({ _id: userId }).session(session)
                                                                        .then(function (buyerUser) { return __awaiter(void 0, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            return [2 /*return*/, admin_1.Admin.findOne({}).session(session)
                                                                                    .then(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                    var givenObjInBuyer, takenObjInBuyer, takenCurrencyValueObject, orderAcceptor;
                                                                                    return __generator(this, function (_a) {
                                                                                        givenObjInBuyer = _.find(buyerUser.wallet, function (e) { return e.currency.toString() === priceObj.currency.toString(); });
                                                                                        takenObjInBuyer = _.find(buyerUser.wallet, function (e) { return e.currency.toString() === rialObject.id.toString(); });
                                                                                        if (!takenObjInBuyer) {
                                                                                            takenCurrencyValueObject = {
                                                                                                currency: rialObject.id,
                                                                                                value: 0
                                                                                            };
                                                                                            buyerUser.wallet.push(takenCurrencyValueObject);
                                                                                            takenObjInBuyer = takenCurrencyValueObject;
                                                                                        }
                                                                                        orderAcceptor = offers.map(function (individualOffer) {
                                                                                            var buyOrderId = uuidv4();
                                                                                            var sellerId = individualOffer.userId;
                                                                                            return user_1.User.findOne({ _id: sellerId }).session(session)
                                                                                                .then(function (creator) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                                var givenObjInCreWal, takenObjInCreWal, currencyObj, bodyAccOffer, error, error;
                                                                                                return __generator(this, function (_a) {
                                                                                                    switch (_a.label) {
                                                                                                        case 0:
                                                                                                            if (!(creator && creator._id.toString() === sellerId.toString())) return [3 /*break*/, 5];
                                                                                                            givenObjInCreWal = _.find(creator.wallet, function (e) { return e.currency.toString() === individualOffer.curGivenId.toString(); });
                                                                                                            if (!givenObjInCreWal) return [3 /*break*/, 3];
                                                                                                            // take from creator and give to buyer
                                                                                                            givenObjInCreWal.commitment -= Number(individualOffer.curGivenVal);
                                                                                                            takenObjInCreWal = _.find(creator.wallet, function (i) { return i.currency.toString() === individualOffer.curTakenId.toString(); });
                                                                                                            if (takenObjInCreWal) {
                                                                                                                takenObjInCreWal.value += individualOffer.curTakenVal;
                                                                                                            }
                                                                                                            else {
                                                                                                                currencyObj = {
                                                                                                                    currency: individualOffer.curTakenId,
                                                                                                                    value: individualOffer.curTakenVal
                                                                                                                };
                                                                                                                creator.wallet.push(currencyObj);
                                                                                                                takenObjInCreWal = currencyObj;
                                                                                                            }
                                                                                                            takenObjInBuyer.value -= individualOffer.curTakenVal;
                                                                                                            givenObjInBuyer.value += individualOffer.curGivenVal;
                                                                                                            bodyAccOffer = {
                                                                                                                acceptor: admin._id,
                                                                                                                creator: sellerId,
                                                                                                                offerId: individualOffer.offerId,
                                                                                                                curGivenId: individualOffer.curGivenId,
                                                                                                                curGivenVal: individualOffer.curGivenVal,
                                                                                                                curTakenId: individualOffer.curTakenId,
                                                                                                                curTakenVal: individualOffer.curTakenVal,
                                                                                                                offeredDate: individualOffer.created_at,
                                                                                                                expiredDate: individualOffer.expDate,
                                                                                                                buyOrderId: buyOrderId
                                                                                                            };
                                                                                                            return [4 /*yield*/, creator.save()];
                                                                                                        case 1:
                                                                                                            _a.sent();
                                                                                                            return [4 /*yield*/, acceptedOffers_1.Accepted_Offers.create([bodyAccOffer], { session: session })["catch"](function (err) {
                                                                                                                    throw (err);
                                                                                                                })];
                                                                                                        case 2:
                                                                                                            _a.sent();
                                                                                                            return [3 /*break*/, 4];
                                                                                                        case 3:
                                                                                                            error = new myError_1["default"]('creator wallet does not have given object', 400, 5, 'در کیف پول فرشنده ارز مورد نظر پیدا نشد', 'خطا رخ داد');
                                                                                                            throw (error);
                                                                                                        case 4: return [3 /*break*/, 6];
                                                                                                        case 5:
                                                                                                            error = new myError_1["default"]('failed to accept an offer', 400, 5, 'موفق به پذیرش یک آفر نشدیم', 'خطا رخ داد');
                                                                                                            throw (error);
                                                                                                        case 6: return [2 /*return*/];
                                                                                                    }
                                                                                                });
                                                                                            }); })["catch"](function (err) {
                                                                                                throw (err);
                                                                                            });
                                                                                        });
                                                                                        return [2 /*return*/, Promise.all(orderAcceptor)
                                                                                                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                                                return __generator(this, function (_a) {
                                                                                                    switch (_a.label) {
                                                                                                        case 0: return [4 /*yield*/, buyerUser.save()];
                                                                                                        case 1:
                                                                                                            _a.sent();
                                                                                                            return [2 /*return*/];
                                                                                                    }
                                                                                                });
                                                                                            }); })["catch"](function (err) {
                                                                                                throw (err);
                                                                                            })];
                                                                                    });
                                                                                }); })["catch"](function (err) {
                                                                                    throw (err);
                                                                                })];
                                                                        });
                                                                    }); })["catch"](function (err) {
                                                                        throw (err);
                                                                    });
                                                                }
                                                            })["catch"](function (err) {
                                                                throw (err);
                                                            })];
                                                    });
                                                }); })
                                                    .then(function () {
                                                    response_1["default"](res, 'Buying process finished successfully', true, {});
                                                })["catch"](function (err) {
                                                    errorCounter_2--;
                                                    if (errorCounter_2 == 0) {
                                                        next(err);
                                                    }
                                                    else {
                                                        throw (err);
                                                    }
                                                })["finally"](function () {
                                                    session.endSession();
                                                })];
                                        }
                                    });
                                }); }, {
                                    maxTimeout: 5000,
                                    retries: 5
                                });
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, mongoose.startSession()];
                            case 2:
                                session_2 = _a.sent();
                                session_2.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, user_1.User.findOne({ _id: userId }).session(session_2)
                                                .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                                var currencyWalInUser, error;
                                                return __generator(this, function (_a) {
                                                    currencyWalInUser = _.find(user.wallet, function (i) { return i.currency.toString() === priceObj.currency.toString(); });
                                                    if (currencyWalInUser.value >= priceObj.quantity) {
                                                        return [2 /*return*/, admin_1.Admin.findOne({}).session(session_2)
                                                                .then(function (admin) { return __awaiter(void 0, void 0, void 0, function () {
                                                                var rialWalInAdmin, curWalInUser, rialWalInUser, curWalInAdmin, bodyCurrency;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            rialWalInAdmin = _.find(admin.wallet, function (i) { return i.currency.toString() === rialObject.id.toString(); });
                                                                            curWalInUser = _.find(user.wallet, function (i) { return i.currency.toString() === currency.toString(); });
                                                                            rialWalInUser = _.find(user.wallet, function (i) { return i.currency.toString() === rialObject.id.toString(); });
                                                                            curWalInAdmin = _.find(admin.wallet, function (i) { return i.currency.toString() === currency.toString(); });
                                                                            if (!rialWalInUser) return [3 /*break*/, 4];
                                                                            rialWalInUser.value += Number(priceObj.rialPrice);
                                                                            curWalInUser.value -= Number(priceObj.quantity);
                                                                            curWalInAdmin.value += Number(priceObj.quantity);
                                                                            rialWalInAdmin.value -= Number(priceObj.rialPrice);
                                                                            return [4 /*yield*/, admin.save()];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [4 /*yield*/, user.save()];
                                                                        case 2:
                                                                            _a.sent();
                                                                            return [4 /*yield*/, priceObj.remove()];
                                                                        case 3:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 8];
                                                                        case 4:
                                                                            bodyCurrency = {
                                                                                currency: currency,
                                                                                value: priceObj.quantity,
                                                                                commitment: 0
                                                                            };
                                                                            user.wallet.push(bodyCurrency);
                                                                            rialWalInUser.value -= priceObj.rialPrice;
                                                                            rialWalInAdmin.value += priceObj.rialPrice;
                                                                            curWalInAdmin.value -= priceObj.quantity;
                                                                            return [4 /*yield*/, admin.save()];
                                                                        case 5:
                                                                            _a.sent();
                                                                            return [4 /*yield*/, user.save()];
                                                                        case 6:
                                                                            _a.sent();
                                                                            return [4 /*yield*/, priceObj.remove()];
                                                                        case 7:
                                                                            _a.sent();
                                                                            _a.label = 8;
                                                                        case 8: return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })];
                                                    }
                                                    else {
                                                        error = new myError_1["default"]('User does not have enough rial credit in his/her wallet.', 400, 5, 'کاربر ارز ریالی کافی برای خرید را ندارد.', 'خطا رخ داد');
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
                                    response_1["default"](res, 'Buying process finished successfully', true, {});
                                })["catch"](function (err) {
                                    next(err);
                                })["finally"](function () {
                                    session_2.endSession();
                                });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (err) {
                    next(err);
                });
            }
            else {
                var error = new myError_1["default"]('There is no price in GetPrice', 400, 5, 'قیمت معادل ریالی پیدا نشد.', 'خطا رخ داد');
                next(error);
            }
        })["catch"](function (err) {
            next(err);
        });
        return [2 /*return*/];
    });
}); }));
exports.walletRoutes.post('/transferFromExchange', auth_1.isAuthorized, tryCatch_1["default"](function (req, res, next) {
    var value = req.body.value;
    var currencyId = req.body.currencyId;
    var receiver = req.body.receiver;
    var userId = req.session.userId;
    transferFromExchange_1.transferFromExchangeApi(currencyId, value, receiver, userId)
        .then(function (data) {
        response_1["default"](res, "transaction completed please wait", data.txHash);
    })["catch"](function (err) {
        next(err);
    });
}));
exports.walletRoutes.post('/transferToExchange', tryCatch_1["default"](function (req, res, next) {
    var signedRawTxHex = req.body.tx;
    var currencyId = req.body.currencyId;
    var userId = req.session.userId;
    var value = req.body.value;
    user_1.User.findOne({ _id: userId })
        .then(function (user) {
        if (user) {
            var cur = _.find(user.wallet, function (i) { return i.currency.toString() === currencyId.toString(); });
            if (cur) {
                //invoke transferToExchangeApi
            }
            else {
                var error = new myError_1["default"]('currency not found in user wallet', 400, 5, 'ارز مربوطه در کیف پول کاربر پیدا نشد.', 'خطا رخ داد');
                next(error);
            }
        }
        else {
            var error = new myError_1["default"]('user not found', 400, 5, 'کاربر پیدا نشد.', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.walletRoutes.post('/transferToExchangeById', auth_1.isAuthorized, tryCatch_1["default"](function (req, res, next) {
    var txId = req.body.txId;
    var currencyId = req.body.currencyId;
    var userId = req.session.userId;
    transferToExchangeById_1.transferToExchangeByIdApi(currencyId, txId, userId)
        .then(function (txInf) {
        if (txInf.status === "successful") {
            response_1["default"](res, "you have the currency");
        }
        else if (txInf.status === "pending") {
            response_1["default"](res, "please wait");
        }
    })["catch"](function (err) {
        next(err);
    });
}));
