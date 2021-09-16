import * as express from 'express';
export const authRoutes = express.Router()
import * as uuid4 from 'uuid4'
import * as crypto from 'crypto'
import * as mongoose from 'mongoose'
import { logger } from '../api/logger'
import { publishQueueConnection } from '../api/amqp'
import myError from '../api/myError'

import { User, VerificationCode, VerificationPhoneCode } from '../db/user'

import { userValidationRules, validate, isEmailValid, isValidMobilePhone, numbersFormatter } from '../middlewares/validation'
import successRes from '../middlewares/response'
import tryCatch from '../middlewares/tryCtach'
import { isAuthorized } from '../middlewares/auth'
import * as fetch from 'node-fetch'

import { preventBruteForce, rateLimiterMiddleware } from '../middlewares/preventBruteForce'

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

// This end point check "Authentication" of users from MongoDB.
authRoutes.get('/auth', 
rateLimiterMiddleware,
tryCatch((req, res, next) => {
  if (!req.session.userId) {
    logger.error('Unauthorized cookie')
    const error = new myError(
      'Unauthorized cookie',
      400,
      1,
      'کاربر حق دسترسی ندارد!',
      'خطا رخ داد'
    )
    next(error)
  } else {
    successRes(res, '', { isAuth: true })
  }
}))

// This end point delete "Token" of users who want to logout from MongoDB.
authRoutes.get('/logout', 
rateLimiterMiddleware,
isAuthorized, 
tryCatch((req, res, next) => {
  const agant = req.useragent
  const userActivity = {
    action: 'LOGOUT',
    timestamp: Date.now(),
    device: agant.source,
    ip: req.ip
  }
  User.findOneAndUpdate({ _id: req.session.userId }, { $push: { userActivities: userActivity } })
  .catch((err) => {
    logger.error(`Updating user activity has some error: ${err} `)
  })
    req.session.destroy()
    successRes(res)
}))

authRoutes.get('/verifyEmails', 
rateLimiterMiddleware,
userValidationRules('query', 'string'), 
validate, 
tryCatch((req, res, next) => {
  const id = req.query.string
  VerificationCode.findOne({ name: id })
  .then((doc) => {
    if (!doc) {
      const error = new myError(
        'Verification Code is not valid!', 
        400, 
        5, 
        'کد راستی آزمایی معتبر نیست!', 
        'خطا رخ داد'
        )
      next(error)      
    } else {
      User.findOne({ emailVerificationString: doc._id })
      .then((user) => {
        if (user && user.emailVerificationString.toString() === doc._id.toString()) {
          user.email.validated = true
          user.emailVerificationString = undefined
          user.email.address = doc.email
          user.save()
          .then(() => {
            const data = {
              email: user.email.address
            }
            doc.remove().catch((err)=>{
              logger.error(err)
            })
            successRes(res, 'Email is verified', data)
          })
          .catch((err) => {
            next(err)
          })
        } else  {
          const error = new myError(
            'Verification Code is not valid!', 
            400, 
            5, 
            'کد راستی آزمایی معتبر نیست!', 
            'خطا رخ داد'
            )
          next(error)
        }
      })
      .catch((err) => {
        logger.error(`The query on User Collection with emailVerificationString ${id} has some errors: ${err}`)
        next(err)
      })
    }
  })
  .catch((err) => {
    next(err)
  })
}))

