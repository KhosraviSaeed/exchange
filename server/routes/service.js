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
exports.serviceRoutes = void 0;
var express = require("express");
var fetch = require("node-fetch");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var mongodb_1 = require("mongodb");
var query_1 = require("../api/query");
var myError_1 = require("../api/myError");
var redis = require("../api/redis");
var acceptedOffers_1 = require("../db/acceptedOffers");
var localHourly_1 = require("../db/localHourly");
var validation_1 = require("../middlewares/validation");
var tryCtach_1 = require("../middlewares/tryCtach");
var response_1 = require("../middlewares/response");
var ActiveOffers_1 = require("../db/ActiveOffers");
var currencies_1 = require("../db/currencies");
exports.serviceRoutes = express.Router();
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
exports.serviceRoutes.get('/getDeafultAcceptedOffers', tryCtach_1["default"](function (req, res, next) {
    var curId = req.query.curIdOp;
    var rialObj;
    currencies_1.Currencies.findOne({ ab_name: 'IRR' })
        .then(function (rial) {
        if (rial && rial.ab_name === 'IRR') {
            rialObj = {
                _id: rial._id,
                currencyName: rial.currencyName,
                per_name: rial.per_name,
                ab_name: rial.ab_name,
                icon: rial.icon
            };
        }
        else {
            throw 'kl';
        }
        var offersArray = [];
        var query = {};
        if (mongodb_1.ObjectID.isValid(curId)) {
            query = { $or: [
                    { $and: [{ curGivenId: curId }, { curTakenId: rial._id }] },
                    { $and: [{ curTakenId: curId }, { curGivenId: rial._id }] }
                ] };
        }
        else {
            query = { $or: [{ curTakenId: rial._id }, { curGivenId: rial._id }] };
        }
        acceptedOffers_1.Accepted_Offers.find(query)
            .then(function (offers) {
            var offersMap = offers.map(function (offer) {
                if (offer.curTakenId.toString() === rial._id.toString()) {
                    return redis.hashGetAll(offer.curGivenId.toString())
                        .then(function (curGivenObj) {
                        offersArray.push({
                            GcurrencyName: curGivenObj.currencyName,
                            GpersianName: curGivenObj.per_name,
                            GshortName: curGivenObj.ab_name,
                            Gvalue: offer.curGivenVal,
                            Gicon: curGivenObj.icon,
                            acceptedDate: offer.created_at,
                            TcurrencyName: rialObj.currencyName,
                            TpersianName: rialObj.per_name,
                            TshortName: rialObj.ab_name,
                            Tvalue: offer.curTakenVal,
                            Ticon: rialObj.icon,
                            txType: 'sell'
                        });
                        return offersArray;
                    })["catch"](function (err) {
                        console.log(err);
                    });
                }
                else if (offer.curGivenId.toString() === rial._id.toString()) {
                    return redis.hashGetAll(offer.curTakenId.toString())
                        .then(function (curTakenObj) {
                        offersArray.push({
                            GcurrencyName: curTakenObj.currencyName,
                            GpersianName: curTakenObj.per_name,
                            GshortName: curTakenObj.ab_name,
                            Gvalue: offer.curTakenVal,
                            Gicon: curTakenObj.icon,
                            acceptedDate: offer.created_at,
                            TcurrencyName: rialObj.currencyName,
                            TpersianName: rialObj.per_name,
                            TshortName: rialObj.ab_name,
                            Tvalue: offer.curGivenVal,
                            Ticon: rialObj.icon,
                            txType: 'buy'
                        });
                        return offersArray;
                    })["catch"](function (err) {
                        console.log(err);
                    });
                }
            });
            Promise.all(offersMap)
                .then(function () {
                response_1["default"](res, '', offersArray);
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
exports.serviceRoutes.get('/getAcceptedOffers', 
// userValidationRules('query', 'status'),
// userValidationRules('query', 'rialId'),
// userValidationRules('query', 'currencyId'),
// validate,
tryCtach_1["default"](function (req, res, next) {
    var status = req.query.status;
    var currency = req.query.currencyId;
    var rialId = req.query.rialId;
    var query = [];
    if (status === "sell") {
        if (rialId) {
            query.push({ curGivenId: currency }, { curTakenId: rialId });
        }
        else {
            query.push({ curGivenId: currency });
        }
    }
    else if (status === "buy") {
        if (rialId) {
            query.push({ curTakenId: currency }, { curGivenId: rialId });
        }
        else {
            query.push({ curTakenId: currency });
        }
    }
    acceptedOffers_1.Accepted_Offers.find({ $and: query })
        .then(function (offers) {
        if (offers[0]) {
            var dataArray_1 = [];
            redis.hashGetAll(currency.toString())
                .then(function (cur) {
                if (cur) {
                    var rialName_1;
                    var rialpesianName_1;
                    var rialShortName_1;
                    if (rialId) {
                        redis.hashGetAll(rialId.toString())
                            .then(function (rial) {
                            if (rial) {
                                rialName_1 = rial.currencyName;
                                rialpesianName_1 = rial.per_name;
                                rialShortName_1 = rial.ab_name;
                            }
                            else {
                                var error = new myError_1["default"]('rial not found!', 400, 5, 'ریال پیدا نشد!', 'خطا رخ داد');
                                throw (error);
                            }
                        })["catch"](function (err) {
                            throw (err);
                        });
                    }
                    var offmap = offers.map(function (off) {
                        if (status === "sell") {
                            if (rialId) {
                                dataArray_1.push({
                                    GcurrencyName: cur.currencyName,
                                    GpersianName: cur.per_name,
                                    GshortName: cur.ab_name,
                                    Gvalue: off.curTakenVal,
                                    acceptedDate: off.created_at,
                                    TcurrencyName: rialName_1,
                                    TpersianName: rialpesianName_1,
                                    TshortName: rialShortName_1,
                                    Tvalue: off.curTakenVal
                                });
                            }
                            else {
                                return redis.hashGetAll(off.curTakenId.toString())
                                    .then(function (curT) {
                                    if (curT) {
                                        dataArray_1.push({
                                            GcurrencyName: cur.currencyName,
                                            GpersianName: cur.per_name,
                                            GshortName: cur.ab_name,
                                            Gvalue: off.curGivenVal,
                                            acceptedDate: off.created_at,
                                            TcurrencyName: curT.currencyName,
                                            TpersianName: curT.per_name,
                                            TshortName: curT.ab_name,
                                            Tvalue: off.curTakenVal
                                        });
                                    }
                                    else {
                                        return;
                                    }
                                })["catch"](function (err) {
                                    next(err);
                                });
                            }
                        }
                        else if (status === "buy") {
                            if (rialId) {
                                dataArray_1.push({
                                    TcurrencyName: cur.currencyName,
                                    TpersianName: cur.per_name,
                                    TshortName: cur.ab_name,
                                    Tvalue: off.curTakenVal,
                                    acceptedDate: off.created_at,
                                    GcurrencyName: rialName_1,
                                    GpersianName: rialpesianName_1,
                                    GshortName: rialShortName_1,
                                    Gvalue: off.curGivenVal
                                });
                            }
                            else {
                                return redis.hashGetAll(off.curGivenId.toString())
                                    .then(function (curG) {
                                    if (curG) {
                                        dataArray_1.push({
                                            TcurrencyName: cur.currencyName,
                                            TpersianName: cur.per_name,
                                            TshortName: cur.ab_name,
                                            Tvalue: off.curTakenVal,
                                            acceptedDate: off.created_at,
                                            GcurrencyName: curG.currencyName,
                                            GpersianName: curG.per_name,
                                            GshortName: curG.ab_name,
                                            Gvalue: off.curGivenVal
                                        });
                                    }
                                    else {
                                        return;
                                    }
                                })["catch"](function (err) {
                                    next(err);
                                });
                            }
                        }
                    });
                    Promise.all(offmap)
                        .then(function () {
                        response_1["default"](res, "offer founded", dataArray_1);
                    })["catch"](function (err) {
                        next(err);
                    });
                }
                else {
                    var error = new myError_1["default"]('currency not found!', 400, 5, 'ارز مربوطه پیدا نشد!', 'خطا رخ داد');
                    next(error);
                }
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('offer not found!', 400, 5, 'سفارش پیدا نشد!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.serviceRoutes.get('/getOnlinePrices', tryCtach_1["default"](function (req, res, next) {
    var curArr = [];
    var fetchBTC = function () {
        return fetch("https://api.nomics.com/v1/exchange-rates/history?key=" + process.env.CURRENCY_API_KEY + "&currency=BTC&start=2020-09-25T00%3A00%3A00Z", {
            method: 'GET'
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
            curArr.push({ currency: 'BTC', prices: response });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    var fetchETH = function () {
        return fetch("https://api.nomics.com/v1/exchange-rates/history?key=" + process.env.CURRENCY_API_KEY + "&currency=ETH&start=2020-09-25T00%3A00%3A00Z", {
            method: 'GET'
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
            curArr.push({ currency: 'ETH', prices: response });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    var fetchTRX = function () {
        return fetch("https://api.nomics.com/v1/exchange-rates/history?key=" + process.env.CURRENCY_API_KEY + "&currency=TRX&start=2020-09-25T00%3A00%3A00Z", {
            method: 'GET'
        })
            .then(function (res) { return res.json(); })
            .then(function (response) {
            curArr.push({ currency: 'TRX', prices: response });
        })["catch"](function (err) {
            console.log(err);
        });
    };
    return Promise.all([fetchBTC(), fetchETH(), fetchTRX()])
        .then(function () {
        response_1["default"](res, '', curArr);
    })["catch"](function (err) {
        next(err);
    });
}));
exports.serviceRoutes.get('/getCurrencies', tryCtach_1["default"](function (req, res, next) {
    var type = req.query.type;
    currencies_1.Currencies.find()
        .then(function (curs) {
        if (curs) {
            var curArray_1 = [];
            var priceRial_1;
            redis.hashget("dollarPrice")
                .then(function (rial) {
                if (rial) {
                    priceRial_1 = Number(rial / 10);
                }
                var cursMap = curs.map(function (cur) {
                    if (cur.ab_name !== 'IRR') {
                        var curInfo_1 = {
                            currencyName: cur.name,
                            persianName: cur.per_name,
                            shortName: cur.ab_name,
                            icon: cur.icon,
                            _id: cur._id
                        };
                        if (type === '1') {
                            return redis.hashGetAll(cur.ab_name + '-g')
                                .then(function (price) {
                                if (price && price.current && !Number.isNaN(Number(price.current))) {
                                    if (priceRial_1) {
                                        curInfo_1['price'] = Math.ceil(Number(price.current) * priceRial_1);
                                        curInfo_1['min'] = Math.ceil(Number(price.min) * priceRial_1);
                                        curInfo_1['max'] = Math.ceil(Number(price.max) * priceRial_1);
                                    }
                                }
                                curArray_1.push(curInfo_1);
                            })["catch"](function (err) {
                                throw (err);
                            });
                        }
                        else {
                            curArray_1.push(curInfo_1);
                        }
                    }
                    else {
                        curArray_1.unshift({
                            currencyName: cur.name,
                            persianName: cur.per_name,
                            shortName: cur.ab_name,
                            icon: cur.icon,
                            _id: cur._id
                        });
                    }
                });
                Promise.all(cursMap)
                    .then(function () {
                    response_1["default"](res, 'currencies informations', curArray_1);
                })["catch"](function (err) {
                    next(err);
                });
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
            var error = new myError_1["default"]('currencies not found ', 400, 5, 'ارزیی پیدا نشد!', 'خطا رخ داد');
            next(error);
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.serviceRoutes.get('/getImages/:imageType/:imageName', tryCtach_1["default"](function (req, res, next) {
    var imageType = req.params.imageType;
    var imageName = req.params.imageName;
    var validPaths = ['coins'];
    var imageFile;
    if (req.query.type && validPaths.includes(req.query.type)) {
        imageFile = fs.readFileSync("./images/" + imageName);
    }
    else {
        imageFile = fs.readFileSync("./images/" + imageType + "/" + imageName);
    }
    var ext = path.extname(imageName);
    res.contentType("image/" + ext);
    res.send(imageFile);
}));
exports.serviceRoutes.get('/getActiveOffers', 
// isAuthorized,
tryCtach_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, curId, status, query, rialObj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.session.userId;
                curId = req.query.curIdOp;
                status = req.query.status;
                query = [];
                query.push({ expDate: { $gt: Date.now() } });
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
                                            owner: userId && userId === offer.userId.toString() ? true : false,
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
                                            owner: userId && userId === offer.userId.toString() ? true : false,
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
                                            giveCurname: givenCur.name,
                                            giveCurValue: off.curGivenVal,
                                            //givenCurPersianName : givenCur.per_name,
                                            //givenCurShortName : givenCur.ab_name,
                                            //givenCurIcon : givenCur.icon,
                                            takenCurname: takenCur.name,
                                            takenCurValue: off.curTakenVal,
                                            //takenCurpersianName: takenCur.per_name,
                                            //takenCurShortName : takenCur.ab_name,
                                            //takenCurIcon : takenCur.icon,
                                            createDate: off.created_at,
                                            expireDate: off.expDate
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
                        var error = new myError_1["default"]('there is not any active offer in network', 400, 5, 'there is not any active offer in network!', 'خطا رخ داد');
                        next(error);
                    }
                })["catch"](function (err) {
                    next(err);
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.serviceRoutes.post('/filterOnTxs', tryCtach_1["default"](function (req, res, next) {
    console.log('req.body: ', req.body);
    var curId = req.body.curIdOp;
    var txType = req.body.txType;
    currencies_1.Currencies.findOne({ ab_name: 'IRR' })
        .then(function (doc) {
        if (doc && doc.ab_name === 'IRR') {
            query_1.searchOnTxs({ curId: curId, txType: txType, rial: doc })
                .then(function (result) {
                response_1["default"](res, '', result);
            })["catch"](function (err) {
                next(err);
            });
        }
        else {
        }
    })["catch"](function (err) {
        next(err);
    });
}));
exports.serviceRoutes.post('/filterOnOffers', validation_1.userValidationRules('body', 'offerIdOp'), validation_1.userValidationRules('body', 'curGivenIdOp'), validation_1.userValidationRules('body', 'curGivenValOp'), validation_1.userValidationRules('body', 'curTakenIdOp'), validation_1.userValidationRules('body', 'curTakenValOp'), validation_1.userValidationRules('body', 'expDateOp'), validation_1.userValidationRules('body', 'created_atOp'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var offerId = req.body.offerIdOp;
    var curGivenId = req.body.curGivenIdOp;
    var curGivenVal = req.body.curGivenValOp;
    var curTakenId = req.body.curTakenIdOp;
    var curTakenVal = req.body.curTakenValOp;
    var expDate = req.body.expDateOp;
    var created_at = req.body.created_atOp;
    query_1.searchOnActiveOffers({ offerId: offerId, curGivenId: curGivenId, curGivenVal: curGivenVal, curTakenId: curTakenId, curTakenVal: curTakenVal, expDate: expDate, created_at: created_at })
        .then(function (result) {
        response_1["default"](res, '', result);
    })["catch"](function (err) {
        next(err);
    });
}));
exports.serviceRoutes.get('/getLocalHorlyPrice', validation_1.userValidationRules('query', 'currencyId'), validation_1.userValidationRules('query', 'interval'), validation_1.userValidationRules('query', 'pageNumber'), validation_1.validate, tryCtach_1["default"](function (req, res, next) {
    var currencyId = req.query.currencyId;
    var interval = req.query.interval;
    var pageNumber = req.query.pageNumber;
    var collection;
    if (interval === "h") {
        collection = localHourly_1.LocalHourly;
    }
    else if (interval === "d") {
        //collection = 
    }
    else if (interval === "w") {
        //collection = 
    }
    else if (interval === "y") {
        //collection = 
    }
    else if (interval === "m") {
        //collection = 
    }
    collection.aggregate()
        .project({
        currencies: {
            $filter: {
                input: "$currencies",
                as: "currency",
                cond: {
                    $eq: ["$$currency.currencyId", new mongodb_1.ObjectID(currencyId)]
                }
            }
        }
    }).sort({ name: -1 }).skip(Number(pageNumber) * Number(process.env.CHART_LIMIT)).limit(20)
        .then(function (r) {
        response_1["default"](res, "....", r);
    })["catch"](function (err) {
        next(err);
    });
}));
