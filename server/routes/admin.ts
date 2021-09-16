import * as express from 'express';

import { logger } from '../api/logger'
import myError from '../api/myError'
import { isAdmin } from '../middlewares/auth'

import { User } from '../db/user'
import { Admin } from '../db/admin'
import { Currencies } from '../db/currencies' 


import { userValidationRules, validate } from '../middlewares/validation'
import successRes from '../middlewares/response'
import tryCatch from '../middlewares/tryCtach'
const roles = ['Admin', 'Manager', 'Supporter']
const managerEditableFields = ['name', 'lastName', 'email', 'isActive', 'role']
const supporterEditableFields = ['name', 'lastName', 'email', 'isActive', 'role']
const userEditableFields = ['isActive', 'userType']

export const adminRoutes = express.Router()

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// AUTH ENDPOINTS   ////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////


adminRoutes.post('/addCurrency', 
// isAdmin,
userValidationRules('body','currencyName'),
userValidationRules('body','persianName'),
userValidationRules('body','abName'),
validate,
tryCatch((req, res, next) => {
   
    const currencyName = req.body.currencyName
    const perName = req.body.persianName
    const abName = req.body.abName
    const icon = req.body.icon
    Currencies.findOne({name : currencyName})
    .then( (curr) => {
        if(curr) {
            const error = new myError(
                'this currency is already exsis', 
                400, 
                5, 
                'ارز فوق  وجود دارد !', 
                'خطا رخ داد'
                )
            next(error)
        } else {
            if((currencyName === 'BITCOIN'  && perName === 'بیت کوین' && abName === 'BTC') 
            || (currencyName === 'RIAL'     && perName === 'ریال'     && abName === 'IRR') 
            || (currencyName === 'TRON'     && perName === 'ترون'     && abName === 'TRX') 
            || (currencyName === 'ETHEREUM' && perName === 'اتریوم'   && abName === 'ETH')) {
                const currency = {
                    name: currencyName,
                    per_name: perName,
                    ab_name: abName,
                    icon
                }
                const newCurrency = new Currencies({ ...currency })  
                newCurrency.save()
                .then(()=>{
                    successRes(res,"currency created successfully", newCurrency._id)
                })
                .catch( (err) => {
                    next(err)
                })
            } else {
                const error = new myError(
                    'Currency persian name or ab name are not match with currency name',
                    400,
                    11,
                    'نام فارسی ارز یا نام مخفف ارز با نام ارز مطابقت ندارد.',
                    'خطا رخ داد'
                )
                next(error)
            }
        }
    })
    .catch((err) =>{
        next(err)
    })       
}))


