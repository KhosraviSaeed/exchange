import * as mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };
const failedTransfers = new mongoose.Schema({

  
    
    userId : {
        type: mongoose.ObjectId,
        required: true
    },
    transactions:[
        {
            txId:{
                type : String,
                required : true
            },
            currencyId : {
                type : mongoose.ObjectId,
                required : true 
            },
            currencyName : {
                type : String
            },
            value:{
                type: Number,
                required: true
            },
            type:{
                type:String,
                required:true,
                enum: ['send','receive'],
                 
            }

        }
    ]
}, schemaOptions )
export const FailedTransfers = mongoose.model('FailedTransfers', failedTransfers)