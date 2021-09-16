"use strict";
exports.__esModule = true;
exports.SuccessfulTransfers = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var successfulTransfers = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    transactions: [
        {
            txId: {
                type: String,
                required: true
            },
            currencyId: {
                type: mongoose.ObjectId,
                required: true
            },
            currencyName: {
                type: String,
                required: true
            },
            value: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true,
                "enum": ['send', 'receive', 'id']
            }
        }
    ]
}, schemaOptions);
exports.SuccessfulTransfers = mongoose.model('SuccessfulTransfers', successfulTransfers);
