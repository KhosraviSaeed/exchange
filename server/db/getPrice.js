"use strict";
exports.__esModule = true;
exports.GetPrice = void 0;
var mongodb_1 = require("mongodb");
var mongoose = require("mongoose");
var getPrice = new mongoose.Schema({
    currency: {
        type: mongodb_1.ObjectID,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    rialPricePerUnit: {
        type: Number,
        "default": 0
    },
    createdAt: { type: Date, expires: 20, "default": Date.now }
}, { timestamp: true });
exports.GetPrice = mongoose.model('getPrice', getPrice);
