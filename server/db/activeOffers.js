"use strict";
exports.__esModule = true;
exports.Active_Offers = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var activeOffers = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    offerId: {
        type: String,
        required: true,
        unique: true
    },
    rank: {
        type: Number,
        min: 1,
        max: 5,
        "default": 1
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
    expDate: {
        type: Date,
        required: true,
        "default": Date.now()
    }
}, schemaOptions);
exports.Active_Offers = mongoose.models.ActiveOffers || mongoose.model('ActiveOffers', activeOffers);
