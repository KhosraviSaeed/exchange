import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };

const localMonthly = new mongoose.Schema({


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

export const LocalMonthly  = mongoose.model('localMonthly', localMonthly)
