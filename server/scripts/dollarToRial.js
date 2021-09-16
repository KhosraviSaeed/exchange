"use strict";
exports.__esModule = true;
exports.addDollarPrice = void 0;
var redis = require("../api/redis");
var fetch = require('node-fetch');
exports.addDollarPrice = function () {
    fetch("https://api.tgju.online/v1/data/sana/json")
        .then(function (res) { return res.json(); })
        .then(function (json) {
        var price = Number(json['sana']['data'][16]['p']);
        redis.hashset("dollarPrice", price)
            .then(function (added) {
            console.log("price of dollar added to redis", added);
        })["catch"](function (err) {
            console.log("error is ", err);
        });
    })["catch"](function (err) {
        console.log("error is", err);
    });
};
