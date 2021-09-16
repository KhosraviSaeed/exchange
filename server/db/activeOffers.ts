import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };

const activeOffers = new mongoose.Schema({

    userId : {
        type: mongoose.ObjectId,
        required: true
    },
    offerId:{
        type: String,
        required: true,
        unique: true
    },
    rank: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
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
    expDate:{
        type:Date,
        required: true,
        default: Date.now()
    }
}, schemaOptions )



export const Active_Offers = mongoose.models.ActiveOffers || mongoose.model('ActiveOffers', activeOffers)
