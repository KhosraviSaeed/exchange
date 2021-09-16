"use strict";
exports.__esModule = true;
exports.searchOnActiveOffers = exports.searchOnTxs = void 0;
var redis = require("../api/redis");
var acceptedOffers_1 = require("../db/acceptedOffers");
var ActiveOffers_1 = require("../db/ActiveOffers");
exports.searchOnTxs = function (_a) {
    var curId = _a.curId, txType = _a.txType, rial = _a.rial;
    var itemsMap = new Map();
    var items = ['curId'];
    var definedItems = [];
    itemsMap.set('curId', curId);
    items.map(function (element) {
        if (itemsMap.get(element)) {
            definedItems.push(element);
        }
    });
    var query = [];
    var queryMap = new Map();
    queryMap.set('curId', [{ $or: [
                { $and: [{ curGivenId: curId }, { curTakenId: rial._id }] },
                { $and: [{ curTakenId: curId }, { curGivenId: rial._id }] }
            ] }]);
    var definedItemsMap = definedItems.map(function (element) {
        query.push.apply(query, queryMap.get(element));
    });
    if (query.length === 0) {
        query = [{ $or: [{ curTakenId: rial._id }, { curGivenId: rial._id }] }];
    }
    console.log('query: ', query);
    return Promise.all(definedItemsMap)
        .then(function () {
        return acceptedOffers_1.Accepted_Offers.find({ $and: query })
            .then(function (result) {
            var modifiedResult = [];
            if (itemsMap.get('curId')) {
                return redis.hashGetAll(curId.toString())
                    .then(function (curObj) {
                    result.map(function (e) {
                        if (e.curTakenId.toString() === rial._id.toString() && txType === 'sell') {
                            modifiedResult.push({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: e.curGivenVal,
                                Gicon: curObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curTakenVal,
                                Ticon: rial.icon,
                                txType: 'sell'
                            });
                        }
                        else if (e.curGivenId.toString() === rial._id.toString() && txType === 'buy') {
                            modifiedResult.push({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: e.curTakenVal,
                                Gicon: curObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curGivenVal,
                                Ticon: rial.icon,
                                txType: 'buy'
                            });
                        }
                        else if (txType === 'all') {
                            if (e.curTakenId.toString() === rial._id.toString()) {
                                modifiedResult.push({
                                    GcurrencyName: curObj.currencyName,
                                    GpersianName: curObj.per_name,
                                    GshortName: curObj.ab_name,
                                    Gvalue: e.curGivenVal,
                                    Gicon: curObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curTakenVal,
                                    Ticon: rial.icon,
                                    txType: 'sell'
                                });
                            }
                            else if (e.curGivenId.toString() === rial._id.toString()) {
                                modifiedResult.push({
                                    GcurrencyName: curObj.currencyName,
                                    GpersianName: curObj.per_name,
                                    GshortName: curObj.ab_name,
                                    Gvalue: e.curTakenVal,
                                    Gicon: curObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curGivenVal,
                                    Ticon: rial.icon,
                                    txType: 'buy'
                                });
                            }
                        }
                    });
                    return modifiedResult;
                })["catch"](function (err) {
                    throw err;
                });
            }
            else {
                var resultMap = result.map(function (e) {
                    console.log('eeeeeeeee: ', e);
                    if (e.curTakenId.toString() === rial._id.toString() && txType === 'sell') {
                        return redis.hashGetAll(e.curGivenId.toString())
                            .then(function (curGivenObj) {
                            modifiedResult.push({
                                GcurrencyName: curGivenObj.currencyName,
                                GpersianName: curGivenObj.per_name,
                                GshortName: curGivenObj.ab_name,
                                Gvalue: e.curGivenVal,
                                Gicon: curGivenObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curTakenVal,
                                Ticon: rial.icon,
                                txType: 'sell'
                            });
                        })["catch"](function (err) {
                            console.log(err);
                        });
                    }
                    else if (e.curGivenId.toString() === rial._id.toString() && txType === 'buy') {
                        return redis.hashGetAll(e.curTakenId.toString())
                            .then(function (curTakenObj) {
                            modifiedResult.push({
                                GcurrencyName: curTakenObj.currencyName,
                                GpersianName: curTakenObj.per_name,
                                GshortName: curTakenObj.ab_name,
                                Gvalue: e.curTakenVal,
                                Gicon: curTakenObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curGivenVal,
                                Ticon: rial.icon,
                                txType: 'buy'
                            });
                        })["catch"](function (err) {
                            console.log(err);
                        });
                    }
                    else if (txType === 'all') {
                        if (e.curTakenId.toString() === rial._id.toString()) {
                            return redis.hashGetAll(e.curGivenId.toString())
                                .then(function (curGivenObj) {
                                modifiedResult.push({
                                    GcurrencyName: curGivenObj.currencyName,
                                    GpersianName: curGivenObj.per_name,
                                    GshortName: curGivenObj.ab_name,
                                    Gvalue: e.curGivenVal,
                                    Gicon: curGivenObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curTakenVal,
                                    Ticon: rial.icon,
                                    txType: 'sell'
                                });
                            })["catch"](function (err) {
                                console.log(err);
                            });
                        }
                        else if (e.curGivenId.toString() === rial._id.toString()) {
                            return redis.hashGetAll(e.curTakenId.toString())
                                .then(function (curTakenObj) {
                                modifiedResult.push({
                                    GcurrencyName: curTakenObj.currencyName,
                                    GpersianName: curTakenObj.per_name,
                                    GshortName: curTakenObj.ab_name,
                                    Gvalue: e.curTakenVal,
                                    Gicon: curTakenObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curGivenVal,
                                    Ticon: rial.icon,
                                    txType: 'buy'
                                });
                            })["catch"](function (err) {
                                console.log(err);
                            });
                        }
                    }
                });
                return Promise.all(resultMap)
                    .then(function () {
                    return modifiedResult;
                })["catch"](function (err) {
                    throw err;
                });
            }
        })["catch"](function (err) {
            throw err;
        });
    })["catch"](function (err) {
        throw err;
    });
};
exports.searchOnActiveOffers = function (_a) {
    var offerId = _a.offerId, curGivenId = _a.curGivenId, curGivenVal = _a.curGivenVal, curTakenId = _a.curTakenId, curTakenVal = _a.curTakenVal, expDate = _a.expDate, created_at = _a.created_at;
    var itemsMap = new Map();
    var items = ['offerId', 'curGivenId', 'curGivenVal', 'curTakenId', 'curTakenVal', 'expDate', 'created_at'];
    var definedItems = [];
    itemsMap.set('offerId', offerId);
    itemsMap.set('curGivenId', curGivenId);
    itemsMap.set('curGivenVal', curGivenVal);
    itemsMap.set('curTakenId', curTakenId);
    itemsMap.set('curTakenVal', curTakenVal);
    itemsMap.set('expDate', expDate);
    itemsMap.set('created_at', created_at);
    items.map(function (element) {
        if (itemsMap.get(element)) {
            if (element === 'expDate') {
                if (expDate.from || expDate.to) {
                    definedItems.push(element);
                }
            }
            else if (element === 'created_at') {
                if (created_at.from || created_at.to) {
                    definedItems.push(element);
                }
            }
            else if (element === 'curGivenVal') {
                if (curGivenVal.from || curGivenVal.to) {
                    definedItems.push(element);
                }
            }
            else if (element === 'curTakenVal') {
                if (curTakenVal.from || curTakenVal.to) {
                    definedItems.push(element);
                }
            }
            else {
                definedItems.push(element);
            }
        }
    });
    var query = [{ expDate: { $gt: Date.now() } }];
    var queryMap = new Map();
    var queryExpDate;
    var queryCreatedAt;
    var queryCurGivenVal;
    var queryCurTakenVal;
    if (definedItems.includes('expDate')) {
        if (expDate.from && expDate.to) {
            queryExpDate = { expDate: { $gt: expDate.from, $lt: expDate.to } };
        }
        else if (expDate.from && !expDate.to) {
            queryExpDate = { expDate: { $gt: expDate.from } };
        }
        else if (!expDate.from && expDate.to) {
            queryExpDate = { expDate: { $lt: expDate.to } };
        }
    }
    if (definedItems.includes('created_at')) {
        if (created_at.from && created_at.to) {
            queryCreatedAt = { created_at: { $gt: created_at.from, $lt: created_at.to } };
        }
        else if (created_at.from && !created_at.to) {
            queryCreatedAt = { created_at: { $gt: created_at.from } };
        }
        else if (!created_at.from && created_at.to) {
            queryCreatedAt = { created_at: { $lt: created_at.to } };
        }
    }
    if (definedItems.includes('curGivenVal')) {
        if (curGivenVal.from && curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $gte: curGivenVal.from, $lte: curGivenVal.to } };
        }
        else if (curGivenVal.from && !curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $gte: curGivenVal.from } };
        }
        else if (!curGivenVal.from && curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $lte: curGivenVal.to } };
        }
    }
    if (definedItems.includes('curTakenVal')) {
        if (curTakenVal.from && curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $gte: curTakenVal.from, $lte: curTakenVal.to } };
        }
        else if (curTakenVal.from && !curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $gte: curTakenVal.from } };
        }
        else if (!curTakenVal.from && curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $lte: curTakenVal.to } };
        }
    }
    queryMap.set('offerId', { offerId: offerId });
    queryMap.set('curGivenId', { curGivenId: curGivenId });
    queryMap.set('curGivenVal', queryCurGivenVal);
    queryMap.set('curTakenId', { curTakenId: curTakenId });
    queryMap.set('curTakenVal', queryCurTakenVal);
    queryMap.set('expDate', queryExpDate);
    queryMap.set('created_at', queryCreatedAt);
    var definedItemsMap = definedItems.map(function (element) {
        query.push(queryMap.get(element));
    });
    return Promise.all(definedItemsMap)
        .then(function () {
        return ActiveOffers_1.Active_Offers.find({ $and: query })
            .then(function (result) {
            return result;
        })["catch"](function (err) {
            throw err;
        });
    })["catch"](function (err) {
        throw err;
    });
};