authRoutes.get('/requestForPhoneCode',
rateLimiterMiddleware,
userValidationRules('query', 'phoneNumber'),
validate,
tryCatch((req, res, next) => {
  const userId = req.session.userId
  const phoneNumber = numbersFormatter(req.query.phoneNumber, 'en')
  const code = Math.floor(Math.random() * 10000)
  const data = {
    pattern_code : process.env.SMS_API_PHONE_PATTERN_CODE,
    originator: process.env.SMS_API_DEFINITE_SENDER_NUMBER,
    recipient: phoneNumber.toString(),
    values:{ "verification-code" : code.toString()}
  }
  const body = {
    phoneNumber,
    sessionId: req.cookies.sessionId,
    code
  }
  const verificationPhoneCode = new VerificationPhoneCode({ ...body })
  verificationPhoneCode.save()
  .then(() => {
    if (userId) {
      User.findOne({ _id: userId })
      .then((user) => {
        if (user && user._id.toString() === userId) {
          user['tempPhoneNumber'] = verificationPhoneCode._id
          user.save()
          .then(() => {
            fetch('http://rest.ippanel.com/v1/messages/patterns/send', { 
              method: 'POST', 
              body : JSON.stringify(data),
              headers:  { 
              'Authorization' : process.env.SMS_API_ACCESS_KEY,
              'Content-Type': 'application/json',
              'Accept' : '*/*',
              'Connection' : 'Keep-Alive'
              }
            })
            .catch((err) => {
              const error = new myError(
                'The Sms service is not responding!',
                400,
                11,
                'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
                'خطا رخ داد'
              )
              throw(error)
            })
            .then(res => res.json())
            .then((response) => {
              if (response.status === 'OK') {
                successRes(res, '')
              } else {
                const error = new myError(
                  'The Sms service is not responding!',
                  400,
                  11,
                  'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
                  'خطا رخ داد'
                )
                next(error)
              }          
            })
            .catch((err) => {
              next(err)
            })
          })
          .catch((err) => {
            next(err)
          })
        } else {

        }
      })
      .catch((err) => {
        next(err)
      })
    } else {
      fetch('http://rest.ippanel.com/v1/messages/patterns/send', { 
        method: 'POST', 
        body : JSON.stringify(data),
        headers:  { 
        'Authorization' : process.env.SMS_API_ACCESS_KEY,
        'Content-Type': 'application/json',
        'Accept' : '*/*',
        'Connection' : 'Keep-Alive'
        }
      })
      .catch((err) => {
        const error = new myError(
          'The Sms service is not responding!',
          400,
          11,
          'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
          'خطا رخ داد'
        )
        throw(error)
      })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 'OK') {
          successRes(res, '')
        } else {
          const error = new myError(
            'The Sms service is not responding!',
            400,
            11,
            'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
            'خطا رخ داد'
          )
          next(error)
        }         
      })
      .catch((err) => {
        next(err)
      })
    }
  })
  .catch((err) => {
    next(err)
  })
}))

authRoutes.get('/verifyPhoneCode', 
rateLimiterMiddleware,
tryCatch((req, res, next) => {
  const phoneCode = req.query.phoneCode
  const userId = req.session.userId
  const sessionId = req.cookies.sessionId
  VerificationPhoneCode.findOne({ $and: [ { sessionId: sessionId }, { code: phoneCode } ] })
  .then((item) => {
    if (item && item.sessionId === sessionId) {
      if(item.code === phoneCode) {
        let query 
        if (userId) {
          query = { tempPhoneNumber: item._id }
        } else {
          query = { 'phoneNumber.number': item.phoneNumber  }
        }
        User.findOne(query)
        .then((user) => {
          if (user) {
            user.phoneNumber.number = item.phoneNumber
            user.phoneNumber.validated = true
            user['tempPhoneNumber'] = undefined
            user.save()
            .then(() => {
              item.remove()
              .catch((err) => {
                logger.error(err)
              })
              successRes(res, '', item.phoneNumber)
            })
            .catch((err) => {
              next(err)
            })
          } else {
            const error = new myError(
              'The code is not valid!',
              400,
              11,
              'کد وارد شده معتبر نیست!',
              'خطا رخ داد'
            )
            next(error)
          }
        })
        .catch((err) => {
          next(err)
        })
      } else {
      const error = new myError(
        'The code is not valid!',
        400,
        11,
        'کد وارد شده معتبر نیست!',
        'خطا رخ داد'
      )
      next(error)
      }
    } else {
      const error = new myError(
        'The code is not valid!',
        400,
        11,
        'کد وارد شده معتبر نیست!',
        'خطا رخ داد'
      )
      next(error)
    }
  })
  .catch((err) => {
    next(err)
  })
}))
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS  /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

