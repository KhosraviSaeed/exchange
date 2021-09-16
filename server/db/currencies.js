"use strict";
exports.__esModule = true;
exports.Currencies = void 0;
var mongoose = require("mongoose");
var currencies = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        "enum": ['RIAL', 'BITCOIN', 'TRON', 'ETHEREUM'],
        unique: true
    },
    per_name: {
        type: String,
        required: true,
        "enum": ['ریال', 'بیت کوین', 'ترون', 'اتریوم'],
        unique: true
    },
    ab_name: {
        type: String,
        required: true,
        "enum": ['IRR', 'BTC', 'TRX', 'ETH'],
        unique: true
    },
    icon: {
        type: String
    },
    quantity: {
        type: Number,
        //required: true,
        "default": 0
    }
    // value:{
    //     type:Number,
    // },
});
exports.Currencies = mongoose.model('currencies', currencies);
