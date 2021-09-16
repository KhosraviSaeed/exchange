"use strict";
exports.__esModule = true;
exports.curreniesAdder = void 0;
var redis = require("../api/redis");
var currencies_1 = require("../db/currencies");
exports.curreniesAdder = function () {
    currencies_1.Currencies.find()
        .then(function (currs) {
        var currsMap = currs.map(function (cur) {
            var curInfo = {
                currencyName: cur.name,
                ab_name: cur.ab_name,
                per_name: cur.per_name,
                icon: cur.icon,
                quantity: cur.quantity
            };
            var curInfo2 = {
                currencyName: cur.name,
                ab_name: cur.ab_name,
                per_name: cur.per_name,
                icon: cur.icon,
                quantity: cur.quantity,
                id: cur._id.toString()
            };
            return redis.hashHMset(cur.name.toString(), curInfo2).then(function () {
                return redis.hashHMset(cur._id.toString(), curInfo);
            })
                .then(function (added) {
                console.log("added to redis successfully", added);
            })["catch"](function (err) {
                console.log("the error is =>", err);
            });
        });
        Promise.all(currsMap)["catch"](function (err) {
            console.log(err);
        });
    })["catch"](function (err) {
        console.log(err);
    });
};
