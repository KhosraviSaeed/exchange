import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose'

const getPrice = new mongoose.Schema({
    currency: {
        type:ObjectID,
        required: true
    },
    userId : {
        type: mongoose.ObjectId,
        required: true
    },
    quantity: {
        type:Number,
        required: true
    },
    rialPricePerUnit: {
        type:Number,
        default: 0
    },
    createdAt: { type: Date, expires: 20, default: Date.now }
},{ timestamp: true })

export const GetPrice = mongoose.model('getPrice', getPrice)