// This end point get the users' information and save those in MongoDB.
authRoutes.post('/register',
  //rateLimiterMiddleware,
  userValidationRules('body', 'name'),
  userValidationRules('body', 'lastName'),
  userValidationRules('body', 'username'),
  userValidationRules('body', 'password'),
  validate,
  tryCatch((req, res, next) => {
    const username = req.body.username
    let rand
    let mailOptions
    let dataSms
    let code
    let isEmail = false
    let isPhoneNumber = false
    let setNewTempPhone = () => {
      return null
    }
    let setEmailVeificationCode = () => {
      return null
    }
    if (isEmailValid(username)) {
      isEmail = true
    } else if (isValidMobilePhone(username)) {
      isPhoneNumber = true
    }
    if (isPhoneNumber) {
      code = Math.floor(Math.random() * 10000)
      dataSms = {
        pattern_code : process.env.SMS_API_PHONE_PATTERN_CODE,
        originator: process.env.SMS_API_DEFINITE_SENDER_NUMBER,
        recipient: username.toString(),
        values:{ "verification-code" : code.toString()}
      }
    }
    if (isEmail) {
    //const rand = process.env.NODE_ENV === 'test' ? 'cb0059c2-5566-4967-8c9d-1126d1e9eda4' : uuid4()
    rand = uuid4()
    const link = `${process.env.API}/verify?type=email&string=${rand}`
    mailOptions = {
      from: process.env.SENDER_ADDRESS, // sender address
      to: username,
      subject: 'Please confirm your Email account',
      html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
      }
    }
    let body
    let user
    let verificationPhoneCode
    if (isEmail) {
      setEmailVeificationCode = () => {
        const bodyEmailCode = {
          name: rand
        }
        const newEmailCode = new VerificationCode({ ...bodyEmailCode })
        return newEmailCode.save()
        .then(() => {
          body = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: { address : username},
            password: req.body.password,
            label: ['USER'],
            emailVerificationString: newEmailCode._id 
          }
          user = new User({ ...body })
        })
        .catch((err) => {
          throw err
        })
      }
    } else if (isPhoneNumber) {
      setNewTempPhone = () => {
        const bodyPhoneCode = {
          phoneNumber: numbersFormatter(username, 'en'),
          sessionId: req.cookies.sessionId,
          code
        }
        verificationPhoneCode = new VerificationPhoneCode({ ...bodyPhoneCode })
        return verificationPhoneCode.save()
        .then(() => {
          body = {
            name: req.body.name,
            lastName: req.body.lastName,
            phoneNumber: {
              number: numbersFormatter(username, 'en'),
              validated: false
            },
            password: req.body.password,
            label: ['USER'] 
          }
          user = new User({ ...body })
        })
        .catch((err) => {
          if (err.name = 'MongoError' && err.code === 11000) {
            logger.error(`The save action on Verification Collection with document ${bodyPhoneCode} has some errors: ${err}`)
            const error = new myError(
              '!',
              400,
              9,
              'لطفا چند دقیقه بعد از درخواست قبلی صبر نمیایید!',
              'خطا رخ داد '
            )
            throw (error)
            }
            else 
            throw (err) 
        })
      }
    }
    Promise.all([setNewTempPhone(), setEmailVeificationCode()])
    .then(() => {
      user.save()
      .then((usr) => {
        const data = {
          email: user.email.address,
          tempPhoneNumber: verificationPhoneCode ? verificationPhoneCode._id : undefined,
          isActive: user.isActive,  
        }
        if (isEmail) {
          const body1 = {
            aUsername: username,
            aPass: req.body.password,
            aPassConfirm: req.body.password,
            aFullname: req.body.name + req.body.lastName,
            aTitle: username,
            userId: usr._id,
            aGrps: ["5fb38b5de54aaa00062de4cb"],//[group._id.toString()],
            aEmail: username
          }
          const body1Json = JSON.stringify(body1)
          console.log(body1Json)
          fetch("http://localhost:3001/tickets/register", {
            method: 'POST',
            body: body1Json,
            headers: {
            accessToken: process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
             }
         })
        .then((res) => res.json())
        .then((response) => { console.log('response: ', response) })
        .catch((err) => { console.log('err: ', err) })
          successRes(res, 'Registration is done successfully', data, { isEmail })
          publishQueueConnection(mailOptions)
        } else if (isPhoneNumber) {
          const body1 = {
            aUsername: username,
            aPass: req.body.password,
            aPassConfirm: req.body.password,
            aFullname: req.body.name + req.body.lastName,
            aTitle: username,
            
            //aGrps: [group._id.toString()],
            userId: usr._id,
            aEmail: username.concat("@gmail.com")
          }
          const body1Json = JSON.stringify(body1)
          fetch("http://localhost:3001/tickets/register", {
            method: 'POST',
            body: body1Json,
            headers: {
            accessToken: process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
             }
      })
      .then((res) => res.json())
      .then((response) => {})

          successRes(res, 'Registration is done successfully', data, { isPhoneNumber })
          fetch('http://rest.ippanel.com/v1/messages/patterns/send', 
          { 
            method: 'POST', 
            body: JSON.stringify(dataSms),
            headers: { 
              'Authorization' : process.env.SMS_API_ACCESS_KEY,
              'Content-Type': 'application/json',
              'Accept' : '*/*',
              'Connection' : 'Keep-Alive'
            }
          })
          .catch((err) => {
            const error = new myError(
              'The Sms service is not responding!',
              400,
              11,
              'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
              'خطا رخ داد'
            )
            logger.error(error.message);
            
          })
          .then(res => res.json()) // expecting a json response
          .then((response) => {
            if (response.status !== 'OK') {
              const error = new myError(
                'The Sms service is not responding!',
                400,
                11,
                'سرویس ارسال پیامک دچار مشکل شده است. لطفا لحظاتی بعد دوباره اقدام فرمایید.',
                'خطا رخ داد'
              )
              logger.error(error.message)
            }
          })
          .catch((err) => {
            logger.error(err)
          })
        }
      })
      .catch((err) => {
          if (err.name = 'MongoError' && err.code === 11000) {
            logger.error(`The save action on User Collection with document ${req.body.lastName} has some errors: ${err}`)
            const error = new myError(
              'The user has registered already!',
              400,
              9,
              'شما قبلا ثبت نام کرده اید!',
              'خطا رخ داد '
            )
            next(error)
          } else {
            next(err)
          }
      })
    })
    .catch((err) => {
      next(err)
    })
  }))