adminRoutes.post('/register',
    userValidationRules('body', 'email'),
    userValidationRules('body', 'password'),
    userValidationRules('body', 'name'),
    userValidationRules('body', 'lastName'),
    validate,
    tryCatch((req, res, next) => {
        const email = req.body.email
        const body = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: email,
            password: req.body.password,
            role: roles[0]
        }
        Admin.findOne({ role: roles[0] })
            .then((person: any) => {
                if (person && person.role === roles[0]) {
                    const error = new myError(
                        'The admin already exists!',
                        400,
                        4,
                        'ادمین قبلا ثبت شده است!',
                        'خطا رخ داد'
                    )
                    next(error)
                } else {
                    const user = new Admin({ ...body })
                    user.save()
                    .then(() => {
                        const data = {
                            email: user.email,
                            role: user.role
                        }
                        successRes(res, 'Registration is done successfully', data)
                    })
                    .catch((err) => {
                        if (err.name = 'MongoError' && err.code === 11000) {
                            logger.error(`The save action on User Collection with document ${email} has some errors: ${err}`)
                            const error = new myError(
                                'The user has registered already!',
                                400,
                                9,
                                'شما قبلا ثبت نام کرده اید!',
                                'خطا رخ داد'
                            )
                            next(error)
                        } else {
                            logger.error(`The save action on User Collection with document ${email} has some errors: ${err}`)
                            const error = new myError(
                                'Error happened during the registration!',
                                500,
                                9,
                                'در فرآیند ثبت نام مشکلی پیش آمده است!',
                                'خطا در سرور'
                            )
                            next(error)
                        }
                    })
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/login',
    userValidationRules('body', 'email'),
    userValidationRules('body', 'password'),
    validate,
    // preventBruteForce,
    tryCatch((req, res, next) => {
        const agent = req.useragent
        Admin.findOne({ email: req.body.email })
        .then((person: any) => { 
             if (!person) {
                const error = new myError(
                    'Email or Password are not valid!',
                    400,
                    8,
                    'ایمیل یا گذرواژه معتبر نیستند!',
                    'خطا رخ داد'
                )
                next(error)
            } else if (person.isActive !== true) {
                const error = new myError(
                    'The account is not active!',
                    400,
                    18,
                    'حساب کاربری شما غیرفعال شده است!',
                    'خطا رخ داد'
                )
                next(error)
            } else {
                person.comparePasswordPromise(req.body.password)
                .then((isMatch) => {
                     if (!isMatch) {
                        logger.warn('Passwords are not match')
                        const error = new myError(
                            'Email or Password are not valid!',
                            400,
                            8,
                            'ایمیل یا گذرواژه معتبر نیستند!',
                            'خطا رخ داد'
                        )
                        next(error)
                    } else {
                        const adminActivity = {
                            action: 'LOGIN',
                            timestamp: Date.now(),
                            device: agent.source,
                            ip: req.ip
                        }
                        person.adminActivities.push(adminActivity)
                        person.save()
                        .then(() => {
                            req.session.adminId = person._id
                            const profile = {
                                name: person.name,
                                lastName: person.lastName,
                                userId: person._id,
                                role: person.role
                            }
                            successRes(res, '', profile)
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

adminRoutes.post('/changePassword',
isAdmin,
userValidationRules('body', 'password'),
userValidationRules('body', 'newPassword'),
validate,
tryCatch((req, res, next) => {
    const adminId = req.session.adminId
    Admin.findOne({ _id: adminId })
    .then((person: any) => {
         if (person && person._id.toString() === adminId) {
            person.comparePasswordPromise(req.body.password)
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
                    person.password = req.body.newPassword
                    person.save()
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
        } else {
            logger.warn('Email address is not valid!')
            const error = new myError(
                'UserId is not valid!',
                400,
                12,
                'آدرس ایمیل معتبر نیست!',
                'خطا رخ داد',
            )
            next(error)
        }
    })
    .catch((err) => {
        next(err)
    })
}))    

// This end point delete "Token" of users who want to logout from MongoDB.
adminRoutes.get('/logout', 
isAdmin, 
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

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// ADMINS ENDPOINTS   ////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////


adminRoutes.get('/getTheManager',
    isAdmin,
    userValidationRules('query', 'username'),
    validate,
    tryCatch((req, res, next) => {
        const username = req.query.username
        Admin.findOne({ $and: [{ email: username }, { role: roles[1] }] })
            .then((person: any) => {
                if (person && person.email === username) {
                    const result = {
                        _id: person._id,
                        name: person.name,
                        lastName: person.lastName,
                        email: person.email,
                        isActive: person.isActive === true ?
                            'مجوز فعالیت دارد' :
                            'مجوز فعالیت او لغو شده است',
                        role: 'مدیر',
                        adminActivities: person.adminActivities
                    }
                    successRes(res, '', result)
                } else {
                    const error = new myError(
                        'The Manager does not exist!',
                        400,
                        11,
                        'چنین مدیری وجود ندارد!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.get('/getManagersList',
    isAdmin,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person && person._id.toString() === adminId && person.role === roles[0]) {
                    Admin.find({ role: roles[1] })
                        .then((managers: any) => {
                            managers = managers.map((i) => {
                                return {
                                    lastName: i.lastName,
                                    username: i.email,
                                    isActive: i.isActive ? 
                                                'مجوز فعالیت دارد' :
                                                'مجوز فعالیت او لغو شده است'
                                }
                            })
                            successRes(res, '', managers)
                        })
                        .catch((err) => {
                            next(err)
                        })
                } else {
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد',
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/editManagers',
    isAdmin,
    userValidationRules('body', '_id'),
    userValidationRules('body', 'managerName'),
    userValidationRules('body', 'managerLastName'),
    userValidationRules('body', 'managerEmail'),
    userValidationRules('body', 'managerIsActive'),
    userValidationRules('body', 'managerRole'),
    validate,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        const managerId = req.body._id
        const body = {
            name: req.body.managerName,
            lastName: req.body.managerLastName,
            email: req.body.managerEmail,
            isActive: req.body.managerIsActive,
            role: req.body.managerRole
        }
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person.role === roles[0]) {
                    Admin.findOne({ _id: managerId })
                        .then(async (manager: any) => {
                            if (manager && manager._id.toString() === managerId) {
                                await Object.keys(body).map((element: any) => {
                                    if (body[`${element}`] || ((element === 'isActive') && (body['isActive'] === true || body['isActive'] === false))) {
                                        if (managerEditableFields.includes(element)) {
                                            manager[`${element}`] = body[`${element}`]
                                        } else {
                                            logger.warn('Some fields are not existed or valid.')
                                            const error = new myError(
                                                'Some fields are not existed or valid.',
                                                400,
                                                1,
                                                'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!',
                                                'خطا رخ داد'
                                            )
                                            throw (error)
                                        }
                                    }
                                })
                                manager.save()
                                .then(() => {
                                    const result = {
                                        _id: manager._id,
                                        name: manager.name,
                                        lastName: manager.lastName,
                                        email: manager.email,
                                        isActive: manager.isActive,
                                        role: manager.role,
                                        adminActivities: manager.adminActivities
                                    }
                                    successRes(res, 'The data is chenged successfully!', result)
                                })
                                .catch((err) => {
                                    next(err)
                                })   
                            } else {
                                logger.warn('The manager does not exist!')
                                const error = new myError(
                                    'The manager does not exist!',
                                    400,
                                    1,
                                    'چنین مدیری در سامانه ثبت نشده است!',
                                    'خطا رخ داد',
                                )
                                next(error)
                            }
                        })
                        .catch((err) => {
                            const message = err.message ? err.message : err;
                            logger.error(message)
                            next(err)
                        })
                } else {
                    logger.warn('You are not authorized to do this task!')
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد',
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/addManagers',
    isAdmin,
    userValidationRules('body', 'email'),
    userValidationRules('body', 'password'),
    userValidationRules('body', 'name'),
    userValidationRules('body', 'lastName'),
    validate,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person.role === roles[0]) {
                    const admin = new Admin({
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        lastName: req.body.lastName,
                        role: roles[1]
                    })
                    admin.save()
                    .then(() => {
                        const manager = {
                            email: admin.email,
                            name: admin.name,
                            lastName: admin.lastName,
                            role: admin.role
                        }
                        successRes(res, 'The manager is added successfully!', manager)
                    })  
                    .catch((err) => {
                        if (err.name = 'MongoError' && err.code === 11000) {
                            logger.warn(`The save action on User Collection with document ${req.body.lastName} has some errors: ${err}`)
                            const error = new myError(
                                'The user has registered already!',
                                400,
                                9,
                                'کاربر قبلا ثبت نام کرده است!',
                                'خطا رخ داد',
                            )
                            next(error)
                        } else {
                            logger.error(`The save action on User Collection with document ${req.body.lastName} has some errors: ${err}`)
                            const error = new myError(
                                'Error happened during the registration!',
                                500,
                                9,
                                'در فرآیند ثبت نام مشکلی پیش آمده است!',
                                'خطا رخ داد',
                            )
                            next(error)
                        }
                    })

                } else {
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))


adminRoutes.get('/getTheSupporter',
    userValidationRules('query', 'username'),
    validate,
    isAdmin,
    tryCatch((req, res, next) => {
        const username = req.query.username
        Admin.findOne({ $and: [{ email: username }, { role: roles[2] }] })
            .then((person: any) => {
                if (person && person.email === username) {
                    const result = {
                        _id: person._id,
                        name: person.name,
                        lastName: person.lastName,
                        email: person.email,
                        isActive: person.isActive === true ?
                            'مجوز فعالیت دارد' :
                            'مجوز فعالیت او لغو شده است',
                        role: 'پشتیبان',
                        adminActivities: person.adminActivities
                    }
                    successRes(res, '', result)
                } else {
                    const error = new myError(
                        'The supporter does not exist!',
                        400,
                        11,
                        'چنین پشتیبانی وجود ندارد!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))    

adminRoutes.get('/getSupportersList',
    isAdmin,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person && person._id.toString() === adminId && [roles[0], roles[1]].includes(person.role)) {
                    Admin.find({ role: roles[2] })
                        .then((supporters: any) => {
                            supporters = supporters.map((i) => {
                                return {
                                    lastName: i.lastName,
                                    username: i.email,
                                    isActive: i.isActive ? 
                                                'مجوز فعالیت دارد' :
                                                'مجوز فعالیت او لغو شده است'
                                }
                            })
                            successRes(res, '', supporters)
                        })
                        .catch((err) => {
                            next(err)
                        })
                } else {
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد',
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/editSupporters',
    isAdmin,
    userValidationRules('body', '_id'),
    userValidationRules('body', 'supporterName'),
    userValidationRules('body', 'supporterLastName'),
    userValidationRules('body', 'supporterEmail'),
    userValidationRules('body', 'supporterIsActive'),
    userValidationRules('body', 'supporterRole'),
    validate,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        const supporterId = req.body._id
        const body = {
            name: req.body.supporterName,
            lastName: req.body.supporterLastName,
            email: req.body.supporterEmail,
            isActive: req.body.supporterIsActive,
            role: req.body.supporterRole
        }
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person.role === roles[0] || person.role === roles[1]) {
                    Admin.findOne({ _id: supporterId })
                        .then(async (supporter: any) => {
                            if (supporter && supporter._id.toString() === supporterId) {
                                await Object.keys(body).map((element: any) => {
                                    if (body[`${element}`] || (element === 'isActive') && (body['isActive'] === true || body['isActive'] === false)) {
                                        console.log(element)
                                        if (supporterEditableFields.includes(element)) {
                                            supporter[`${element}`] = body[`${element}`]
                                        } else {
                                            logger.warn('Some fields are not existed or valid.')
                                            const error = new myError(
                                                'Some fields are not existed or valid.',
                                                400,
                                                1,
                                                'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!',
                                                'خطا رخ داد'
                                            )
                                            throw (error)
                                        }
                                    }
                                });
                                supporter.save()
                                .then(() => {
                                    const result = {
                                        _id: supporter._id,
                                        name: supporter.name,
                                        lastName: supporter.lastName,
                                        email: supporter.email,
                                        isActive: supporter.isActive,
                                        role: supporter.role,
                                        adminActivities: supporter.adminActivities
                                    }
                                    successRes(res, 'The data is chenged successfully!', result)
                                })
                                .catch((err) => {
                                    const message = err.message ? err.message : err;
                                    logger.error(message)
                                    next(err)
                                })
                            } else {
                                logger.warn('The supporter does not exist!')
                                const error = new myError(
                                    'The supporter does not exist!',
                                    400,
                                    1,
                                    'چنین پشتیبانی در سامانه ثبت نشده است!',
                                    'خطا رخ داد',
                                )
                                next(error)
                            }
                        })
                        .catch((err) => {
                            const message = err.message ? err.message : err;
                            logger.error(message)
                            next(err)
                        })
                } else {
                    logger.warn('You are not authorized to do this task!')
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/addSupporters',
    isAdmin,
    userValidationRules('body', 'email'),
    userValidationRules('body', 'password'),
    userValidationRules('body', 'name'),
    userValidationRules('body', 'lastName'),
    validate,
    tryCatch((req, res, next) => {
        const adminId = req.session.adminId
        Admin.findOne({ _id: adminId })
            .then((person: any) => {
                if (person.role === roles[0] || person.role === roles[1]) {
                    const admin = new Admin({
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        lastName: req.body.lastName,
                        role: roles[2]
                    })
                    admin.save()
                    .then(() => {
                        const supporter = {
                            email: admin.email,
                            name: admin.name,
                            lastName: admin.lastName,
                            role: admin.role
                        }
                        successRes(res, 'The manager is added successfully!', supporter)
                    })
                    .catch((err) => {
                        if (err.name = 'MongoError' && err.code === 11000) {
                            logger.warn(`The save action on User Collection with document ${req.body.lastName} has some errors: ${err}`)
                            const error = new myError(
                                'The user has registered already!',
                                400,
                                9,
                                'کاربر قبلا ثبت نام کرده است!',
                                'خطا رخ داد',
                            )
                            next(error)
                        } else {
                            logger.error(`The save action on User Collection with document ${req.body.lastName} has some errors: ${err}`)
                            const error = new myError(
                                'Error happened during the registration!',
                                500,
                                9,
                                'در فرآیند ثبت نام مشکلی پیش آمده است!',
                                'خطا رخ داد',
                            )
                            next(error)
                        }
                    })
                } else {
                    const error = new myError(
                        'You are not authorized to do this task!',
                        400,
                        1,
                        'شما مجاز به انجام چنین کاری نیستید!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))

adminRoutes.post('/editUserProfile',
    isAdmin,
    userValidationRules('body', '_id'),
    userValidationRules('body', 'userIsActive'),
    userValidationRules('body', 'userUserType'),
    validate,
    tryCatch((req, res, next) => {
        console.log(req.body)
        const userId = req.body._id
        const adminId = req.session.adminId
        const body = {
            isActive: req.body.userIsActive,
            userType: req.body.userUserType
        }
        User.findOne({ _id: userId })
            .then((user) => {
                if (user && user._id.toString() === userId) {
                    Admin.findOne({ _id: adminId })
                    .then(async (person: any) => {
                        if (person && person._id.toString() === adminId) {
                            await Object.keys(body).map((element: any) => {
                                if (body[`${element}`] || (element === 'isActive') && (body['isActive'] === true || body['isActive'] === false)) {
                                    if (userEditableFields.includes(element)) {
                                        if (element === 'userType' && body[`${element}`] === 'Vip') {
                                            if (person.role === roles[0]) {
                                                user[`${element}`] = body[`${element}`]
                                            } else {
                                                const error = new myError(
                                                    'You are not authorized to do this task!',
                                                    400,
                                                    1,
                                                    'شما مجاز به انجام چنین کاری نیستید!',
                                                    'خطا رخ داد',
                                                )
                                                throw(error)
                                            }
                                        } else {
                                            if ([roles[0], roles[1]].includes(person.role)) {
                                                user[`${element}`] = body[`${element}`]
                                            } else {
                                                const error = new myError(
                                                    'You are not authorized to do this task!',
                                                    400,
                                                    1,
                                                    'شما مجاز به انجام چنین کاری نیستید!',
                                                    'خطا رخ داد',
                                                )
                                                throw(error)
                                            }
                                        }  
                                    } else {
                                        logger.warn('Some fields are not existed or valid.')
                                        const error = new myError(
                                            'Some fields are not existed or valid.',
                                            400,
                                            1,
                                            'برخی از فیلدهای درخواستی ناموجود یا نامعنبر است!',
                                            'خطا رخ داد'
                                        )
                                        throw (error)
                                    }
                                }
                            })
                            user.save()
                            .then(() => {
                                const result = {
                                    _id: user._id,
                                    isActive: user.isActive,
                                    userType: user.userType,
                                    name: user.name,
                                    lastName: user.lastName,
                                    email: user.email,
                                    phoneNumber: user.phoneNumber
                                }
                                successRes(res, 'The user is changed successfully!', result)
                            })
                            .catch((err) => {
                                const message = err.message ? err.message : err;
                                logger.error(message)
                                next(err)
                            })
                        } else {
                            logger.warn('The admin does not exist!')
                            const error = new myError(
                                'The admin does not exist!',
                                400,
                                1,
                                'چنین ادمینی در سامانه ثبت نشده است!',
                                'خطا رخ داد'
                            )
                            next(error)
                        }
                    })
                    .catch((err) => {
                        next(err)
                    })
                } else {
                    logger.warn('The user does not exist!')
                    const error = new myError(
                        'The user does not exist!',
                        400,
                        1,
                        'چنین کاربری در سامانه ثبت نشده است!',
                        'خطا رخ داد'
                    )
                    next(error)
                }
            })
            .catch((err) => {
                next(err)
            })
    }))


