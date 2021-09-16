"use strict";
exports.__esModule = true;
exports.PendingTransfers = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var pendingTransfers = new mongoose.Schema({
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
                type: String
            },
            value: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true,
                "enum": ['send', 'receive']
            }
        }
    ]
}, schemaOptions);
exports.PendingTransfers = mongoose.model('PendingTransfers', pendingTransfers);
