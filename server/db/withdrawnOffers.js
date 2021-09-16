"use strict";
exports.__esModule = true;
exports.Withdrawn_Offers = void 0;
var mongoose = require("mongoose");
var withdrawnOffers = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: false
    },
    offers: [{
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
            },
            withdrawDate: {
                type: Date,
                required: true,
                "default": Date.now
            }
            // bargains:[{
            //     userId:{
            //         type: mongoose.ObjectId,
            //         required: true,
            //     },
            //     value:{
            //         type: Number,
            //         required: true,
            //     },
            //     cur_id:{
            //         type: mongoose.ObjectId,
            //         required: true,
            //     },
            //     bar_date:{
            //         type:Date,
            //         required:true,
            //     }
            // }]
        }]
});
exports.Withdrawn_Offers = mongoose.model('WithdrawnOffers', withdrawnOffers);
