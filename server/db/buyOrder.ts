import * as mongoose from 'mongoose'
const schemaOptions = {
    timestamps: { createdAt: 'created_at' },
  };
const buyOrder = new mongoose.Schema({
    currencyId : {
        type : mongoose.ObjectId,
        required : true,
    }
    ,
    id:{
        type: String,
        required: true,
        unique: true
    },
    
    
    transferredValue : {
        type : Number,
        required : true,
        default : 0,
    },
  
        userId : {
            type : mongoose.ObjectId,
            required: true
        },
        value : {
            type : Number,
            //required : true,
            //default : 0,
            },
        shouldBuyValue : {
            type: Number,
            required : true,
            default : 0,  
        }
        
   
},schemaOptions)
export const BuyOrder = mongoose.model('buyOrder', buyOrder)

