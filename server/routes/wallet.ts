import * as express from 'express';
import retry from 'async-retry';
import * as _ from 'lodash'
import * as mongoose from 'mongoose'
import * as uuidv4 from 'uuid4'

import { User } from '../db/user'
import { Admin } from '../db/admin'
import { GetPrice } from '../db/getPrice';
import { Accepted_Offers } from '../db/acceptedOffers'
import { Active_Offers } from '../db/activeOffers'

import { userValidationRules, validate } from '../middlewares/validation'
import tryCatch from '../middlewares/tryCatch'
import { rateLimiterMiddleware } from '../middlewares/preventBruteForce'
import { isAuthorized } from '../middlewares/auth'
import successRes from '../middlewares/response'

import * as redis from '../api/redis'
import myError from '../api/myError'
import { logger } from '../api/logger'
import { suggestOffers } from '../api/suggestOffers'

import * as etheriumWallet from '../api/walletApi/etheriuem'

import { transferFromExchangeApi } from '../api/walletApi/transferFromExchange'
import { transferToExchangeApi } from '../api/walletApi/transferToExchange'
import { transferToExchangeByIdApi } from '../api/walletApi/transferToExchangeById'

export const walletRoutes = express.Router()

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

walletRoutes.get('/getEtheriumNonce', 
isAuthorized,
userValidationRules('query', 'etheriumAccountAddress'),
validate,
tryCatch((req, res, next) => {
    const etheriumAccountAddress = req.query.etheriumAccountAddress
   etheriumWallet.getEtheriumNonce(etheriumAccountAddress)
   .then((result)=>{
    successRes(res, 'Getting nonce completed successfully', Number(result), {})
   })
   .catch((err)=>{
       next(err)
   })             
}))

