"use strict";
exports.__esModule = true;
exports.Withdraw_Offers = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var withdrawnOffers = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: false
    },
    offers: [{
            offerId: {
                type: String,
                required: true,
                unique: true
            },
            curGivenId: {
                type: mongoose.ObjectId,
                required: true
            },
            curGivenVal: {
                type: Number,
                required: true
            },
            curTakenId: {
                type: mongoose.ObjectId,
                required: true
            },
            curTakenVal: {
                type: Number,
                required: true
            },
            offeredDate: {
                type: Date,
                required: true
            },
            expiredDate: {
                type: Date,
                required: true
            }
        }]
}, schemaOptions);
exports.Withdraw_Offers = mongoose.model('WithdrawnOffers', withdrawnOffers);
