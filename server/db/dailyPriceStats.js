"use strict";
exports.__esModule = true;
exports.DailyPriceStat = void 0;
var mongoose = require("mongoose");
var dailyPriceStat = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    currencyPriceHistory: [
        {
            currencyId: {
                type: mongoose.ObjectId,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            volume: {
                type: Number,
                required: true
            }
        }
    ]
});
exports.DailyPriceStat = mongoose.model('dailyPriceStat', dailyPriceStat);
