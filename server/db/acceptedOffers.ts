import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };
const acceptedOffers = new mongoose.Schema({

    buyOrderId:{
        type: String,
        required: false,
    },

    acceptor : {
        type: mongoose.ObjectId,
        required: true
    },
    creator: {
        type:mongoose.ObjectId,
        
        required:true,
    },
    offerId: {
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
   
}, schemaOptions )


export const Accepted_Offers = mongoose.model('AcceptedOffers', acceptedOffers)


