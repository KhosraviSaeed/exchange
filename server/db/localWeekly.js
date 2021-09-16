"use strict";
exports.__esModule = true;
exports.LocalWeekly = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var localWeekly = new mongoose.Schema({
    name: {
        type: Date,
        required: true
    },
    currencies: [
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
            },
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        }
    ]
}, schemaOptions);
exports.LocalWeekly = mongoose.model('localWeekly', localWeekly);
