import * as mongoose from 'mongoose'
const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };
const withdrawnOffers = new mongoose.Schema({

    userId : {
        type: mongoose.ObjectId,
        required: false,
    },
    offers : [{
        offerId:{
            type: String,
            required: true,
            unique: true
        },
        curGivenId:{
            type: mongoose.ObjectId,
            required: true
        },
        curGivenVal:{
            type: Number,
            required: true
        },
        curTakenId:{
            type: mongoose.ObjectId,
            required: true
        },
        curTakenVal:{
            type: Number, 
            required: true
        },
        offeredDate:{
            type:Date,
            required: true,
        },
        expiredDate:{
            type:Date,
            required: true,
        },
        //withdrawDate:{
        //    type: Date,
        //    required: true,
        //    default: Date.now,
        //}
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
    }],
}, schemaOptions)



export const Withdraw_Offers = mongoose.model('WithdrawnOffers', withdrawnOffers)