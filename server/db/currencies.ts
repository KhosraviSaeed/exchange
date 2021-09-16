import * as mongoose from 'mongoose'

const currencies = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        enum: ['RIAL', 'BITCOIN', 'TRON', 'ETHEREUM'],
        unique: true,
    },
    per_name:{
        type:String,
        required:true,
        enum:['ریال', 'بیت کوین','ترون','اتریوم'],
        unique: true,
    },
    ab_name:{
        type:String,
        required:true,
        enum: ['IRR', 'BTC', 'TRX', 'ETH'],
        unique: true,
    },
    icon:{
        type:String, 
        //required:true,
        //unique: true,
    },
    quantity:{
        type: Number,
        //required: true,
        default: 0
    }
    // value:{
    //     type:Number,
    // },
})

export const Currencies = mongoose.model('currencies', currencies)
