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
exports.localYearlySetPrice = void 0;
var acceptedOffers_1 = require("../db/acceptedOffers");
var moment = require("moment");
require("moment-timezone");
var currencies_1 = require("../db/currencies");
var _ = require("lodash");
var localYearly_1 = require("../db/localYearly");
exports.localYearlySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                console.log('the curs is ....>', curs);
                var rialObj_1 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_1) {
                    var nowYear_1 = moment().tz('Iran').startOf('year');
                    var ago = moment(nowYear_1).subtract(1, 'year');
                    console.log("rial is founded .....> ", rialObj_1);
                    console.log("the now years is...>", nowYear_1);
                    localYearly_1.LocalYearly.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            console.log("last document was founded", lastDoc);
                            var lastSavedYear = moment(lastDoc.name).startOf('year').valueOf();
                            console.log("first last saved  year is....", lastSavedYear);
                            console.log("second last saved  year is....", lastSavedYear);
                            var lostedYears = moment.duration(nowYear_1.diff(lastSavedYear)).asYears();
                            console.log("losted year is....", lostedYears);
                            var i = void 0;
                            var _loop_1 = function () {
                                console.log("in for", i);
                                var curArr = [];
                                var lstSavedYear = lastSavedYear;
                                var startYear = moment(lstSavedYear).add((i - 1), 'year');
                                var nextYear = moment(lstSavedYear).add((i), 'year');
                                console.log("the start year is...>", startYear);
                                console.log("the next year is...>", nextYear);
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startYear,
                                        $lte: nextYear
                                    }
                                }).then(function (offers) {
                                    if (offers[0]) {
                                        console.log('offer was foundeddddd ...>', offers);
                                        var curIds_1 = [];
                                        offers.forEach(function (off) {
                                            console.log('offer was founded ...>', off);
                                            if (off.curGivenId.toString() === rialObj_1._id.toString()) {
                                                console.log('given is rial');
                                                if (!(curIds_1.includes(off.curTakenId.toString()))) {
                                                    curIds_1.push(off.curTakenId.toString());
                                                }
                                                var curObj = _.find(curArr, function (i) { return i.currencyId.toString() === off.curTakenId.toString(); });
                                                if (curObj) {
                                                    curObj.volume += Number(off.curTakenVal);
                                                    curObj.price = Number(off.curGivenId);
                                                    if (Number(off.curGivenId) < Number(curObj.min))
                                                        curObj.min = Number(off.curGivenId);
                                                    if (Number(off.curGivenId) > Number(curObj.max))
                                                        curObj.max = Number(off.curGivenId);
                                                }
                                                else {
                                                    curArr.push({
                                                        currencyId: off.curTakenId,
                                                        price: Number(off.curTakenVal),
                                                        volume: Number(off.curTakenVal),
                                                        min: Number(off.curGivenId),
                                                        max: Number(off.curGivenId)
                                                    });
                                                }
                                            }
                                            else if (off.curTakenId.toString() === rialObj_1._id.toString()) {
                                                console.log('taken is rial');
                                                if (!(curIds_1.includes(off.curGivenId.toString()))) {
                                                    curIds_1.push(off.curGivenId.toString());
                                                }
                                                var curObj = _.find(curArr, function (i) { return i.currencyId.toString() === off.curGivenId.toString(); });
                                                if (curObj) {
                                                    curObj.volume += Number(off.curGivenVal);
                                                    curObj.price = Number(off.curTakenVal);
                                                    if (off.curTakenVal < curObj.min)
                                                        curObj.min = Number(off.curTakenVal);
                                                    if (off.curTakenVal > curObj.max)
                                                        curObj.max = Number(off.curTakenVal);
                                                }
                                                else {
                                                    curArr.push({
                                                        currencyId: off.curGivenId,
                                                        price: Number(off.curGivenVal),
                                                        volume: Number(off.curGivenVal),
                                                        min: Number(off.curTakenVal),
                                                        max: Number(off.curTakenVal)
                                                    });
                                                }
                                            }
                                        });
                                        console.log("curids isssss", curIds_1);
                                        if (curs.length - 1 !== curIds_1.length) {
                                            console.log("yes");
                                            curs.forEach(function (cur) {
                                                if (!(curIds_1.includes(cur._id.toString())) && cur._id.toString() != rialObj_1._id.toString()) {
                                                    console.log(cur._id);
                                                    curArr.push({
                                                        price: 0,
                                                        currencyId: cur._id,
                                                        volume: 0,
                                                        min: 0,
                                                        max: 0
                                                    });
                                                }
                                            });
                                        }
                                        var doc = {
                                            name: nextYear,
                                            currencies: curArr
                                        };
                                        localYearly_1.LocalYearly.create([doc]);
                                    }
                                    else {
                                        console.log("offer not found");
                                        curs.forEach(function (cur) {
                                            if (cur._id != rialObj_1._id) {
                                                curArr.push({
                                                    currencyId: cur._id,
                                                    volume: 0,
                                                    price: 0,
                                                    min: 0,
                                                    max: 0
                                                });
                                            }
                                        });
                                        var doc = {
                                            name: nextYear,
                                            currencies: curArr
                                        };
                                        localYearly_1.LocalYearly.create([doc]);
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedYears; i++) {
                                _loop_1();
                            }
                        }
                        else {
                            var curArr2_1 = [];
                            console.log("last document was  not founded");
                            curs.forEach(function (cur) {
                                if (cur._id != rialObj_1._id) {
                                    curArr2_1.push({
                                        currencyId: cur._id,
                                        volume: 0,
                                        price: 0,
                                        min: 0,
                                        max: 0
                                    });
                                }
                            });
                            var doc = {
                                name: nowYear_1,
                                currencies: curArr2_1
                            };
                            localYearly_1.LocalYearly.create([doc]);
                        }
                    })["catch"](function (err) {
                        console.log(err);
                    });
                }
                else {
                    console.log("rial is not exsist on database");
                }
            }
            else {
                console.log("there is no currency on database");
            }
        })["catch"](function (err) {
            console.log(err);
        });
        return [2 /*return*/];
    });
}); };
