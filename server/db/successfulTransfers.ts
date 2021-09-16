import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };
const successfulTransfers = new mongoose.Schema({
    userId : {
        type: mongoose.ObjectId,
        required: true
    },
    transactions:[
        {
            txId: {
                type : String,
                required : true
            },
            currencyId : {
                type : mongoose.ObjectId,
                required : true 
            },
            currencyName : {
                type : String,
                required : true 
            },
            value:{
                type: Number,
                required: true
            },
            type:{
                type:String,
                required:true,
                enum: ['send','receive','id'],
            }
        }
    ]
}, schemaOptions )

export const SuccessfulTransfers = mongoose.model('SuccessfulTransfers', successfulTransfers)