authRoutes.post('/sendEmailVerificationLink', 
rateLimiterMiddleware,
userValidationRules('body', 'email'), 
validate, 
tryCatch((req, res, next) => {
  const email = req.body.email
  User.findOne({ email: email })
  .then((user) => {
    if (!user) {
      const error = new myError(
        `Email address ${email} is not valid!`,
        400,
        12,
        'آدرس ایمیل معتبر نیست!',
        'خطا رخ داد'
      )
      next(error)
    } else {
      // const rand = uuid4()
      const rand = process.env.NODE_ENV === 'test' ? 'cb0059c2-5566-4967-8c9d-1126d1e9eda5' : uuid4()
      const link = `${process.env.API}/verify?type=email&string=${rand}`
      const mailOptions = {
        from: process.env.SENDER_ADDRESS, // sender address
        to: email,
        subject: 'Please confirm your Email account',
        html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
      }
      const bodyEmailCode = {
        name: rand
      }
      const newEmailCode = new VerificationCode({ ...bodyEmailCode })
      newEmailCode.save()
      .then(() => {
        user.updateOne({ $set: { emailVerificationString: newEmailCode._id } })
        .then(() => {
          const data = {
            email: email
          }
          successRes(res, 'Please verify your email', data)
          publishQueueConnection(mailOptions)
        })
        .catch((err) => {
          next(err)
        })
      })
      .catch((err) => {
        next(err)
      })
    } 
  })
  .catch((err) => {
    next(err)
  })
}))

authRoutes.post('/sendPasswordVerificationLink', 
rateLimiterMiddleware,
userValidationRules('body', 'email'), 
validate, 
tryCatch((req, res, next) => {
  const email = req.body.email
  User.findOne({ email: email })
  .then((user) => {
    if (!user) {
      const error = new myError(
        'Email address is not valid!',
        400,
        12,
        'آدرس ایمیل معتبر نیست!',
        'خطا رخ داد'
      )
      next(error)
    } else {
      const rand = process.env.NODE_ENV === 'test' ? 'e39459ee-18b4-4967-aaaa-f22fb26a8beb' : uuid4()
      // const rand = uuid4()
      const link = `${process.env.API}/verify?type=password&string=${rand}`
      const mailOptions = {
        from: process.env.SENDER_ADDRESS, // sender address
        to: email,
        subject: 'Please confirm your Email account',
        html: 'Hello,<br> Please Click on the link to verify your email.<br><a href=' + link + '>Click here to verify</a>'
      }
      const hash = crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
        .update(rand)
        .digest('hex')
      const verificationCode = new VerificationCode({ code: hash })
      verificationCode.save()
      .then(() => {       
        user.updateOne({ $set: { resetPasswordVerificationString: mongoose.Types.ObjectId(verificationCode._id) } })
        .then(() => {
          successRes(res, 'Please verify your email')
          publishQueueConnection(mailOptions)
        })
        .catch((err) => {
          next(err)
        })
      })
      .catch((err) => {
        next(err)
      })
    }
  })
  .catch((err) => {
    logger.error(`The find action on User Collection with email ${email} has some errors: ${err}`)
    next(err)
  })
}))

