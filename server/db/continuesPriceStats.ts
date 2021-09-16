import * as mongoose from 'mongoose'

const continuesPriceStat = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    },
    currencyPriceHistory:[
    { 
        currencyId : {
            type : mongoose.ObjectId,
            required:true,
        },
        price: {
            type : Number,
            required:true
        }
        
    }
    ]
    
})

export const ContinuesPriceStat = mongoose.model('continuesPriceStat', continuesPriceStat)
