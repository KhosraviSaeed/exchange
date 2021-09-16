import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'



const globalHourlyPriceSchema = new mongoose.Schema({
  timeStamp: {
    type: Date
  },
  currencyId: {
    type: mongoose.ObjectId
  },
  price:{
    price : 
    {
      type: Number
    },
    min :{
      type: Number
    },
    max: {
      type: Number
    }

  },
  volume : {
    type : Number
  }

})

// This functions will execute if the password field is modified.


// This method compares the password which is stored in database and
// the password which the user entered. It is used in Login.

export const GlobalHourlyPrice = mongoose.model('GlobalHourlyPrice', globalHourlyPriceSchema)