authRoutes.post('/resetPassword',
rateLimiterMiddleware,
  userValidationRules('body', 'id'),
  userValidationRules('body', 'password'),
  validate,
  tryCatch((req, res, next) => {
    const id = req.body.id
    const hash = crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
      .update(id)
      .digest('hex')
    VerificationCode.findOne({ code: hash })
    .then((doc) => {
      if (!doc) {
        logger.warn(`ResetPasswordVerificationString ${hash} is not valid!`)
        const error = new myError(
          'Verification Code is not valid!',
          400,
          5,
          'کد راستی آزمایی معتبر نیست!',
          'خطا رخ داد'
        )
        next(error)
      } else {
        User.findOne({ resetPasswordVerificationString: doc._id })
        .then((user) => {
            if (!user) {
            logger.error(`The query on User Collection with resetPasswordVerificationString ${id} has response null!`)
            const error = new myError(
              'Verification Code is not valid!', 400,
              5,
              'کد راستی آزمایی معتبر نیست!',
              'خطا رخ داد'
            )
            next(error)
          } else {
            user.password = req.body.password
            user.resetPasswordVerificationString = undefined
            VerificationCode.deleteOne({ code: hash })
              .catch((err) => {
                logger.error(err)
              })
            user.save()
            .then(() => {
              const data = {
                email: user.email.address
              }
              successRes(res, 'password is successfuly reset', data)
            })
            .catch((err) => {
              next(err)
            })
          }
        })
        .catch((err) => {
          next(err)
        })
      }
    })
    .catch((err) => {
      next(err)
    })
  }))

authRoutes.post('/resetPasswordWithPhone',
rateLimiterMiddleware,
userValidationRules('body', 'password'),
userValidationRules('body', 'passwordConfirm'),
// userValidationRules('body', 'verificationCode'),
validate,
tryCatch((req, res, next) => {
  console.log(req.body)
  const password = req.body.password
  const passwordConfirm = req.body.passwordConfirm
  const verificationCode = req.body.verificationCode
  const sessionId =  req.cookies.sessionId 
  if (password !== passwordConfirm) {
    const error = new myError(
      'passwords do not match!',
      400,
      11,
      'پسورد ها باهم همخوانی ندارند',
      'خطا رخ داد'
    )
    next(error)
  } else {
  VerificationPhoneCode.findOne({ $and: [ { code: verificationCode }, { sessionId: sessionId } ] })
  .then((item) => {
    if (item && item.code.toString() === verificationCode.toString() && item.sessionId.toString()=== sessionId.toString()) {
      User.findOne({ 'phoneNumber.number': item.phoneNumber })
      .then((user) => {
        if (user && user.phoneNumber && user.phoneNumber.number === item.phoneNumber) {
          if (user.phoneNumber.validated === true) {
            user.password = password
            user.save()
            .then(() => {
              item.remove()
              .then(() => {
                successRes(res, '', user.phoneNumber.number)
              }).catch((err)=>{ next(err)})
            
            })
            .catch((err) => {
              next(err)
            })
          } else {
            const error = new myError(
              'The phoneNumber is not validated!',
              400,
              18,
              'شماره مورد نظر هنوز راستی آزمایی نشده است!',
              'خطا رخ داد'
            )
            next(error)            
          }
        } else {
          const error = new myError(
            'The code is not valid!',
            400,
            11,
            'کد معتبر نیست',
            'خطا رخ داد'
          )
          next(error)
        }
      })
      .catch((err) => {
        next(err)
      })
    } else {
      const error = new myError(
        'The code is not valid!',
        400,
        11,
        'کد معتبر نیست',
        'خطا رخ داد'
      )
      next(error)
    }
  })
  .catch((err) => {
    next(err)
  })
}
}))

