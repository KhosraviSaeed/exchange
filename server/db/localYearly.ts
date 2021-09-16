import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };

const localYearly = new mongoose.Schema({


    name:{
        type: Date,
        required: true,
    },
    currencies:[
        {
            currencyId:{
                type: mongoose.ObjectId,
                required: true,
            },
        
            price:{
                type:Number,
                required: true,
            
            },
            volume:{
                type: Number,
                required: true,
            
            },
            min:{
                type: Number,
                required: true,

            },
            max:{
                type: Number,
                required: true,
            }
        }]

}, schemaOptions)

export const LocalYearly  = mongoose.model('localYearly', localYearly)
