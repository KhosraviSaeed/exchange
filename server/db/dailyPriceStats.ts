import * as mongoose from 'mongoose'

const dailyPriceStat = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    currencyPriceHistory:[
    { 
        currencyId : {
            type : mongoose.ObjectId,
            required:true
        },
        price: {
            type : Number,
            required:true
        },
        volume:{
            type: Number,
            required : true
        }
    }
    ]
    
})

export const DailyPriceStat = mongoose.model('dailyPriceStat', dailyPriceStat)