authRoutes.post('/changePassword',
rateLimiterMiddleware,
  isAuthorized,
  userValidationRules('body', 'password'),
  validate,
  userValidationRules('body', 'newPassword'),
  validate,
  tryCatch((req, res, next) => {
    User.findOne({ email: req.session.email })
    .then((user) => {
      if (!user) {
        logger.warn('Email address is not valid!')
        const error = new myError(
          'Email address is not valid!',
          12,
          400,
          'آدرس ایمیل معتبر نیست!',
          'خطا رخ داد'
        )
        next(error)
      } else {
        user.comparePasswordPromise(req.body.password)
        .then((isMatch) => {
          if (!isMatch) {
            logger.warn('Password is not valid!')
            const error = new myError(
              'Inputs are not valid!',
              400,
              15,
              'ورودی های درخواستی معتبر نیستند!',
              'خطا رخ داد'
            )
            next(error)
          } else {
            user.password = req.body.newPassword
            user.save()
            .then(() => {
                successRes(res, 'password is successfuly changed')
            })
            .catch((err) => {
              next(err)
            })
          }
        })
        .catch((err) => {
          next(err)
        })
      }
    })
    .catch((err) => {
      next(err)
    })
  }))

// This end point execute the following actions:
// 1. Find the document of a user who send the email.doc
// 2. Compare the Passord to hash of the password which is stored in MongoDB.
// 3. Generate a token and save it in MongoDB.
// 4. Send the tocken as a cookie to client.
authRoutes.post('/login', 
//rateLimiterMiddleware,
//preventBruteForce,
  userValidationRules('body', 'username'),
  userValidationRules('body', 'password'),
  validate,
  tryCatch((req, res, next) => {
    const agent = req.useragent
    const username = req.body.username
    let isEmail = false
    let isPhoneNumber = false
    let query
    if (isEmailValid(username)) {
      isEmail = true
      query = { 'email.address' : username}
    } else if (isValidMobilePhone(username)) {
      isPhoneNumber = true
      query = { 'phoneNumber.number': username }
    }
    User.findOne(query)
      .then((user) => {
        if (!user) {
          const error = new myError(
            'Email or Password are not valid!',
            400,
            8,
            'نام کاربری یا گذرواژه معتبر نیستند!',
            'خطا رخ داد'
          )
          next(error)
        } else if (user && isEmail && user.email.validated !== true) {
          const error = new myError(
            'The email is not verified!',
            400,
            17,
            'آدرس ایمیل شما هنوز راستی آزمایی نشده است!',
            'خطا رخ داد'
          )
          next(error)
        } else if (user && isPhoneNumber && user.phoneNumber.number && user.phoneNumber.validated !== true) {
          const error = new myError(
            'The mobile phone is not verified!',
            400,
            18,
            'شماره موبایل شما هنوز راستی آزمایی نشده است!',
            'خطا رخ داد'
          )
          next(error)
        } else if (user && user.isActive !== true) {
          const error = new myError(
            'The account is not active!',
            400,
            18,
            'حساب کاربری شما غیرفعال شده است!',
            'خطا رخ داد'
          )
          next(error)
        } else {
            user.comparePasswordPromise(req.body.password)     
              .then((isMatch)=> {
              if (!isMatch) {
                logger.info('Passwords are not match')
                const error = new myError(
                  'Username or Password are not valid!',
                  400,
                  8,
                  'نام کاربری یا گذرواژه معتبر نیستند!',
                  'خطا رخ داد'
                )
                next(error)
              } else {
                const userActivity = {
                  action: 'LOGIN',
                  timestamp: Date.now(),
                  device: agent.source,
                  ip: req.ip
                }
                user.userActivities.push(userActivity)
                user.save()
                .then(() => {
                  req.session.userId = user._id
                  const profile = {
                    name: user.name,
                    lastName: user.lastName,
                    userId: user._id,
                    userType: user.userType
                  }
                  successRes(res, '', profile)
              })
              .catch((err) => {
                logger.error(`Adding activity has some errors: ${err}`)
                const error = new myError(
                  'Error happened during the login!',
                  500,
                  16,
                  'در ورود شما مشکلی پیش آمده است!',
                  'خطا در سرور'
                )
                next(error)
              })  
            }
          })
          .catch((err) => {
            logger.error(`comparePassword method has some errors: ${err}`)
            const error = new myError(
              'Error happened during the login!',
              500,
              16,
              'در ورود شما مشکلی پیش آمده است!',
              'خطا در سرور'
            )
            next(error)
          })  
        }
      })
      .catch((err) => {
        logger.error(`The find action on User Collection with email ${req.body.email} has some errors: ${err}`)
        const error = new myError(
          'Error happened during the login!',
          500,
          16,
          'در ورود شما مشکلی پیش آمده است!',
          'خطا در سرور'
        )
        next(error)
      })
  }))

