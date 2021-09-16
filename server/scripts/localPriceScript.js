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
exports.localYearlySetPrice = exports.localMonthlySetPrice = exports.localWeeklySetPrice = exports.localDailySetPrice = exports.localHourlySetPrice = void 0;
var localDaily_1 = require("../db/localDaily");
var localHourly_1 = require("../db/localHourly");
var localMonthly_1 = require("../db/localMonthly");
var localWeekly_1 = require("../db/localWeekly");
var localYearly_1 = require("../db/localYearly");
var acceptedOffers_1 = require("../db/acceptedOffers");
var moment = require("moment");
require("moment-timezone");
var currencies_1 = require("../db/currencies");
var _ = require("lodash");
exports.localHourlySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                var rialObj_1 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_1) {
                    var nowHour_1 = moment().tz('Iran').startOf('hours');
                    var ago = moment(nowHour_1).subtract(1, 'hours');
                    localHourly_1.LocalHourly.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            var lastSavedHour = moment(lastDoc.name).startOf('hours').valueOf();
                            var lostedHours = moment.duration(nowHour_1.diff(lastSavedHour)).asHours();
                            var i = void 0;
                            var _loop_1 = function () {
                                console.log("in for", i);
                                var curArr = [];
                                var lstSavedHour = lastSavedHour;
                                var startHour = moment(lstSavedHour).add((i - 1), 'hours');
                                var nextHour = moment(lstSavedHour).add((i), 'hours');
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startHour,
                                        $lte: nextHour
                                    }
                                })
                                    .then(function (offers) {
                                    if (offers[0]) {
                                        var curIds_1 = [];
                                        offers.forEach(function (off) {
                                            if (off.curGivenId.toString() === rialObj_1._id.toString()) {
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
                                        if (curs.length - 1 !== curIds_1.length) {
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
                                            name: nextHour,
                                            currencies: curArr
                                        };
                                        localHourly_1.LocalHourly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                    else {
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
                                            name: nextHour,
                                            currencies: curArr
                                        };
                                        localHourly_1.LocalHourly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedHours; i++) {
                                _loop_1();
                            }
                        }
                        else {
                            var curArr2_1 = [];
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
                                name: nowHour_1,
                                currencies: curArr2_1
                            };
                            localHourly_1.LocalHourly.create([doc])["catch"](function (err) {
                                console.log(err);
                            });
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
exports.localDailySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                var rialObj_2 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_2) {
                    var nowDay_1 = moment().tz('Iran').startOf('days');
                    var ago = moment(nowDay_1).subtract(1, 'days');
                    localDaily_1.LocalDaily.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            var lastSavedDay = moment(lastDoc.name).startOf('days').valueOf();
                            var lostedDays = moment.duration(nowDay_1.diff(lastSavedDay)).asDays();
                            var i = void 0;
                            var _loop_2 = function () {
                                var curArr = [];
                                var lstSavedDay = lastSavedDay;
                                var startDay = moment(lstSavedDay).add((i - 1), 'days');
                                var nextDay = moment(lstSavedDay).add((i), 'days');
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startDay,
                                        $lte: nextDay
                                    }
                                }).then(function (offers) {
                                    if (offers[0]) {
                                        var curIds_2 = [];
                                        offers.forEach(function (off) {
                                            if (off.curGivenId.toString() === rialObj_2._id.toString()) {
                                                if (!(curIds_2.includes(off.curTakenId.toString()))) {
                                                    curIds_2.push(off.curTakenId.toString());
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
                                            else if (off.curTakenId.toString() === rialObj_2._id.toString()) {
                                                if (!(curIds_2.includes(off.curGivenId.toString()))) {
                                                    curIds_2.push(off.curGivenId.toString());
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
                                        if (curs.length - 1 !== curIds_2.length) {
                                            curs.forEach(function (cur) {
                                                if (!(curIds_2.includes(cur._id.toString())) && cur._id.toString() != rialObj_2._id.toString()) {
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
                                            name: nextDay,
                                            currencies: curArr
                                        };
                                        localDaily_1.LocalDaily.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                    else {
                                        curs.forEach(function (cur) {
                                            if (cur._id != rialObj_2._id) {
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
                                            name: nextDay,
                                            currencies: curArr
                                        };
                                        localDaily_1.LocalDaily.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedDays; i++) {
                                _loop_2();
                            }
                        }
                        else {
                            var curArr2_2 = [];
                            curs.forEach(function (cur) {
                                if (cur._id != rialObj_2._id) {
                                    curArr2_2.push({
                                        currencyId: cur._id,
                                        volume: 0,
                                        price: 0,
                                        min: 0,
                                        max: 0
                                    });
                                }
                            });
                            var doc = {
                                name: nowDay_1,
                                currencies: curArr2_2
                            };
                            localDaily_1.LocalDaily.create([doc])["catch"](function (err) {
                                console.log(err);
                            });
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
exports.localWeeklySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                var rialObj_3 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_3) {
                    var nowWeek_1 = moment().tz('Iran').startOf('weeks');
                    var ago = moment(nowWeek_1).subtract(1, 'weeks');
                    localWeekly_1.LocalWeekly.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            var lastSavedWeek = moment(lastDoc.name).startOf('weeks').valueOf();
                            var lostedWeeks = moment.duration(nowWeek_1.diff(lastSavedWeek)).asWeeks();
                            var i = void 0;
                            var _loop_3 = function () {
                                var curArr = [];
                                var lstSavedWeek = lastSavedWeek;
                                var startWeek = moment(lstSavedWeek).add((i - 1), 'weeks');
                                var nextWeek = moment(lstSavedWeek).add((i), 'weeks');
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startWeek,
                                        $lte: nextWeek
                                    }
                                })
                                    .then(function (offers) {
                                    if (offers[0]) {
                                        var curIds_3 = [];
                                        offers.forEach(function (off) {
                                            if (off.curGivenId.toString() === rialObj_3._id.toString()) {
                                                if (!(curIds_3.includes(off.curTakenId.toString()))) {
                                                    curIds_3.push(off.curTakenId.toString());
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
                                            else if (off.curTakenId.toString() === rialObj_3._id.toString()) {
                                                if (!(curIds_3.includes(off.curGivenId.toString()))) {
                                                    curIds_3.push(off.curGivenId.toString());
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
                                        if (curs.length - 1 !== curIds_3.length) {
                                            curs.forEach(function (cur) {
                                                if (!(curIds_3.includes(cur._id.toString())) && cur._id.toString() != rialObj_3._id.toString()) {
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
                                            name: nextWeek,
                                            currencies: curArr
                                        };
                                        localWeekly_1.LocalWeekly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                    else {
                                        curs.forEach(function (cur) {
                                            if (cur._id != rialObj_3._id) {
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
                                            name: nextWeek,
                                            currencies: curArr
                                        };
                                        localWeekly_1.LocalWeekly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedWeeks; i++) {
                                _loop_3();
                            }
                        }
                        else {
                            var curArr2_3 = [];
                            curs.forEach(function (cur) {
                                if (cur._id != rialObj_3._id) {
                                    curArr2_3.push({
                                        currencyId: cur._id,
                                        volume: 0,
                                        price: 0,
                                        min: 0,
                                        max: 0
                                    });
                                }
                            });
                            var doc = {
                                name: nowWeek_1,
                                currencies: curArr2_3
                            };
                            localWeekly_1.LocalWeekly.create([doc])["catch"](function (err) {
                                console.log(err);
                            });
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
exports.localMonthlySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                var rialObj_4 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_4) {
                    var nowMonth_1 = moment().tz('Iran').startOf('month');
                    var ago = moment(nowMonth_1).subtract(1, 'month');
                    localMonthly_1.LocalMonthly.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            var lastSavedMonth = moment(lastDoc.name).startOf('month').valueOf();
                            var lostedMonths = moment.duration(nowMonth_1.diff(lastSavedMonth)).asMonths();
                            var i = void 0;
                            var _loop_4 = function () {
                                var curArr = [];
                                var lstSavedMonth = lastSavedMonth;
                                var startMonth = moment(lstSavedMonth).add((i - 1), 'month');
                                var nextMonth = moment(lstSavedMonth).add((i), 'month');
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startMonth,
                                        $lte: nextMonth
                                    }
                                })
                                    .then(function (offers) {
                                    if (offers[0]) {
                                        var curIds_4 = [];
                                        offers.forEach(function (off) {
                                            if (off.curGivenId.toString() === rialObj_4._id.toString()) {
                                                if (!(curIds_4.includes(off.curTakenId.toString()))) {
                                                    curIds_4.push(off.curTakenId.toString());
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
                                            else if (off.curTakenId.toString() === rialObj_4._id.toString()) {
                                                if (!(curIds_4.includes(off.curGivenId.toString()))) {
                                                    curIds_4.push(off.curGivenId.toString());
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
                                        if (curs.length - 1 !== curIds_4.length) {
                                            curs.forEach(function (cur) {
                                                if (!(curIds_4.includes(cur._id.toString())) && cur._id.toString() != rialObj_4._id.toString()) {
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
                                            name: nextMonth,
                                            currencies: curArr
                                        };
                                        localMonthly_1.LocalMonthly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                    else {
                                        curs.forEach(function (cur) {
                                            if (cur._id != rialObj_4._id) {
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
                                            name: nextMonth,
                                            currencies: curArr
                                        };
                                        localMonthly_1.LocalMonthly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedMonths; i++) {
                                _loop_4();
                            }
                        }
                        else {
                            var curArr2_4 = [];
                            curs.forEach(function (cur) {
                                if (cur._id != rialObj_4._id) {
                                    curArr2_4.push({
                                        currencyId: cur._id,
                                        volume: 0,
                                        price: 0,
                                        min: 0,
                                        max: 0
                                    });
                                }
                            });
                            var doc = {
                                name: nowMonth_1,
                                currencies: curArr2_4
                            };
                            localMonthly_1.LocalMonthly.create([doc])["catch"](function (err) {
                                console.log(err);
                            });
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
exports.localYearlySetPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        currencies_1.Currencies.find()
            .then(function (curs) {
            if (curs) {
                var rialObj_5 = _.find(curs, function (i) { return i.ab_name === "IRR"; });
                if (rialObj_5) {
                    var nowYear_1 = moment().tz('Iran').startOf('year');
                    var ago = moment(nowYear_1).subtract(1, 'year');
                    localYearly_1.LocalYearly.findOne().sort({ name: -1 }).limit(1)
                        .then(function (lastDoc) {
                        if (lastDoc) {
                            var lastSavedYear = moment(lastDoc.name).startOf('year').valueOf();
                            var lostedYears = moment.duration(nowYear_1.diff(lastSavedYear)).asYears();
                            var i = void 0;
                            var _loop_5 = function () {
                                var curArr = [];
                                var lstSavedYear = lastSavedYear;
                                var startYear = moment(lstSavedYear).add((i - 1), 'year');
                                var nextYear = moment(lstSavedYear).add((i), 'year');
                                acceptedOffers_1.Accepted_Offers.find({
                                    created_at: {
                                        $gt: startYear,
                                        $lte: nextYear
                                    }
                                })
                                    .then(function (offers) {
                                    if (offers[0]) {
                                        var curIds_5 = [];
                                        offers.forEach(function (off) {
                                            if (off.curGivenId.toString() === rialObj_5._id.toString()) {
                                                if (!(curIds_5.includes(off.curTakenId.toString()))) {
                                                    curIds_5.push(off.curTakenId.toString());
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
                                            else if (off.curTakenId.toString() === rialObj_5._id.toString()) {
                                                if (!(curIds_5.includes(off.curGivenId.toString()))) {
                                                    curIds_5.push(off.curGivenId.toString());
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
                                        if (curs.length - 1 !== curIds_5.length) {
                                            curs.forEach(function (cur) {
                                                if (!(curIds_5.includes(cur._id.toString())) && cur._id.toString() != rialObj_5._id.toString()) {
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
                                        localYearly_1.LocalYearly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                    else {
                                        curs.forEach(function (cur) {
                                            if (cur._id != rialObj_5._id) {
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
                                        localYearly_1.LocalYearly.create([doc])["catch"](function (err) {
                                            console.log(err);
                                        });
                                    }
                                })["catch"](function (err) {
                                    console.log("the error is", err);
                                });
                            };
                            for (i = 1; i <= lostedYears; i++) {
                                _loop_5();
                            }
                        }
                        else {
                            var curArr2_5 = [];
                            curs.forEach(function (cur) {
                                if (cur._id != rialObj_5._id) {
                                    curArr2_5.push({
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
                                currencies: curArr2_5
                            };
                            localYearly_1.LocalYearly.create([doc])["catch"](function (err) {
                                console.log(err);
                            });
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
