"use strict";
exports.__esModule = true;
exports.Accepted_Offers = void 0;
var mongoose = require("mongoose");
var schemaOptions = {
    timestamps: { createdAt: 'created_at' }
};
var acceptedOffers = new mongoose.Schema({
    buyOrderId: {
        type: String,
        required: false
    },
    acceptor: {
        type: mongoose.ObjectId,
        required: true
    },
    creator: {
        type: mongoose.ObjectId,
        required: true
    },
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
}, schemaOptions);
exports.Accepted_Offers = mongoose.model('AcceptedOffers', acceptedOffers);
