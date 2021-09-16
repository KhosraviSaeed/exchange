import * as express from 'express';
import * as _ from 'lodash'
import { ObjectID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose'

import successRes from '../middlewares/response'
import { isAuthorized } from '../middlewares/auth'
import { isEmailValid, isValidMobilePhone, userValidationRules, validate } from '../middlewares/validation'
import tryCatch from '../middlewares/tryCatch'
import { rateLimiterMiddleware } from '../middlewares/preventBruteForce'

import { User } from '../db/user'
import { Currencies } from '../db/currencies'
import myError from '../api/myError'
import { Accepted_Offers } from '../db/acceptedOffers';
import { Active_Offers } from '../db/ActiveOffers';
import { Withdraw_Offers } from '../db/withdrawOffers';
import { GetPrice } from '../db/getPrice';

import { logger } from '../api/logger'
import * as redis from '../api/redis'
import { getonlineLoginUsers } from '../api/socket'
const onlineLoginUsers = getonlineLoginUsers()

export const userRoutes = express.Router()

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

userRoutes.get('/getUserWallet', 
isAuthorized,
tryCatch((req, res, next) => {
    const userId = req.session.userId
    let rialPrice
    return redis.hashget("dollarPrice")
    .then((rial: number) => {
        rialPrice = Number(rial/10)
        User.findOne({ _id : userId })
        .then((user: any) => {
            if(user && user._id.toString() === userId.toString()) {
                let walletArray = []
                const userWallet = user.wallet
                let totalAsstetsPrice =0
                let totalAsstetsPriceRial =0
                let status= true
                const walletMap = userWallet.map((wall) => {
                    return redis.hashGetAll(wall.currency.toString())
                    .then((wallCurr: any) => {
                        if (wallCurr) {
                            let tempWalletArray = {
                                currencyName: wallCurr.currencyName,
                                persianName: wallCurr.per_name,
                                shortName: wallCurr.ab_name,
                                icon: wallCurr.icon,
                                _id: wall.currency.toString(),
                                value: wall.value,
                                commitment: wall.commitment,
                                totalPrice:  0,
                                totalRialPrice: 0
                            }
                            return redis.hashGetAll(wallCurr.ab_name+'-g')
                            .then((rate: any) => {
                                if(rate) { 
                                    tempWalletArray.totalPrice = wall.value * Number(rate.current)
                                    totalAsstetsPrice += tempWalletArray.totalPrice
                                    if(rialPrice) {
                                        tempWalletArray.totalRialPrice = Math.ceil(Number(tempWalletArray.totalPrice ) * rialPrice)
                                        walletArray.push(tempWalletArray)        
                                    } else {  
                                        walletArray["totalRialPrice"] = -1
                                        walletArray.push(tempWalletArray)
                                    }
                                } else {
                                    status = false
                                    tempWalletArray['totalPrice'] = -1
                                    walletArray.push(tempWalletArray)
                                }                            
                            })
                            .catch((err) => {
                                throw (err)
                            })
                        } else {
                            const error = new myError(
                                'currency not found!', 
                                400, 
                                5, 
                                'ارز پیدا نشد.!', 
                                'خطا رخ داد'
                                )
                            next(error) 
                        }                    
                    })
                    .catch((err) => {
                        throw(err)
                    })
                })
                Promise.all(walletMap)
                .then(() => {
                    successRes(res, 'user wallet data:', walletArray)
                })
                .catch((err) =>{
                    next(err)
                })
            } else {
                const error = new myError(
                    'user not found!', 
                    400, 
                    5, 
                    'کاربر مربوطه پیدا نشد!', 
                    'خطا رخ داد'
                    )
                next(error) 
            }
        })
        .catch((err)=>{
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
}))

userRoutes.get('/getUserAcceptedOffers', 
isAuthorized,
userValidationRules('query', 'kind'),
validate,
tryCatch((req, res, next) => {
    const kind = req.query.kind
    const userId = req.session.userId
    let query = {}
    if(kind === "1") {
        query = { creator: userId }
    } else if(kind === "2") {
        query = { acceptor: userId }
    }
    Accepted_Offers.find(query)
    .then((offers) => {
        if(offers && Array.isArray(offers) && offers.length > 0) {
            let dataArray = []
            Currencies.find()
            .then((curs) => {
                offers.forEach(off => {
                    const givenCur = _.find(curs, (i) => { return i._id.toString()=== off.curGivenId.toString()})
                    const takenCur = _.find(curs, (i) => { return i._id.toString()=== off.curTakenId.toString()})    
                    if(givenCur && takenCur ){
                        dataArray.push({
                            giveCurname: givenCur.currencyName,
                            //giveCurValue: off.curGivenVal,
                            //givenCurPersianName: givenCur.per_name,
                            //givenCurShortName: givenCur.ab_name,
                            //givenCurIcon: givenCur.icon,
                            takenCurname: takenCur.currencyName,
                            //takenCurValue: off.curTakenVal,
                            //takenCurpersianName: takenCur.per_name,
                            //takenCurShortName: takenCur.ab_name,
                            //takenCurIcon: takenCur.icon,
                            //createDate: off.offeredDate,
                            acceptedDate: off.created_at,
                        })
                    } else { 
                        return
                    }
                })
                const orderedDataArray = _.orderBy(dataArray,({acceptedDate}) => acceptedDate, ['asc'])
                successRes(res, 'fdasdf', orderedDataArray)
            })
            .catch((err) =>{
                next(err)
            })
        } else {
            const error = new myError(
                'there is no offer', 
                400, 
                5, 
                'سفارشی یافت نشد.!', 
                'خطا رخ داد'
                )
            next(error)
        }
    })
    .catch((err) => {
        next(err)
    })
 }))

userRoutes.get('/getUserActiveOffers', 
isAuthorized,
tryCatch(async (req, res, next) => {
    console.log(req.session)
    const userId = req.session.userId
    const curId = req.query.curIdOp
    let query = []
    let rialObj
    query.push.apply(query, [{ userId : userId }, { expDate: { $gt: Date.now() } }])
    if(ObjectID.isValid(curId)) {
        await Currencies.findOne({ name: 'RIAL' })
        .then((rial: any) => {
            if (rial && rial.name === 'RIAL') {
                rialObj = rial
                query.push({ $or: [ 
                    { $and: [{ curGivenId: curId }, { curTakenId: rial._id } ] },
                    { $and: [{ curTakenId: curId }, { curGivenId: rial._id } ] }
                ] })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    Active_Offers.find({ $and: query })
    .then((offers) => {
        if(offers && Array.isArray(offers) && offers.length > 0) {
            let dataArray = []
            if (ObjectID.isValid(curId)) {
                redis.hashGetAll(curId.toString())
                .then((curObj: any) => {
                    const offersMap = offers.map((offer) => {
                        if (offer.curTakenId.toString() === rialObj._id.toString()) {
                            dataArray.push({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: offer.curGivenVal,
                                Gicon: curObj.icon,
                                TcurrencyName: rialObj.currencyName,
                                TpersianName: rialObj.per_name,
                                TshortName: rialObj.ab_name,
                                Tvalue: offer.curTakenVal,
                                Ticon: rialObj.icon,
                                txType: 'sell',
                                createDate : offer.created_at,
                                expireDate : offer.expDate,
                                offerId: offer.offerId
                            })
                        } else {
                            dataArray.push({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: offer.curTakenVal,
                                Gicon: curObj.icon,
                                TcurrencyName: rialObj.currencyName,
                                TpersianName: rialObj.per_name,
                                TshortName: rialObj.ab_name,
                                Tvalue: offer.curGivenVal,
                                Ticon: rialObj.icon,
                                txType: 'buy',
                                createDate : offer.created_at,
                                expireDate : offer.expDate,
                                offerId: offer.offerId
                            })
                        }
                    })
                    Promise.all(offersMap)
                    .then(() => {
                        const orderedDataArray = _.orderBy(dataArray,({createDate}) => createDate, ['desc'])
                        successRes(res, 'fdasdf', orderedDataArray)
                    })
                    .catch((err) => {
                        next(err) 
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
                Currencies.find()
                .then((curs) => {
                   offers.forEach(off => {
                        const givenCur = _.find(curs, (i) => { return i._id.toString()=== off.curGivenId.toString()})
                        const takenCur = _.find(curs, (i) => { return i._id.toString()=== off.curTakenId.toString()})    
                        if(givenCur && takenCur) {
                            dataArray.push ({
                            //giveCurValue :off.curGivenVal,
                            giveCurname : givenCur.currencyName,
                            //givenCurPersianName : givenCur.per_name,
                            //givenCurShortName : givenCur.ab_name,
                            //givenCurIcon : givenCur.icon,
                            takenCurname : takenCur.currencyName,
                            //takenCurValue : off.curTakenVal,
                            //takenCurpersianName: takenCur.per_name,
                            //takenCurShortName : takenCur.ab_name,
                            //takenCurIcon : takenCur.icon,
                            createDate :off.created_at,
                            expireDate :off.expiredDate,
                            })
                        } else {
                            return
                        }
                    })
                    const orderedDataArray = _.orderBy(dataArray,({createDate}) => createDate, ['desc'])
                    successRes(res, 'fdasdf', orderedDataArray)
                })
                .catch((err) => {
                    next(err)
                })
            }
        } else {
            successRes(res, 'fdasdf', [])
        }
    })
    .catch((err) =>{
        next(err)
    })
 }))

userRoutes.get('/getUserWithdrawnOffers', 
isAuthorized,
tryCatch((req, res, next) => {
    const userId = req.session.userId
    Withdraw_Offers.findOne({ userId: userId })
    .then((theDoc) => {
        if(theDoc && theDoc.userId.toString() === userId) {
            if (theDoc.offers && Array.isArray(theDoc.offers) && theDoc.offers.length > 0) {
                const modifiedOffers = _.orderBy(theDoc.offers, ['created_at', ['desc']])
                successRes(res, '', modifiedOffers)
            } else {
                const error = new myError(
                    'the user does not have any withdrawnOffers',
                    400,
                    44,
                    'کاربر هیچ پیشنهاد بازپسگیری شده ندارد.',
                    'خطا رخ داد'
                )
                next(error)
            }
        } else {
            const error = new myError(
                'the user does not have any withdrawnOffers',
                400,
                44,
                'کاربر هیچ پیشنهاد بازپسگیری شده ندارد.',
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

userRoutes.get('/getOfferById', 
isAuthorized,
userValidationRules('query', 'type'),
userValidationRules('query', 'offerId'),
validate,
tryCatch((req, res, next) => {
    const userId = req.session.userId
    const offerId = req.query.offerId
    const type = req.query.type
    let data 
    Currencies.find()
    .then((currecies) => {
        if (type === "1") {
            Active_Offers.findOne({ $and: [ { offerId: offerId }, { expDate: { $gt: Date.now() } }] })
            .then((theOffer => {
                if(theOffer && theOffer.offerId === offerId) {
                    if(theOffer.userId.toString() === userId) {
                        const givenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curGivenId.toString()})
                        const takenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curTakenId.toString()})
                        data = {
                            givenCurName:givenCur.name,
                            takenCurName:takenCur.name,
                            offerCreatedDate:theOffer.created_at,
                            offerExpireDate:theOffer.expDate
                        }
                        successRes(res, '', data)
                    } else {
                        const error = new myError(
                            'you do not have pemissions', 
                            400, 
                            5, 
                            'شما دسترسی ندارید!', 
                            'خطا رخ داد'
                            )
                        next(error)
                    }
                } else {
                    const error = new myError(
                        'there is no oofer with given offerId in Acive offers', 
                        400, 
                        5, 
                        'پیشنهاد یافت نشد!', 
                        'خطا رخ داد'
                        )
                    next(error)
                } 
            }))
            .catch((err) => {
                next(err)
            }) 
        } else if(type === "2") {
            Accepted_Offers.findOne({ offerId:offerId })
            .then((theOffer => {
                if(theOffer && theOffer.offerId === offerId) {
                    if(theOffer.acceptor.toString() === userId || theOffer.creator.toString() === userId) {
                        const givenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curGivenId.toString()})
                        const takenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curTakenId.toString()})
                        data = {
                            givenCurName:givenCur.name,
                            takenCurName:takenCur.name,
                            offerCreatedDate : theOffer.created_at,
                            offerAcceptedDate:theOffer.acceptedDate
                        }
                        successRes(res, '', data)
                    } else {
                        const error = new myError(
                            'you do not have pemissions', 
                            400, 
                            5, 
                            'شما دسترسی ندارید!', 
                            'خطا رخ داد'
                            )
                        next(error)
                    }
                } else {
                    const error = new myError(
                        'there is no oofer with given offerId in Accepted offers', 
                        400, 
                        5, 
                        'پیشنهاد یافت نشد!', 
                        'خطا رخ داد'
                        )
                    next(error)
                }
            }))
            .catch((err) => {
                next(err)
            })
        } else if(type === "3") {
            Withdraw_Offers.findOne({ 'offers.offerId': offerId })
            .then((theDoc) => {
                if(theDoc) {
                    if(theDoc.userId.toString() === userId) {
                        const theOffer = _.find(theDoc.offers, (i) => { return i.offerId === offerId })
                        const givenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curGivenId.toString() })
                        const takenCur = _.find(currecies, (i) => { return i._id.toString() === theOffer.curTakenId.toString() })
                        data = {
                            givenCurName:givenCur.name,
                            takenCurName:takenCur.name,
                            offerCreatedDate:theOffer.offeredDate,
                            offerwhitdrawDate:theOffer.created_at
                        }
                        successRes(res, '', data)
                    } else {
                        const error = new myError(
                            'you do not have pemissions', 
                            400, 
                            5, 
                            'شما دسترسی ندارید!', 
                            'خطا رخ داد'
                            )
                        next(error)
                    }
                } else {
                    const error = new myError(
                        'there is no oofer with given offerId in withdraw offers', 
                        400, 
                        5, 
                        'پیشنهاد یافت نشد!', 
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

userRoutes.get('/acceptOffer', 
 isAuthorized,
 userValidationRules('query','offerId'),
 validate,
 tryCatch(async(req, res, next) =>{ 
    const acceptorId = req.session.userId
    const offerId = req.query.offerId
    const session  = await mongoose.startSession()

    Active_Offers.findOne({ offerId: offerId })
    .then((offer: any) => {
        if(offer && offer.offerId === offerId) {
            const creatorId = offer.userId
            if(creatorId.toString() !== acceptorId.toString()) {
                const exp = new Date(offer.expDate).getTime()
                
                if(exp >= Date.now()) {  
                    console.log(exp)
                    console.log(offer.expDate)
                         
                    session.withTransaction(async() => {
                        return User.findOne({_id : acceptorId}).session(session)
                        .then((acceptor: any) => {
                            let takenObjInAccWal = _.find(acceptor.wallet, (e) => e.currency.toString() === offer.curTakenId.toString())
                            if(takenObjInAccWal && takenObjInAccWal.value >= offer.curTakenVal) {                     
                                return User.findOne({_id : creatorId}).session(session)
                                .then(async (creator: any) => {
                                    if(creator && creator._id.toString() === creatorId.toString()) {
                                        let givenObjInCreWal = _.find(creator.wallet, (e) => e.currency.toString() === offer.curGivenId.toString())
                                        if(givenObjInCreWal) {
                                            // take from creator and give to acceptor
                                            givenObjInCreWal.commitment -= Number(offer.curGivenVal)
                                            let takenObjInCreWal = _.find(creator.wallet, (i) => i.currency.toString() === offer.curTakenId.toString())
                                            if(takenObjInCreWal) {
                                                takenObjInCreWal.value += offer.curTakenVal
                                            } else {
                                                const currencyObj = {
                                                    currency : offer.curTakenId,
                                                    value : offer.curTakenVal
                                                }
                                            creator.wallet.push(currencyObj) 
                                            }
                                            takenObjInAccWal.value -= offer.curTakenVal
                                            let giveObjInAccWal = _.find(acceptor.wallet, (e) => e.currency.toString() === offer.curGivenId.toString())
                                            if(giveObjInAccWal) {
                                                giveObjInAccWal.value += offer.curGivenVal
                                            } else {
                                                const currencyObj = {
                                                    currency : offer.curGivenId,
                                                    value : offer.curGivenVal,
                                                }
                                            acceptor.wallet.push(currencyObj)
                                            }
                                            const bodyAccOffer = {
                                                acceptor : acceptorId,
                                                creator: creatorId,
                                                offerId: offer.offerId,
                                                curGivenId: offer.curGivenId,
                                                curGivenVal: offer.curGivenVal,
                                                curTakenId: offer.curTakenId,
                                                curTakenVal: offer.curTakenVal,
                                                offeredDate: offer.created_at,
                                                expiredDate: offer.expDate
                                            }
                                            Currencies.findOne({_id : offer.curGivenId})
                                            .then((currency) => {
                                                const currentPrice = bodyAccOffer.curTakenVal
                                                let min 
                                                let max 
                                                redis.hashGetAll('L_' + currency.ab_name)
                                                .then((redisGetObj) => {
                                                    if(redisGetObj != null) {
                                                        if(currentPrice < redisGetObj['min']) {
                                                            min = currentPrice
                                                        } else {
                                                            min = redisGetObj['min']
                                                            if(currentPrice > redisGetObj['max']) {
                                                                max = currentPrice
                                                            } else {
                                                                max = redisGetObj['max']
                                                            }
                                                        }
                                                        redis.hashHMset('L_' + currency.ab_name, {
                                                            currentPrice: currentPrice,
                                                            min : min,
                                                            max : max, 
                                                        })
                                                    } else {
                                                        redis.hashHMset('L_' + currency.ab_name, {
                                                            currentPrice: currentPrice,
                                                            min : currentPrice,
                                                            max : currentPrice, 
                                                        })
                                                    }
                                                })
                                                .catch((err) => {
                                                    throw(err)
                                                })
                                            })
                                            .catch((err) => {
                                                throw(err)
                                            })
                                            await Accepted_Offers.create([bodyAccOffer], { session })
                                            await creator.save()
                                            await acceptor.save()
                                            await offer.remove()
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
                                })
                                .catch((err) => {
                                    throw(err)
                                })
                            } else {
                                const error = new myError(
                                    'There is no enough currency in acceptor wallet or acceptor does not have the currency', 
                                    400, 
                                    5, 
                                    'ارز مورد در کیف پول خریدار نیست یا موجودی آن کافی نیست', 
                                    'خطا رخ داد'
                                    )
                                throw(error) 
                            }
                        })
                        .catch((err) =>{
                            throw(err)
                        })
                    })  
                    .then(() => {
                        successRes(res, 'Offer accepted succesfully ', offerId, {})
                    })
                    .catch((err) => {
                        next(err)
                    })
                    .finally(() => {
                        session.endSession()
                    })              
                } else {
                const error = new myError(
                    'offer is expired', 
                    400, 
                    5, 
                    'پیشنهاد منقضی شده است.', 
                    'خطا رخ داد'
                    )
                next(error) 
                }
             } else {
                const error = new myError(
                    'acceptor and creator must be different', 
                    400, 
                    5, 
                    'فروشنده و خریدار باید متفاوت باشند.', 
                    'خطا رخ داد'
                    )
                next(error) 
             }
         } else {
             const error = new myError(
                 'There is no offer with the given offer Id', 
                 400, 
                 5, 
                 'شناسه پیشنهادی یافت نشد.',
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

userRoutes.post('/withdrawOffer',
isAuthorized,
// userValidationRules('query','offerId'),
// validate,
tryCatch(async(req, res, next) =>{
    const userId = req.session.userId
    const offerIds = req.body.offerIds
    let nowithOffer = false
    console.log('offerIds: ', offerIds)
    console.log('userId: ', userId)
    const session  = await mongoose.startSession()
    session.withTransaction(async() => {
        return User.findOne({ _id : userId }).session(session)
        .then((user: any) => {
            return Active_Offers.find({ $and: [ { offerId : { $in: offerIds } }, { userId: userId } ] }).session(session)
            .then((offers: any) => {
                if(offers && offers.length > 0) {
                    return Withdraw_Offers.findOne({ userId : userId }).session(session)
                    .then(async (withOffer :any) => {
                        if(!withOffer) {
                            nowithOffer = true
                            withOffer = {
                                userId: userId,
                                offers: []
                            }        
                        } 
                        const offersMap = offers.map(async (offer, i) => {
                            const bodyWithOffer = {
                                userId : userId,
                                offers: {
                                    offerId : offer.offerId,
                                    curGivenId: offer.curGivenId,
                                    curGivenVal: offer.curGivenVal,
                                    curTakenId: offer.curTakenId,
                                    curTakenVal: offer.curTakenVal,
                                    offeredDate: offer.created_at,
                                    expiredDate: offer.expDate,
                                    withdrawDate: Date.now()
                                }
                            }
                            let userWalCurGivenObj = _.find(user.wallet, (i) => i.currency.toString() === offer.curGivenId.toString())
                            if(userWalCurGivenObj && userWalCurGivenObj.commitment >= Number(offer.curGivenVal)) {
                                userWalCurGivenObj.value += offer.curGivenVal
                                userWalCurGivenObj.commitment -= Number(offer.curGivenVal)
                            
                                withOffer.offers.push(bodyWithOffer.offers)
                                console.log('i: ', i)
                                await offer.remove() 
                            } else {
                                //error user does not have the currency in his/her wallet
                                const error = new myError(
                                    'user does not have the given currency in his/her wallet', 
                                    400, 
                                    5, 
                                    'کاربر ارز مورد نظر را در کیف پول ندارد.',
                                    'خطا رخ داد'
                                    )
                                throw(error) 
                            }
                        })
                        return Promise.all(offersMap)
                        .then(async () => {
                            if(nowithOffer) {
                                await Withdraw_Offers.create([withOffer], { session })
                            } else {
                                await withOffer.save() 
                            }
                            await user.save()
                        })
                        .catch((err) => {
                            throw err
                        })
                    })
                    .catch((err) => {
                        throw(err)
                    })
                } else {
                    const error = new myError(
                        'There is no offer with the given Id', 
                        400, 
                        5, 
                        'شناسه پیشنهادی یافت نشد.',
                        'خطا رخ داد'
                        )
                    throw(error) 
                }
            })
            .catch((err) => {
                throw(err)
            })
        })   
        .catch((err) => {
            throw(err)
        })
    })
    .then(() => {
        successRes(res, 'Offer removed Successfully. ', true, {})
    })
    .catch((err) => {
        console.log('error: ', err)
        next(err)
    })
    .finally(() => {
        session.endSession()
    })
 })
)


/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

userRoutes.post('/createOffer',
    isAuthorized,
    userValidationRules('body', 'curGivenId'),
    userValidationRules('body', 'curGivenVal'),
    userValidationRules('body', 'curTakenId'),
    userValidationRules('body', 'curTakenVal'),
    //userValidationRules('body', 'expDate'),
    validate,
    tryCatch(async(req, res, next) => {
        const userId      = req.session.userId
        const curGivenId  = req.body.curGivenId
        const curGivenVal = req.body.curGivenVal
        const curTakenId  = req.body.curTakenId
        const curTakenVal = req.body.curTakenVal
        const expDate     = req.body.expDate
        let offerId
        let bodyOffer
        const exp = new Date(expDate)
        const session  = await mongoose.startSession()
        if(exp.getTime() >= Date.now()) {
            if(curGivenId != curTakenId) {
                Currencies.findOne({_id : curGivenId})
                .then((curGivenObj) => {
                    Currencies.findOne({_id : curTakenId})
                    .then((curTakenObj) => {
                        if(curGivenObj  && curTakenObj && curGivenObj._id.toString() === curGivenId.toString() && 
                            curTakenObj._id.toString() === curTakenId.toString()) {
                               
                                session.withTransaction(() => { 
                                   // console.log("sasan")
                                    return User.findOne({_id : userId}).session(session)
                                    .then(async(user: any) => {
                                        if(user && user._id.toString() === userId.toString()) {
                                            let userWallet = _.find(user.wallet, (e) => e.currency.toString() === curGivenId.toString())  // object of specific currency in user's wallet
                                            if(userWallet) {
                                                if(userWallet.value >= curGivenVal) {
                                                    offerId = uuidv4()
                                                    bodyOffer = {   
                                                        userId : userId,
                                                        offerId: offerId,
                                                        curGivenId: curGivenId,
                                                        curGivenVal: curGivenVal,
                                                        curTakenId: curTakenId,
                                                        curTakenVal: curTakenVal,
                                                        expDate: expDate,
                                                        rank: user.rank
                                                    }
                                                    userWallet.value = userWallet.value - curGivenVal
                                                    userWallet.commitment = userWallet.commitment + Number(curGivenVal)
                                                    await Active_Offers.create([bodyOffer], { session })  
                                                    await user.save()        
                                                    } else {
                                                        const error = new myError(
                                                            'Given: user has not enough credit in his/her wallet', 
                                                            400, 
                                                            5, 
                                                            'کاربر مقدار کافی از ارز برای پیشنهاد داده شده را ندارد.',
                                                            'خطا رخ داد'
                                                        )
                                                        throw(error)
                                                    }
                                                } else {
                                                    const error = new myError(
                                                        'User does not have this kind of currency', 
                                                        400, 
                                                        5, 
                                                        'کیف پول کاربر ارز پیشنهادی را ندارد.',
                                                        'خطا رخ داد'
                                                    )
                                                    throw(error)
                                                }
                                            }
                                              else {
                                            const err = new myError(
                                                'userId not found', 
                                                400, 
                                                5, 
                                                'خطا رخ داد',
                                                'کاربری با این شناسه کاربری پیدا نشد.'
                                            )
                                            throw(err)
                                        }
                                    })
                                    .catch((err) => {
                                        throw(err)
                                    })
                                })
                                .then(() => {
                                    successRes(res, 'Offer created succesfully ', offerId, {})
                                    const modifiedBodyOffer = {
                                        offerId: bodyOffer.offerId,
                                        curGivenId: bodyOffer.curGivenId,
                                        curGivenVal: bodyOffer.curGivenVal,
                                        curTakenId: bodyOffer.curTakenId,
                                        curTakenVal: bodyOffer.curTakenVal,
                                        expDate: bodyOffer.expDate,
                                    }
                                    redis.hashSetMembers(userId)
                                    .then((result) => {
                                        console.log('result: ', result)
                                    })
                                    onlineLoginUsers.emit('new_offer', modifiedBodyOffer)
                                })
                                .catch((err) => {
                                    console.log('error: ', err)
                                    next(err)
                                })
                                .finally(() => {
                                    session.endSession()
                                })
                        } else {
                            const err = new myError(
                                'curTakenId error', 
                                400, 
                                5, 
                                'ارز وارد شده صحیح نیست', 
                                'خطا رخ داد'
                            )
                            next(err) 
                        }
                    })
                    .catch((err) => {
                        next(err)
                    })
                })
                .catch((err) => {
                    next (err)
                })
            } else {
                const err = new myError(
                    'curGivenId must be different from curTakenId', 
                    400, 
                    5, 
                    'ارز ها برای تبادل باید متفاوت باشند.', 
                    'خطا رخ داد'
                )
                next(err)
            }
        } else {
            const err = new myError(
                'expire date must be in the future(not before creating offer date)', 
                400, 
                5, 
                'تاریخ انقضای پیشنهاد باید بعد از ایجاد پیشنهاد باشد.', 
                'خطا رخ داد'
            )
            next(err)
        }
    })
);

userRoutes.post('/getPrice', 
    isAuthorized,
    userValidationRules('body','currency'),
    userValidationRules('body','quantity'),
    validate,
    tryCatch((req, res, next) => {
        const userId = req.session.userId
        const currency = req.body.currency
        const quantity = req.body.quantity
        User.findOne({ _id: userId })
        .then((user) => {
            if(user && user._id.toString() === userId) {
                GetPrice.findOne({ $and: [{ currency: currency }, { userId: user._id }] })
                .then(async (doc) => {
                    const curRialPrice = await redis.getCurrentPrice(currency)
                    const bodyPrice = {
                        currency: currency,
                        userId: user._id,
                        quantity: quantity,
                        rialPricePerUnit: curRialPrice
                    }
                    if(doc) {
                        doc.remove()
                        const newGetPrice = new GetPrice({ ...bodyPrice })
                        newGetPrice.save()
                        .then(() => {
                            successRes(res, 'old getPrice doc removed and a new one created', curRialPrice, {})
                        })
                        .catch((err) => {
                            next(err)
                        })
                    } else {
                        const newGetPrice = new GetPrice({ ...bodyPrice })
                        newGetPrice.save()
                        .then(() => {
                            successRes(res, 'getPrice doc created', curRialPrice, {})
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
                const error = new myError(
                    'user not found', 
                    400, 
                    5, 
                    'کاربر پیدا نشد',
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


userRoutes.post('/addCurrencyValue', 
isAuthorized,
userValidationRules('body','currencyId'),
userValidationRules('body','currencyValue'),
validate,
tryCatch((req, res, next) => {
    const currency = req.body.currencyId

    const value = Number(req.body.currencyValue)
    console.log("req.body.currencyValue  is type of ", typeof(req.body.currencyValue))
    const userId = req.session.userId
    Currencies.findOne({ _id : currency })
    .then((cur: any) => {
        if (cur && cur._id.toString() === currency) {
            User.findOne({ _id : userId })
            .then((user: any) => {
                 if(user && user._id.toString() === userId) {
                    let wall = _.find(user.wallet, (i) => { return i.currency.toString() === currency.toString() })
                    if(wall) {
                        console.log("wallet value is type of ", typeof(wall.value))
                        console.log(" value is type of ", typeof(value))
                        wall.value += value
                    } else {
                        user.wallet.push({ currency : cur._id , value : value })
                    }
                    user.save()
                    .then(() => {
                        successRes(res,"value added successfully")
                    })
                    .catch((err) => {
                        next(err)
                    })   
                } else {
                    const error = new myError(
                        'user not found!', 
                        400, 
                        5, 
                        'کاربر مربوطه پیدا نشد!', 
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
                'currency not found!', 
                400, 
                5, 
                'ارز ها برای تبادل باید متفاوت باشند.', 
                'خطا رخ داد'
                )
            next(error)      
        }
    })
    .catch((err) => {
        next(err)
    })
}))

userRoutes.post('/transferCuurency', 
isAuthorized,
userValidationRules('body','currencyId'),
userValidationRules('body','currencyValue'),
userValidationRules('body','receiverUsername'),
validate,
tryCatch(async (req, res, next) => {
    const currency = req.body.currencyId
    const value = req.body.currencyValue
    const receiverUsername = req.body.receiverUsername
    let query
    const userId = req.session.userId
    let session = await  mongoose.startSession()   
    Currencies.findOne({_id : currency})
    .then((curr) => {
        if(curr && curr._id.toString() === currency) {
            session.withTransaction(async() => {
                return User.findOne({ _id : userId }).session(session)
                .then((sender: any) => {
                    if (sender && sender._id.toString() === userId) {
                        let theCur = _.find(sender.wallet, (i) => { return i.currency.toString() ===  currency })
                        if (theCur) {   
                            if(Number(theCur.value) >= Number(value)) {
                                theCur.value -= value
                                if (isEmailValid(receiverUsername)) {
                                    query = { 'email.address': receiverUsername }
                                } else if (isValidMobilePhone(receiverUsername)) {
                                    query = { 'phoneNumber.number': receiverUsername }
                                }
                                return User.findOne(query).session(session)
                                .then(async(receiver: any) => {
                                    if (receiver) {
                                        let theCur2 = _.find(receiver.wallet, (i) => { return i.currency.toString() === currency })
                                        if (theCur2) {
                                            theCur2.value += value
                                            await receiver.save()
                                            await sender.save()
                                        } else {
                                            receiver.wallet.push({ currency: currency , value: value })
                                            await receiver.save()
                                            await sender.save()
                                        }
                                    } else {
                                        const error = new myError(
                                            'The reciever does not exist!', 
                                            400, 
                                            5, 
                                            'نام کاربری گیرنده معتبر نیست!', 
                                            'خطا رخ داد'
                                            )
                                        throw(error)
                                    }
                                })
                                .catch((err) =>{
                                    throw(err)
                                })     
                            } else {
                               const error = new myError(
                                   'you do not have enough currency', 
                                   400, 
                                   5, 
                                   'موجودی کافی نیست !', 
                                   'خطا رخ داد'
                                   )
                               throw(error)
                           }
                        } else {
                            const error = new myError(
                                'you do not have this currency', 
                                400, 
                                5, 
                                'ارز فوق در کیف پول شما موجود نیست !', 
                                'خطا رخ داد'
                                )
                            throw(error)
                            }
                    } else {
                        const error = new myError(
                            'The user does not exist!', 
                            400, 
                            5, 
                            'چنین کاربری در سیستم ثبت نشده است!', 
                            'خطا رخ داد'
                            )
                        throw(error)
                    }
                })
                .catch((err) => {
                    throw(err)
                })
            })
            .then(()=> {
                successRes(res)
             })
             .catch((err) => {
                console.log('error: ', err)
                next(err)
            })
            .finally(() => {
                session.endSession()
            })  
         } else {
             const error = new myError(
                 'the currency is not valid', 
                 400, 
                 5, 
                 'ارز فوق متعبر نیست !', 
                 'خطا رخ داد'
                 )
             next(error)
         }
     })
     .catch((err) =>{
         next(err)
     })
 }))
 
userRoutes.post('/chargeAcount', 
 isAuthorized,
 // if we want to aurhorize again we need aonther middleware
 tryCatch((req, res, next) => {
     const rialObjectId = process.env.OBJECTID_RIAL
     const value = req.body.value
     const userId = req.session.userId
     User.findOne({_id : userId})
     .then((user: any) =>{
         let wall = _.find(user.wallet, (i) => { return i.currency.toString()=== rialObjectId})
         wall.value += value
         user.save()
         .then(() =>{
             successRes(res)
         }).catch((err) =>{
             next(err)
         })
     }).catch((err) =>{
         next(err)
     })
 }))
