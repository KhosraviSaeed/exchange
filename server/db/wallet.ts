import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export const verificationCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email :{ 
    type :  String
  }
  ,
  createdAt: { type: Date, expires: 60 * 60 * 2, default: Date.now }
}, { timestamp: true })

export const verificationPhoneCodeSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    min: 11,
    max: 11,
    unique: true
  },
  validated: {
    type: Boolean,
    required: true,
    default: false
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  sessionId: {
    type: String
  },
  createdAt: { type: Date, expires: 60 * 2, default: Date.now }
}, { timestamp: true })


const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    address :{
      type: String,
      // required: true,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { 'email.address': {$type: "string" } }
      } 
    },    
    validated: {
      type: Boolean,
      default: false,
      required: true,
    }
  },
  phoneNumber: {
    number: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { 'phoneNumber.number': {$type: "string" } }
      }, 
      min: 11,
      max: 11
    },
    validated: {
      type: Boolean,
      default: false,
      required: true,
    }
  },
  tempPhoneNumber: {
    type: mongoose.ObjectId
  },
  birthdate: {
    year: {
      type: String
    },
    month: {
      type: String
    },
    day: {
      type: String
    }
  },
  emailVerificationString: {
    type: mongoose.ObjectId
  },
  resetPasswordVerificationString: {
    type: mongoose.ObjectId
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  label: {
    type: Array,
    required: true
  },
  userActivities: [
    {
      action: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date
      },
      device: {
        type: String
      },
      loginDeviceId: {},
      ip: {
        type: String
      }
    }
  ],
  address: [{
    title: {
      type: String,
      trim: 1
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String
    },
    province: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true,
      min: [10, 'Postal Code is 10 Digits'],
      max: [10, 'Postal Code is 10 Digits']
    },
    address: {
      type: String,
      required: true,
      max: [130, 'Maximmum allowed string length is 130 ']
    },

     mobilePhone: {
       type: String
     },
     phone: {
       type: String
     }
   }],
   userType: {
     type: String,
     enum: ['Normal', '‌‌Builder', 'Vip'],
     required: true,
     default: 'Normal'
   },
   wallet:[
     {
     currency:{
       type:mongoose.ObjectId,
       required:true,
       
    
      },
    value:{
      type:Number,
      required:true,
      default:0,
    
    }
  }

   ]
})

// This functions will execute if the password field is modified.
userSchema.pre('save', function (next) {
  var user = this
  if (user.isModified('password')) {
  bcrypt.genSalt(Number(process.env.SALT_I))
  .then((salt) => {
    bcrypt.hash(user.password, salt)
    .then((hash) => {
      user.password = hash
      next()
    })
    .catch((err) => {
      next(err)
    })
  })
  .catch((err) => {
    next(err)
  })
} else {
  next()
}
})

// This method compares the password which is stored in database and
// the password which the user entered. It is used in Login.
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.comparePasswordPromise = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password)
    .then(function(isMatch) {
      resolve(isMatch)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

export const User = mongoose.model('User', userSchema)
export const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema)
export const VerificationPhoneCode = mongoose.model('VerificationPhoneCode', verificationPhoneCodeSchema)
