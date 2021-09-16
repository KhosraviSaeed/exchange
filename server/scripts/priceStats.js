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
exports.continuesStatsOfOrders = void 0;
var moment = require("moment-timezone");
var globalHourlyPrice_1 = require("../db/globalHourlyPrice");
var globalWeeklyPrice_1 = require("../db/globalWeeklyPrice");
var globalDailyPrice_1 = require("../db/globalDailyPrice");
var globalYearlyPrice_1 = require("../db/globalYearlyPrice");
var globalMontlyPrice_1 = require("../db/globalMontlyPrice");
var currencies_1 = require("../db/currencies");
var redis = require("../api/redis");
var mongoose = require("mongoose");
var fetch = require('node-fetch');
exports.continuesStatsOfOrders = function () {
    var currencyHashMap = new Map();
    var currencyFetcher = function () {
        return currencies_1.Currencies.find().then(function (currency) {
            //   console.log("in currency",currency)
            if (currency && currency.length > 0) {
                return currency.map(function (curr) {
                    //       console.log("pushed " , curr.ab_name)
                    return currencyHashMap.set(curr.ab_name, curr._id);
                });
            }
        })["catch"](function (err) {
            // console.log("in currency catch" ,err)
        });
    };
    Promise.all([currencyFetcher()]).then(function () {
        //console.log("map is ", currencyHashMap)
        var currenciesString = "";
        //Map.prototype.keys(currencyHashMap)
        var currencyIterator = function () {
            Array.from(currencyHashMap.keys()).map(function (element, index) {
                //    console.log("element is ", index)
                currenciesString += element;
                if (index + 1 != currencyHashMap.size) {
                    currenciesString += ",";
                }
                //  console.log("iterating currencString", currenciesString)
            });
        };
        Promise.all([currencyIterator()]).then(function () {
            //   console.log("currencies String is ", currenciesString)
            fetch('https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&interval=7d,30d,1d,1h,365d&ids=' + currenciesString)
                .then(function (res) { return res.json(); })
                .then(function (json) {
                json.map(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                    var currentPrice, lastHourPrice, yesterDayPrice, lastWeekPrice, lastMonthPrice, lastYearPrice, lastHourVolume, yesterDayVolume, lastWeekVolume, lastMonthVolume, lastYearVolume, elementName, currentTimeInGreenwich, currentTimelastHour, currentTimeYesterday, currentTimeLastWeekNumber, currentTimeLastMonth, currentTimeLastYear, yesterDayStartTime, todayStartTime, lastWeekStartTime, lastWeekEndTime, lastMonthStartTime, lastMonthEndTime, lastYearStartTime, lastYearEndTime, currentTimeMinute, hourlyGlobalPrice, dailyGlobalPrice, weeklyGlobalPrice, monthlyGlobalPrice, yearlyGlobalPrice, session, dbWeekly, dbMonthly, dbYearly, dbDaily, dbHourly;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                currentPrice = element["price"];
                                lastHourPrice = Number(element["price"]) - Number(element["1h"]["price_change"]);
                                yesterDayPrice = Number(element["price"]) - Number(element["1d"]["price_change"]);
                                lastWeekPrice = Number(element["price"]) - Number(element["7d"]["price_change"]);
                                lastMonthPrice = Number(element["price"]) - Number(element["30d"]["price_change"]);
                                lastYearPrice = Number(element["price"]) - Number(element["365d"]["price_change"]);
                                lastHourVolume = Number(element["1h"]["volume"]);
                                yesterDayVolume = Number(element["1d"]["volume"]);
                                lastWeekVolume = Number(element["7d"]["volume"]);
                                lastMonthVolume = Number(element["30d"]["volume"]);
                                lastYearVolume = Number(element["365d"]["volume"]);
                                elementName = element["symbol"];
                                currentTimeInGreenwich = moment().tz('Etc/Greenwich');
                                currentTimelastHour = moment().tz('Etc/Greenwich').subtract({ hour: 1 });
                                currentTimeYesterday = moment().tz('Etc/Greenwich').subtract({ day: 1 });
                                currentTimeLastWeekNumber = moment().tz('Etc/Greenwich').subtract({ week: 1 }).week();
                                currentTimeLastMonth = moment().tz('Etc/Greenwich').subtract({ day: 30 });
                                currentTimeLastYear = moment().tz('Etc/Greenwich').subtract({ day: 365 });
                                yesterDayStartTime = moment().tz('Etc/Greenwich').subtract({ day: 1 }).format("YYYY-MM-DD");
                                todayStartTime = moment().tz('Etc/Greenwich').format("YYYY-MM-DD");
                                lastWeekStartTime = moment().tz('Etc/Greenwich').subtract({ week: 1 }).startOf('week').format("YYYY-MM-DD");
                                lastWeekEndTime = moment().tz('Etc/Greenwich').subtract({ week: 1 }).endOf('week').format("YYYY-MM-DD");
                                lastMonthStartTime = moment().tz('Etc/Greenwich').subtract({ day: 30 }).startOf('month').format("YYYY-MM-DD");
                                lastMonthEndTime = moment().tz('Etc/Greenwich').subtract({ day: 30 }).endOf('month').format("YYYY-MM-DD");
                                lastYearStartTime = moment().tz('Etc/Greenwich').subtract({ day: 365 }).startOf('year').format("YYYY-MM-DD");
                                lastYearEndTime = moment().tz('Etc/Greenwich').subtract({ day: 365 }).endOf('year').format("YYYY-MM-DD");
                                currentTimeMinute = currentTimeInGreenwich.minute();
                                return [4 /*yield*/, mongoose.startSession()];
                            case 1:
                                session = _a.sent();
                                redis.hashGetAll(elementName + '-g').then(function (rObject) {
                                    if (rObject && rObject.current) {
                                        //       console.log("rObject is", rObject)
                                        var newMin = rObject.min;
                                        var newMax = rObject.max;
                                        if (currentPrice < newMin) {
                                            newMin = currentPrice;
                                        }
                                        if (currentPrice > newMax) {
                                            newMax = currentPrice;
                                        }
                                        redis.hashHMset(elementName + '-g', {
                                            current: currentPrice,
                                            min: newMin,
                                            max: newMax,
                                            yesterDayPrice: yesterDayPrice
                                        }).then(function () {
                                            //    console.log("element is ", element)
                                            //  const yesterDayPriceChange = Number(element["1d"]["price_change"])  
                                        });
                                    }
                                    else {
                                        //          console.log("in elseeeeeeeeeeeeeeeeeee")
                                        redis.hashHMset(elementName + '-g', {
                                            current: currentPrice,
                                            min: currentPrice,
                                            max: currentPrice,
                                            yesterDayPrice: yesterDayPrice
                                        }).then(function () {
                                            //    console.log("element is ", element)
                                            //  const yesterDayPriceChange = Number(element["1d"]["price_change"])  
                                        });
                                    }
                                })["catch"](function (err) {
                                    // console.log("in catch error",err)                        
                                });
                                dbWeekly = function () {
                                    //console.log("in db daily method")
                                    return redis.hashget(elementName + "-g" + "-w").then(function (thatWeek) {
                                        // console.log("trollo ",new Date(hourString))
                                        if (thatWeek && Number(thatWeek) === Number(moment().tz('Etc/Greenwich').subtract({ week: 1 }).week())) {
                                            //         console.log("exisst",thatWeek)
                                            //        console.log("exist")
                                        }
                                        else {
                                            // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                                            var minWeek_1;
                                            var maxWeek_1;
                                            var minCalculatorForLastWeek = function () {
                                                //                      console.log(" lastWeekStartTime :: ",   lastWeekStartTime)
                                                //                      console.log(" lastWeekEndTime :: ",   lastWeekEndTime)
                                                return globalDailyPrice_1.GlobalDailyPrice.find({
                                                    timeStamp: { $gte: lastWeekStartTime, $lte: lastWeekEndTime }
                                                }).then(function (sevenValues) {
                                                    //                            console.log("result of 7 objects for weekly", sevenValues)
                                                    return sevenValues.map(function (element) {
                                                        if (element.price.min < minWeek_1 || !minWeek_1) {
                                                            minWeek_1 = element.price.min;
                                                            //                                 console.log("minWeek is",minWeek)
                                                        }
                                                        if (element.price.max > maxWeek_1 || !maxWeek_1) {
                                                            maxWeek_1 = element.price.max;
                                                            //                                console.log("maxWeek is",maxWeek)
                                                        }
                                                    });
                                                });
                                            };
                                            return Promise.all([minCalculatorForLastWeek()]).then(function () {
                                                var weeklyDbData = {
                                                    timeStamp: moment().tz('Etc/Greenwich').subtract({ week: 1 }).format(),
                                                    price: { price: lastWeekPrice,
                                                        min: minWeek_1,
                                                        max: maxWeek_1
                                                    },
                                                    volume: lastWeekVolume,
                                                    currencyId: currencyHashMap.get(elementName)
                                                };
                                                weeklyGlobalPrice = weeklyDbData;
                                                //                   console.log("setted weekly in db",weeklyGlobalPrice)  
                                                return weeklyGlobalPrice;
                                            })["catch"](function (err) {
                                            });
                                        }
                                    })["catch"](function (err) {
                                        console.log(err);
                                    });
                                };
                                dbMonthly = function () {
                                    //console.log("in db daily method")
                                    return redis.hashget(elementName + "-g" + "-m").then(function (thatmonth) {
                                        // console.log("trollo ",new Date(hourString))
                                        if (thatmonth && Number(thatmonth) === Number(moment().tz('Etc/Greenwich').subtract({ day: 30 }).month() + 1)) {
                                            //            console.log("exisst",thatmonth)
                                            //        console.log("exist")
                                        }
                                        else {
                                            // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                                            var minMonth_1;
                                            var maxMonth_1;
                                            var minCalculatorForLastMonth = function () {
                                                //                 console.log(" lastMonthStartTime :: ",   lastMonthStartTime)
                                                //                 console.log(" lastMonthEndTime :: ",   lastMonthEndTime)
                                                return globalDailyPrice_1.GlobalDailyPrice.find({
                                                    timeStamp: { $gte: lastMonthStartTime, $lte: lastMonthEndTime }
                                                }).then(function (thirtyValues) {
                                                    //                          console.log("result of 30 objects for monthly", thirtyValues)
                                                    return thirtyValues.map(function (element) {
                                                        if (element.price.min < minMonth_1 || !minMonth_1) {
                                                            minMonth_1 = element.price.min;
                                                            //                           console.log("minMonth is",minMonth)
                                                        }
                                                        if (element.price.max > maxMonth_1 || !maxMonth_1) {
                                                            maxMonth_1 = element.price.max;
                                                            //                                 console.log("maxMonth is",maxMonth)
                                                        }
                                                    });
                                                });
                                            };
                                            return Promise.all([minCalculatorForLastMonth()]).then(function () {
                                                var monthlyDbData = {
                                                    timeStamp: moment().tz('Etc/Greenwich').subtract({ day: 30 }).format(),
                                                    price: { price: lastMonthPrice,
                                                        min: minMonth_1,
                                                        max: maxMonth_1
                                                    },
                                                    volume: lastMonthVolume,
                                                    currencyId: currencyHashMap.get(elementName)
                                                };
                                                monthlyGlobalPrice = monthlyDbData;
                                                //                       console.log("setted monthly in db",monthlyGlobalPrice)  
                                                return monthlyGlobalPrice;
                                            })["catch"](function (err) {
                                            });
                                        }
                                    })["catch"](function (err) {
                                        console.log(err);
                                    });
                                };
                                dbYearly = function () {
                                    //console.log("in db daily method")
                                    return redis.hashget(elementName + "-g" + "-y").then(function (thatYear) {
                                        // console.log("trollo ",new Date(hourString))
                                        if (thatYear && Number(thatYear) === Number(moment().tz('Etc/Greenwich').subtract({ day: 365 }).year())) {
                                            //                 console.log("exisst",thatYear)
                                            //        console.log("exist")
                                        }
                                        else {
                                            // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                                            var minYear_1;
                                            var maxYear_1;
                                            var minCalculatorForLastYear = function () {
                                                //                   console.log(" lastYearStartTime :: ",   lastYearStartTime)
                                                //                   console.log(" lastYearEndTime :: ",   lastYearEndTime)
                                                return globalMontlyPrice_1.GlobalMonthlyPrice.find({
                                                    timeStamp: { $gte: lastYearStartTime, $lte: lastYearEndTime }
                                                }).then(function (thirtyValues) {
                                                    //                         console.log("result of 12 objects for yearly", thirtyValues)
                                                    return thirtyValues.map(function (element) {
                                                        if (element.price.min < minYear_1 || !minYear_1) {
                                                            minYear_1 = element.price.min;
                                                            //                         console.log("minYear is",minYear)
                                                        }
                                                        if (element.price.max > maxYear_1 || !maxYear_1) {
                                                            maxYear_1 = element.price.max;
                                                            //                           console.log("maxYearis",maxYear)
                                                        }
                                                    });
                                                });
                                            };
                                            return Promise.all([minCalculatorForLastYear()]).then(function () {
                                                var yearlyDbData = {
                                                    timeStamp: moment().tz('Etc/Greenwich').subtract({ day: 30 }).format(),
                                                    price: { price: lastYearPrice,
                                                        min: minYear_1,
                                                        max: maxYear_1
                                                    },
                                                    volume: lastYearVolume,
                                                    currencyId: currencyHashMap.get(elementName)
                                                };
                                                yearlyGlobalPrice = yearlyDbData;
                                                //                      console.log("setted yearly in db",yearlyGlobalPrice)  
                                                return yearlyGlobalPrice;
                                            })["catch"](function (err) {
                                            });
                                        }
                                    })["catch"](function (err) {
                                        //          console.log(err)
                                    });
                                };
                                dbDaily = function () {
                                    //console.log("in db daily method")
                                    return redis.hashget(elementName + "-g" + "-d").then(function (thatDay) {
                                        // console.log("trollo ",new Date(hourString))
                                        if (thatDay && Number(thatDay) === Number(currentTimeYesterday.date())) {
                                            //             console.log("exisst",thatDay)
                                            //        console.log("exist")
                                        }
                                        else {
                                            //             console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                                            var minDay_1;
                                            var maxDay_1;
                                            var minCalculatorForYesterDay = function () {
                                                return globalHourlyPrice_1.GlobalHourlyPrice.find({
                                                    timeStamp: { $gte: yesterDayStartTime, $lt: todayStartTime }
                                                }).then(function (twentyfourPrices) {
                                                    //                       console.log("prices", twentyfourPrices)
                                                    return twentyfourPrices.map(function (element) {
                                                        if (element.price.min < minDay_1 || !minDay_1) {
                                                            minDay_1 = element.price.min;
                                                            //                             console.log("minDay is",minDay)
                                                        }
                                                        if (element.price.max > maxDay_1 || !maxDay_1) {
                                                            maxDay_1 = element.price.max;
                                                            //                        console.log("maxDay is",maxDay)
                                                        }
                                                    });
                                                });
                                            };
                                            return Promise.all([minCalculatorForYesterDay()]).then(function () {
                                                var dailyDbData = {
                                                    timeStamp: currentTimeYesterday.format(),
                                                    price: { price: yesterDayPrice,
                                                        min: minDay_1,
                                                        max: maxDay_1
                                                    },
                                                    volume: yesterDayVolume,
                                                    currencyId: currencyHashMap.get(elementName)
                                                };
                                                dailyGlobalPrice = dailyDbData;
                                                //         console.log("setted daily in db",dailyGlobalPrice)  
                                                return dailyGlobalPrice;
                                            })["catch"](function (err) {
                                            });
                                        }
                                    })["catch"](function (err) {
                                        console.log(err);
                                    });
                                };
                                dbHourly = function () {
                                    //      console.log("in db hourly method")
                                    return redis.hashget(elementName + "-g" + "-h").then(function (thatHour) {
                                        //          console.log("that hour is " ,thatHour)
                                        //          console.log("currentTime last hour is " ,currentTimelastHour.hour())
                                        if (thatHour && Number(thatHour) === Number(currentTimelastHour.hour())) {
                                            //                 return console.log("exisst",thatHour)
                                            //        console.log("exist")
                                        }
                                        else {
                                            return redis.hashGetAll(elementName + '-g').then(function (rObject) {
                                                if (rObject && rObject.current) {
                                                    //       console.log("rObject is", rObject)
                                                    var hourlyMin = Number(rObject.min);
                                                    var hourlyMax = Number(rObject.max);
                                                    //                      console.log("must be last hour with greenwich date",currentTimeInGreenwich.subtract({hours : 1}).format())
                                                    var hourlyDbData = {
                                                        timeStamp: currentTimelastHour.format(),
                                                        price: {
                                                            price: lastHourPrice,
                                                            min: hourlyMin,
                                                            max: hourlyMax
                                                        },
                                                        volume: lastHourVolume,
                                                        currencyId: currencyHashMap.get(elementName)
                                                    };
                                                    hourlyGlobalPrice = hourlyDbData;
                                                    //                  console.log("setted hourly in db",hourlyGlobalPrice)  
                                                    return hourlyGlobalPrice;
                                                }
                                                else {
                                                    //                      console.log("object is not righ",rObject)
                                                }
                                            });
                                        }
                                    })["catch"](function (err) {
                                        console.log(err);
                                    });
                                };
                                return [2 /*return*/, Promise.all([dbHourly(), dbDaily(), dbWeekly(), dbMonthly(), dbYearly()]).then(function () {
                                        session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!hourlyGlobalPrice) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, globalHourlyPrice_1.GlobalHourlyPrice.create([hourlyGlobalPrice], { session: session })
                                                            //                      console.log("in here")
                                                        ];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2:
                                                        if (!weeklyGlobalPrice) return [3 /*break*/, 4];
                                                        //                           console.log("let 's create weekly",weeklyGlobalPrice)
                                                        return [4 /*yield*/, globalWeeklyPrice_1.GlobalWeeklyPrice.create([weeklyGlobalPrice], { session: session })];
                                                    case 3:
                                                        //                           console.log("let 's create weekly",weeklyGlobalPrice)
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4:
                                                        if (!dailyGlobalPrice) return [3 /*break*/, 6];
                                                        //                 console.log("let 's create daily",dailyGlobalPrice)
                                                        return [4 /*yield*/, globalDailyPrice_1.GlobalDailyPrice.create([dailyGlobalPrice], { session: session })];
                                                    case 5:
                                                        //                 console.log("let 's create daily",dailyGlobalPrice)
                                                        _a.sent();
                                                        _a.label = 6;
                                                    case 6:
                                                        if (!monthlyGlobalPrice) return [3 /*break*/, 8];
                                                        //                      console.log("let 's create monthly",monthlyGlobalPrice)
                                                        return [4 /*yield*/, globalMontlyPrice_1.GlobalMonthlyPrice.create([monthlyGlobalPrice], { session: session })];
                                                    case 7:
                                                        //                      console.log("let 's create monthly",monthlyGlobalPrice)
                                                        _a.sent();
                                                        _a.label = 8;
                                                    case 8:
                                                        if (!yearlyGlobalPrice) return [3 /*break*/, 10];
                                                        //                       console.log("let 's create yearly",yearlyGlobalPrice)
                                                        return [4 /*yield*/, globalYearlyPrice_1.GlobalYearlyPrice.create([yearlyGlobalPrice], { session: session })];
                                                    case 9:
                                                        //                       console.log("let 's create yearly",yearlyGlobalPrice)
                                                        _a.sent();
                                                        _a.label = 10;
                                                    case 10: return [2 /*return*/];
                                                }
                                            });
                                        }); }).then(function () {
                                            redis.hashset(elementName + "-g" + "-h", currentTimelastHour.hour()).then(function () {
                                            });
                                            redis.hashset(elementName + "-g" + "-d", currentTimeYesterday.date()).then(function () {
                                            });
                                            redis.hashset(elementName + "-g" + "-w", currentTimeLastWeekNumber).then(function () {
                                            });
                                            redis.hashset(elementName + "-g" + "-m", currentTimeLastMonth.month() + 1).then(function () {
                                            });
                                            redis.hashset(elementName + "-g" + "-y", currentTimeLastYear.year()).then(function () {
                                            });
                                        })["catch"](function (err) {
                                            console.log(err);
                                        });
                                    })];
                        }
                    });
                }); });
            });
        });
    });
};
// redis.hashset("globalLastHour",currentTimeHour -1).then(()=>{
//     const hourlyDbData = {
//         timeStamp  : hourString.toString(),
//         price ,
//         volume,
//         currencyId : currencyHashMap.get(element["symbol"])
//     }
// console.log("hourlyDbData",hourlyDbData)
// const hourGlobalHourlyPrice = new GlobalHourlyPrice( hourlyDbData)
// console.log("hour global is " , hourGlobalHourlyPrice)
//  hourGlobalHourlyPrice.save().then(()=>{
//     "successfully saved price"
// }).catch((err)=>{
//     console.log(err)
// })
// }).catch((err)=>{
//     console.log("error in setting last hour data in redis")
// })
// redis.hashset(currency.ab_name+ "-h-"+"current",currentPrice)
// if()
// if(await redis.hashget(currency.ab_name+ "-h-"+"min")>currentPrice)
// redis.hashset(currency.ab_name+ "-h-"+"min",currentPrice)
// if(await redis.hashget(currency.ab_name+ "-h-"+"max"+"-")<currentPrice)
// redis.hashset(currency.ab_name+ "-h-"+"max",currentPrice)
//  const continuesChildObjectBody = {
//          currencyId : currency._id,
//          price :  currentPrice 
//  }
//  console.log("pushed",continuesChildObjectBody)
//  currenciesArr.push(continuesChildObjectBody)
//  return currenciesArr
// }
//     })
// })
//  Promise.all(arr).then(()=>{
//      console.log("in promise", currenciesArr)
//      const dailyPrice = new ContinuesPriceStat({
//          name : HourlyString,
//          currencyPriceHistory : currenciesArr
//      })
//      dailyPrice.save().then(()=>{
//              console.log("successfully saved",dailyPrice)
//      }).catch((err)=>{
//              console.log("could not save" , err)
//      })
//     //const instant = moment().tz('Iran').subtract(1, 'days')
//     console.log("in price method")
//     // ContinuesPriceStat.findOne({ name: HourlyString })
//     //     .then((result) => {
//                 fetch('https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC,ETH,TRX&interval=1m,30d,1d,1h')
//                 .then(res => res.json())
//                 .then( json => {
//                         })
//                 })
//             // ContinuesPriceStat.findOne({ name: yesterdayString })
//             // .then((result) => {
//             // })
// } 
// })}
