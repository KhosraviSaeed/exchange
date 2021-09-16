"use strict";
exports.__esModule = true;
exports.ContinuesPriceStat = void 0;
var mongoose = require("mongoose");
var continuesPriceStat = new mongoose.Schema({
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
            }
        }
    ]
});
exports.ContinuesPriceStat = mongoose.model('continuesPriceStat', continuesPriceStat);