walletRoutes.post('/buyCurrency',
    isAuthorized,
    userValidationRules('body', 'currency'),
    validate,
    tryCatch(async (req, res, next) => {        
        const userId = req.session.userId
        const currency = req.body.currency
        const quantity = req.body.quantity
        let price
        GetPrice.findOne({ $and: [{ currency: currency }, { userId: userId } ] })
        .then(async (priceObj) => {
            if(priceObj && priceObj.currency.toString() === currency.toString()&& priceObj.userId.toString() === userId.toString()) {
                const curRialPrice = await redis.getCurrentPrice(currency)
                if (curRialPrice > priceObj.rialPricePerUnit) {
                    price = priceObj.rialPricePerUnit
                } else {
                    price = curRialPrice
                }
                redis.hashGetAll("RIAL")
                .then(async(rialObject: any) => {
                    if(Boolean(process.env.BUYFROMOFFERS)) {                              
                        let errorCounter = 5;
                        retry(async bail => {
                            const session  = await mongoose.startSession()
                            let offerIds = []
                            const suggestedOffers = await suggestOffers({ userId, price: priceObj.rialPricePerUnit, capacity: quantity, offerType: 'buy', currencyId: currency, rialId: rialObject.id })
                            if(suggestedOffers && Array.isArray(suggestedOffers.subset)) {
                                offerIds = await suggestedOffers.subset.map((e) => {
                                    return e.id
                                })
                            } else {
                                throw 'No suggested offers!'
                            }
                            return session.withTransaction(async() => { 
                                return Active_Offers.find({ offerId: { $in: offerIds } }).session(session)
                                .then((offers) => {
                                    if(offers.length !== offerIds.length) {
                                        const error = new myError (

                                        );
                                        throw error
                                    } else {
                                        return User.findOne({ _id : userId }).session(session)
                                        .then(async (buyerUser: any) => {
                                            return  Admin.findOne({}).session(session)
                                            .then(async (admin: any) => {
                                                let givenObjInBuyer = _.find(buyerUser.wallet, (e) => e.currency.toString() === priceObj.currency.toString())
                                                let takenObjInBuyer = _.find(buyerUser.wallet, (e) => e.currency.toString() === rialObject.id.toString())
                                                if(!givenObjInBuyer) {
                                                    const givenCurrencyValueObject = {
                                                    currency : priceObj.currency,
                                                    value : 0
                                                        }
                                                    buyerUser.wallet.push(givenCurrencyValueObject)
                                                    givenObjInBuyer = givenCurrencyValueObject
                                                }
                                                    const orderAcceptor = offers.map((individualOffer) => {
                                                    const  buyOrderId = uuidv4()
                                                    const sellerId = individualOffer.userId
                                                    return User.findOne({ _id : sellerId }).session(session)
                                                    .then(async (creator: any) => {
                                                        if(creator && creator._id.toString() === sellerId.toString()) {
                                                            let givenObjInCreWal = _.find(creator.wallet, (e) => e.currency.toString() === individualOffer.curGivenId.toString())
                                                            if(givenObjInCreWal) {
                                                                givenObjInCreWal.commitment -= Number(individualOffer.curGivenVal)
                                                                let takenObjInCreWal = _.find(creator.wallet, (i) => i.currency.toString() === individualOffer.curTakenId.toString())
                                                                if(takenObjInCreWal) {
                                                                    takenObjInCreWal.value += individualOffer.curTakenVal
                                                                } else {
                                                                    const currencyObj = {
                                                                        currency : individualOffer.curTakenId,
                                                                        value : individualOffer.curTakenVal
                                                                    }
                                                                    creator.wallet.push(currencyObj) 
                                                                    takenObjInCreWal = currencyObj
                                                                }
                                                                takenObjInBuyer.value -= individualOffer.curTakenVal
                                                                givenObjInBuyer.value += individualOffer.curGivenVal                                                   
                                                                const bodyAccOffer = {
                                                                    acceptor : admin._id,
                                                                    creator: sellerId,
                                                                    offerId: individualOffer.offerId,
                                                                    curGivenId: individualOffer.curGivenId,
                                                                    curGivenVal: individualOffer.curGivenVal,
                                                                    curTakenId: individualOffer.curTakenId,
                                                                    curTakenVal: individualOffer.curTakenVal,
                                                                    offeredDate: individualOffer.created_at,
                                                                    expiredDate : individualOffer.expDate,
                                                                    buyOrderId
                                                                }
                                                                
                                                                await creator.save()                                                                      
                                                                await Accepted_Offers.create([bodyAccOffer], { session })
                                                            } else {
                                                                const error = new myError(
                                                                    'creator wallet does not have given object', 
                                                                    400, 
                                                                    5, 
                                                                    'در کیف پول فرشنده ارز مورد نظر پیدا نشد', 
                                                                    'خطا رخ داد'
                                                                    )
                                                                throw(error) 
                                                            }
                                                        } else {
                                                            const error = new myError(
                                                                'failed to accept an offer', 
                                                                400, 
                                                                5, 
                                                                'موفق به پذیرش یک آفر نشدیم', 
                                                                'خطا رخ داد'
                                                                )
                                                            throw(error) 
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        throw(err)
                                                    })      
                                                })         
                                                return Promise.all(orderAcceptor)
                                                .then(async() => {
                                                    //  buyerUser.password = undefined
                                                    await buyerUser.save()
                                                })
                                                .catch((err)=>{
                                                    throw(err)
                                                })
                                            }).catch((err)=>{
                                                throw(err)
                                            })   
                                        })
                                        .catch((err) => {
                                            throw(err)
                                        }) 
                                    }
                                }) 
                                .catch((err) => {
                                    throw (err)
                                })                                  
                            })
                            .then(() => {
                                successRes(res, 'Buying process finished successfully', true, {})
                            })
                            .catch((err) => {
                                errorCounter--
                                if(errorCounter==0) {
                                    next(err)
                                } else {
                                    throw(err)
                                } 
                            })
                            .finally(() => {
                                session.endSession()
                            })
                        },  {  
                                maxTimeout: 5000,
                                retries: 5
                            }
                        )
                    } else {
                        const session  = await mongoose.startSession()
                        session.withTransaction(async() => {
                            return User.findOne({ _id : userId }).session(session)
                            .then(async (user: any) => {
                                let rialWalInUser = _.find(user.wallet, (i) => { return i.currency.toString() === rialObject.id.toString() })
                                if(rialWalInUser.value >= priceObj.rialPrice) {
                                    return  Admin.findOne({}).session(session)
                                    .then(async (admin: any) => {
                                    let rialWalInAdmin = _.find(admin.wallet, (i) => { return i.currency.toString() === rialObject.id.toString() })
                                    let curWalInUser = _.find(user.wallet, (i) => { return i.currency.toString() === currency.toString() })
                                    let curWalInAdmin = _.find(admin.wallet, (i) => { return i.currency.toString() === currency.toString() })
                                    if(curWalInUser ) {
                                        curWalInUser.value += Number(priceObj.quantity)
                                        curWalInAdmin.value -= Number(priceObj.quantity)
                                        rialWalInUser.value -= Number(priceObj.rialPrice)
                                        rialWalInAdmin.value += Number(priceObj.rialPrice)
                                        await admin.save()
                                        await user.save()
                                        await priceObj.remove()
                                    } else {
                                        const bodyCurrency = {
                                            currency : currency,
                                            value : priceObj.quantity,
                                            commitment : 0
                                        }
                                        user.wallet.push(bodyCurrency)
                                        rialWalInUser.value -= priceObj.rialPrice
                                        rialWalInAdmin.value += priceObj.rialPrice
                                        curWalInAdmin.value -=priceObj.quantity
                                        await admin.save()
                                        await user.save()
                                        await priceObj.remove()                                    
                                    }
                                })
                                .catch((err) => {
                                    throw err
                                })
                                    
                                } else {
                                    const error = new myError(
                                        'User does not have enough rial credit in his/her wallet.', 
                                        400, 
                                        5, 
                                        'کاربر ارز ریالی کافی برای خرید را ندارد.',
                                        'خطا رخ داد'
                                        )
                                    throw(error) 
                                }
                            })
                            .catch((err) => {
                                throw(err)
                            })
                        })
                        .then(() => {
                            successRes(res, 'Buying process finished successfully', true, {})

                        })
                        .catch((err) => {
                            next(err)
                        })
                        .finally(() => {
                            session.endSession()
                        }) 
                    }
                })
                .catch((err) => {
                    next(err)
                })
            } else {
                //there is no price in GetPrice
                const error = new myError(
                    'There is no price in GetPrice', 
                    400, 
                    5, 
                    'قیمت معادل ریالی پیدا نشد.',
                    'خطا رخ داد'
                    )
                next(error) 
            }
        })
        .catch((err) => {
            next(err)
        })
    })
)

walletRoutes.post('/sellCurrency',
    isAuthorized,
    userValidationRules('body', 'currency'),
    validate,
    tryCatch(async (req, res, next) => {        
        const userId = req.session.userId
        const currency = req.body.currency
        const quantity = req.body.quantity
        GetPrice.findOne({ $and: [{ currency: currency }, { userId: userId }] })
        .then((priceObj) => {
            if(priceObj && priceObj.currency.toString() === currency.toString() && priceObj.userId.toString() === userId.toString()) {
                redis.hashGetAll("RIAL")
                .then(async(rialObject: any) => {
                    if(Boolean(process.env.BUYFROMOFFERS)) {
                        let errorCounter = 5;
                        retry(async bail => {
                            const session  = await mongoose.startSession()
                            let offerIds = []
                            const suggestedOffers = await suggestOffers({ userId, price: priceObj.rialPricePerUnit, capacity: quantity, offerType: 'buy', currencyId: currency, rialId: rialObject.id })
                            if(suggestedOffers && Array.isArray(suggestedOffers.subset)) {
                                offerIds = await suggestedOffers.subset.map((e) => {
                                    return e.id
                                })
                            } else {
                                throw 'No suggested offers!'
                            }
                            return session.withTransaction(async() => { 
                                return Active_Offers.find({}).session(session)
                                .then((offers) => {
                                    if(offers.length==offerIds.length){
                                        console.log("testing")
                                    } else {
                                        return User.findOne({ _id : userId }).session(session)
                                        .then(async (buyerUser: any) => {
                                            return  Admin.findOne({}).session(session)
                                            .then(async (admin: any) => {
                                            let givenObjInBuyer = _.find(buyerUser.wallet, (e) => e.currency.toString() === priceObj.currency.toString())
                                            let takenObjInBuyer = _.find(buyerUser.wallet, (e) => e.currency.toString() === rialObject.id.toString())
                                            if(!takenObjInBuyer) {
                                                const takenCurrencyValueObject = {
                                                currency : rialObject.id,
                                                value : 0
                                                    }
                                                buyerUser.wallet.push(takenCurrencyValueObject)
                                                takenObjInBuyer = takenCurrencyValueObject
                                            }
                                            const orderAcceptor = offers.map((individualOffer) => {
                                                const  buyOrderId = uuidv4()
                                                const sellerId = individualOffer.userId
                                                return User.findOne({_id : sellerId}).session(session)
                                                .then(async (creator: any) => {
                                                    if(creator && creator._id.toString() === sellerId.toString()) {
                                                        let givenObjInCreWal = _.find(creator.wallet, (e) => e.currency.toString() === individualOffer.curGivenId.toString())
                                                        if(givenObjInCreWal) {
                                                            // take from creator and give to buyer
                                                            givenObjInCreWal.commitment -= Number(individualOffer.curGivenVal)
                                                            let takenObjInCreWal = _.find(creator.wallet, (i) => i.currency.toString() === individualOffer.curTakenId.toString())
                                                            if(takenObjInCreWal) {
                                                                takenObjInCreWal.value += individualOffer.curTakenVal
                                                            } else {
                                                                const currencyObj = {
                                                                    currency : individualOffer.curTakenId,
                                                                    value : individualOffer.curTakenVal
                                                                }
                                                            creator.wallet.push(currencyObj) 
                                                                takenObjInCreWal = currencyObj
                                                        
                                                            }
                                                            takenObjInBuyer.value -= individualOffer.curTakenVal
                                                            givenObjInBuyer.value += individualOffer.curGivenVal
                                                            
                                                            const bodyAccOffer = {
                                                                acceptor : admin._id,
                                                                creator: sellerId,
                                                                offerId: individualOffer.offerId,
                                                                curGivenId: individualOffer.curGivenId,
                                                                curGivenVal: individualOffer.curGivenVal,
                                                                curTakenId: individualOffer.curTakenId,
                                                                curTakenVal: individualOffer.curTakenVal,
                                                                offeredDate: individualOffer.created_at,
                                                                expiredDate : individualOffer.expDate,
                                                                buyOrderId
                                                            }                                                                        
                                                            await creator.save()                                                                      
                                                            await Accepted_Offers.create([bodyAccOffer], { session }).catch((err)=>{
                                                                throw (err)
                                                            })
                                                        } else {
                                                            const error = new myError(
                                                                'creator wallet does not have given object', 
                                                                400, 
                                                                5, 
                                                                'در کیف پول فرشنده ارز مورد نظر پیدا نشد', 
                                                                'خطا رخ داد'
                                                                )
                                                            throw(error) 
                                                        }
                                                    }
                                                    else {
                                                        const error = new myError(
                                                            'failed to accept an offer', 
                                                            400, 
                                                            5, 
                                                            'موفق به پذیرش یک آفر نشدیم', 
                                                            'خطا رخ داد'
                                                            )
                                                        throw(error) 
                                                    }
                                                })
                                                .catch((err) => {
                                                    throw(err)
                                                })
                                            }) 
                                            return  Promise.all(orderAcceptor)
                                                .then(async()=> {
                                                    await  buyerUser.save()
                                                })
                                                .catch((err) => {
                                                    throw(err)
                                                })
                                            })
                                            .catch((err)=>{
                                                throw(err)
                                            })
                                        })
                                        .catch((err) => {
                                            throw(err)
                                        })
                                    }
                                }) 
                                .catch((err) => {
                                    throw (err)
                                })
                            })
                            .then(() => {
                                successRes(res, 'Buying process finished successfully', true, {})
                            })
                            .catch((err) => {
                                errorCounter--
                                if(errorCounter==0){
                                    next(err)
                                } else {
                                    throw(err)
                                } 
                            })
                            .finally(() => {
                                session.endSession()
                            })
                        }, {  
                                maxTimeout: 5000,
                                retries: 5
                            }
                        )  
                    } else {
                        const session  = await mongoose.startSession()
                        session.withTransaction(async() => {
                            return User.findOne({ _id : userId }).session(session)
                            .then(async (user: any) => {
                                let currencyWalInUser = _.find(user.wallet, (i) => { return i.currency.toString() === priceObj.currency.toString() })
                                if(currencyWalInUser.value >= priceObj.quantity){
                                return  Admin.findOne({}).session(session)
                                    .then(async (admin: any) => {
                                        let rialWalInAdmin = _.find(admin.wallet, (i) => { return i.currency.toString() === rialObject.id.toString() })
                                        let curWalInUser = _.find(user.wallet, (i) => { return i.currency.toString() === currency.toString() })
                                        let rialWalInUser = _.find(user.wallet, (i) => { return i.currency.toString() === rialObject.id.toString() })
                                        let curWalInAdmin = _.find(admin.wallet, (i) => { return i.currency.toString() === currency.toString() })
                                        if(rialWalInUser ) {
                                            rialWalInUser.value += Number(priceObj.rialPrice)
                                            curWalInUser.value -= Number(priceObj.quantity)
                                            curWalInAdmin.value += Number(priceObj.quantity)  
                                            rialWalInAdmin.value -= Number(priceObj.rialPrice)
                                            await admin.save()
                                            await user.save()
                                            await priceObj.remove()
                                        } else {
                                            const bodyCurrency = {
                                                currency : currency,
                                                value : priceObj.quantity,
                                                commitment : 0
                                            }
                                            user.wallet.push(bodyCurrency)
                                            rialWalInUser.value -= priceObj.rialPrice
                                            rialWalInAdmin.value += priceObj.rialPrice
                                            curWalInAdmin.value -=priceObj.quantity
                                            await admin.save()
                                            await user.save()
                                            await priceObj.remove()                                  
                                    }
                                })
                                } else {
                                    const error = new myError(
                                        'User does not have enough rial credit in his/her wallet.', 
                                        400, 
                                        5, 
                                        'کاربر ارز ریالی کافی برای خرید را ندارد.',
                                        'خطا رخ داد'
                                        )
                                    throw(error) 
                                }
                            })
                            .catch((err) => {
                                throw(err)
                            })
                        }) 
                        .then(() => {
                            successRes(res, 'Buying process finished successfully', true, {})
                        })
                        .catch((err) => {
                            next(err)
                        })
                        .finally(() => {
                            session.endSession()
                        })   
                    }
                })
                .catch((err)=>{
                    next(err)
                })
            } else {
            const error = new myError(
                'There is no price in GetPrice', 
                400, 
                5, 
                'قیمت معادل ریالی پیدا نشد.',
                'خطا رخ داد'
                )
            next(error) 
            }
        })
        .catch((err) => {
            next(err)
        })
    })
)


walletRoutes.post('/transferFromExchange', 
isAuthorized,
tryCatch((req, res, next) => {
    const value = req.body.value
    const currencyId = req.body.currencyId
    const receiver  = req.body.receiver
    const userId = req.session.userId
    transferFromExchangeApi(currencyId, value, receiver, userId)
    .then((data) => {
        successRes(res,"transaction completed please wait",data.txHash)
      
    })
    .catch((err)=>{
        next(err)
    })
}))

walletRoutes.post('/transferToExchange', 
tryCatch((req, res, next) => {
    const signedRawTxHex = req.body.tx
    const currencyId = req.body.currencyId
    const userId = req.session.userId
    const value = req.body.value
    User.findOne({ _id : userId })
    .then((user) => {
        if(user) {
            let cur = _.find(user.wallet, (i) => { return i.currency.toString() === currencyId.toString() })
            if(cur) {
                //invoke transferToExchangeApi
            } else{ 
                const error = new myError(
                    'currency not found in user wallet', 
                    400, 
                    5, 
                    'ارز مربوطه در کیف پول کاربر پیدا نشد.', 
                    'خطا رخ داد'
                    )
                next(error)
            }
        } else {
            const error = new myError(
                'user not found', 
                400, 
                5, 
                'کاربر پیدا نشد.', 
                'خطا رخ داد'
                )
            next(error) 
        } 
    })
    .catch((err)=>{
        next(err)
    })
}))

walletRoutes.post('/transferToExchangeById', 
isAuthorized,
tryCatch((req, res, next) => {
    const txId = req.body.txId
    const currencyId = req.body.currencyId
    const userId = req.session.userId 
    transferToExchangeByIdApi(currencyId,txId,userId)
    .then((txInf: any)=>{
        if(txInf.status === "successful") {
            successRes(res,"you have the currency")
        } else if(txInf.status === "pending") {
            successRes(res,"please wait")
        }             
    })
    .catch((err)=>{
        next(err)
    })
}))
