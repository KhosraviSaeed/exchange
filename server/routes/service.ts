import * as express from 'express';
import * as fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path';

import * as _ from 'lodash'


import {ObjectID} from 'mongodb'
import { logger } from '../api/logger'
import { searchOnActiveOffers, searchOnTxs } from '../api/query'
import myError from '../api/myError'
import * as redis from '../api/redis'
import { Accepted_Offers } from '../db/acceptedOffers';
import {LocalHourly} from '../db/localHourly'

import { userValidationRules, validate } from '../middlewares/validation'
import tryCatch from '../middlewares/tryCtach';
import successRes from '../middlewares/response';
import { isAuthorized } from '../middlewares/auth'


import { Active_Offers } from '../db/ActiveOffers';
import { Currencies } from '../db/currencies'

export const serviceRoutes = express.Router()




/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

serviceRoutes.get('/getDeafultAcceptedOffers', 
tryCatch((req, res, next) => {
    const curId = req.query.curIdOp
    let rialObj
    Currencies.findOne({ ab_name: 'IRR' })
    .then((rial: any) => {
        if (rial && rial.ab_name === 'IRR') {
            rialObj = {
                _id: rial._id,
                currencyName: rial.currencyName, 
                per_name: rial.per_name,
                ab_name: rial.ab_name,
                icon: rial.icon
            }
        } else {
            throw 'kl'
        }    
        let offersArray = []
        let query = {}
        if (ObjectID.isValid(curId)) {
            query =  { $or: [ 
                { $and: [{ curGivenId: curId }, { curTakenId: rial._id } ] },
                { $and: [{ curTakenId: curId }, { curGivenId: rial._id } ] }
            ] } 
        } else {
            query = { $or: [{ curTakenId : rial._id }, { curGivenId : rial._id } ] }
        }
        Accepted_Offers.find(query)
        .then((offers) => {
            const offersMap = offers.map((offer: any) => {
                if (offer.curTakenId.toString() === rial._id.toString()) {
                    return redis.hashGetAll(offer.curGivenId.toString())
                    .then((curGivenObj: any) => {
                        offersArray.push({
                            GcurrencyName: curGivenObj.currencyName,
                            GpersianName: curGivenObj.per_name,
                            GshortName: curGivenObj.ab_name,
                            Gvalue: offer.curGivenVal,
                            Gicon: curGivenObj.icon,
                            acceptedDate: offer.created_at,
                            TcurrencyName: rialObj.currencyName,
                            TpersianName: rialObj.per_name,
                            TshortName: rialObj.ab_name,
                            Tvalue: offer.curTakenVal,
                            Ticon: rialObj.icon,
                            txType: 'sell'
                        })
                        return offersArray
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                } else if (offer.curGivenId.toString() === rial._id.toString()) {
                    return redis.hashGetAll(offer.curTakenId.toString())
                    .then((curTakenObj: any) => {
                        offersArray.push({
                            GcurrencyName: curTakenObj.currencyName,
                            GpersianName: curTakenObj.per_name,
                            GshortName: curTakenObj.ab_name,
                            Gvalue: offer.curTakenVal,
                            Gicon: curTakenObj.icon,
                            acceptedDate: offer.created_at,
                            TcurrencyName: rialObj.currencyName,
                            TpersianName: rialObj.per_name,
                            TshortName: rialObj.ab_name,
                            Tvalue: offer.curGivenVal,
                            Ticon: rialObj.icon,
                            txType: 'buy'
                        })
                        return offersArray
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
            })
            Promise.all(offersMap)
            .then(() => {
                successRes(res, '', offersArray)
            })
            .catch((err) => {
                next(err)
            })
        })
        .catch((err) => {
            next(err)
        })    
    })
    .catch((err) => {
        next(err)
    })  
}))

serviceRoutes.get('/getAcceptedOffers', 
// userValidationRules('query', 'status'),
// userValidationRules('query', 'rialId'),
// userValidationRules('query', 'currencyId'),
// validate,
tryCatch((req, res, next) => {
    const status = req.query.status
    const currency = req.query.currencyId
    const rialId = req.query.rialId
    let query = []

    if(status === "sell") {
        if(rialId) {
            query.push({ curGivenId : currency }, { curTakenId : rialId })
        } else {
            query.push({ curGivenId : currency })
        }
    } else if(status === "buy") {
        if(rialId) {
            query.push({ curTakenId : currency }, { curGivenId : rialId })
        } else {
            query.push({ curTakenId : currency })
        }
    }
    Accepted_Offers.find({ $and : query })
    .then(offers => {
       if(offers[0]){
        let dataArray =[]
        redis.hashGetAll(currency.toString())
        .then((cur:any) => {
           if(cur){
            let rialName 
            let rialpesianName 
            let rialShortName 
            if(rialId) {
                redis.hashGetAll(rialId.toString())
                .then((rial: any) => {
                    if(rial) {
                        rialName = rial.currencyName
                        rialpesianName = rial.per_name
                        rialShortName = rial.ab_name
                    } else {
                        const error = new myError(
                            'rial not found!', 
                            400, 
                            5, 
                            'ریال پیدا نشد!', 
                            'خطا رخ داد'
                            )
                        throw(error)
                    }
                })
                .catch((err)=>{
                    throw(err)
                })
            }
            const offmap = offers.map((off: any) => {
               if(status === "sell"){
                   if(rialId){
                        dataArray.push({
                            GcurrencyName : cur.currencyName,
                            GpersianName:cur.per_name,
                            GshortName :cur.ab_name,
                            Gvalue : off.curTakenVal,
                            acceptedDate : off.created_at,
                            TcurrencyName : rialName,
                            TpersianName: rialpesianName,
                            TshortName : rialShortName,
                            Tvalue : off.curTakenVal,
                        })
                   } else {
                        return redis.hashGetAll(off.curTakenId.toString())
                        .then((curT: any) => {
                            if(curT){
                                dataArray.push({
                                    GcurrencyName : cur.currencyName,
                                    GpersianName:cur.per_name,
                                    GshortName :cur.ab_name,
                                    Gvalue : off.curGivenVal,
                                    acceptedDate : off.created_at,
                                    TcurrencyName : curT.currencyName,
                                    TpersianName:curT.per_name,
                                    TshortName :curT.ab_name,
                                    Tvalue : off.curTakenVal,
                                })
                            } else {
                                return
                            }
                        })
                        .catch((err)=>{
                            next(err)
                        })
                    }
               }
               else if(status === "buy"){
                   if(rialId) {
                        dataArray.push({
                            TcurrencyName : cur.currencyName,
                            TpersianName:cur.per_name,
                            TshortName :cur.ab_name,
                            Tvalue : off.curTakenVal,
                            acceptedDate : off.created_at,
                            GcurrencyName : rialName,
                            GpersianName:rialpesianName,
                            GshortName :rialShortName,
                            Gvalue : off.curGivenVal,
                            }) 
                    } else {
                        return redis.hashGetAll(off.curGivenId.toString())
                        .then((curG: any) => {
                            if(curG){
                                dataArray.push({
                                    TcurrencyName : cur.currencyName,
                                    TpersianName:cur.per_name,
                                    TshortName :cur.ab_name,
                                    Tvalue : off.curTakenVal,
                                    acceptedDate : off.created_at,
                                    GcurrencyName : curG.currencyName,
                                    GpersianName:curG.per_name,
                                    GshortName :curG.ab_name,
                                    Gvalue : off.curGivenVal,
                                })
                            } else {
                                return
                            }
                        })
                        .catch((err)=>{
                            next(err)
                        })
                    }
                }
            })
            Promise.all(offmap)
            .then(()=>{
                successRes(res, "offer founded", dataArray)
            })
            .catch((err) => {
                next(err)
            })  
        } else {
        const error = new myError(
           'currency not found!', 
           400, 
           5, 
           'ارز مربوطه پیدا نشد!', 
           'خطا رخ داد'
           )
               next(error)
           }
        })
        .catch((err) => {
            next(err)
        })
       } else{
           const error = new myError(
               'offer not found!', 
               400, 
               5, 
               'سفارش پیدا نشد!', 
               'خطا رخ داد'
               )
           next(error)
       }
    })
    .catch((err) => {
        next(err)
    })
}))
 

serviceRoutes.get('/getOnlinePrices', tryCatch((req, res, next) => {
    let curArr = []
    const fetchBTC = () => {
        return fetch(`https://api.nomics.com/v1/exchange-rates/history?key=${process.env.CURRENCY_API_KEY}&currency=BTC&start=2020-09-25T00%3A00%3A00Z`, { 
            method: 'GET'
        })
        .then(res => res.json())
        .then(response => {
            curArr.push({ currency: 'BTC', prices: response })
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const fetchETH = () => {
        return fetch(`https://api.nomics.com/v1/exchange-rates/history?key=${process.env.CURRENCY_API_KEY}&currency=ETH&start=2020-09-25T00%3A00%3A00Z`, { 
            method: 'GET'
        })
        .then(res => res.json())
        .then(response => {
            curArr.push({ currency: 'ETH', prices: response })
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const fetchTRX = () => {
        return fetch(`https://api.nomics.com/v1/exchange-rates/history?key=${process.env.CURRENCY_API_KEY}&currency=TRX&start=2020-09-25T00%3A00%3A00Z`, { 
            method: 'GET'
        })
        .then(res => res.json())
        .then(response => {
            curArr.push({ currency: 'TRX', prices: response })
        })
        .catch((err) => {
            console.log(err)
        })
    }
    return Promise.all([ fetchBTC(), fetchETH(), fetchTRX() ])
    .then(() => {
        successRes(res, '', curArr)
    })
    .catch((err) => {
        next(err)
    })
}))

serviceRoutes.get('/getCurrencies', 
tryCatch((req, res, next) => {
    const type = req.query.type
    Currencies.find()
    .then((curs) => {
        if(curs) {
            let curArray = []
            let priceRial
            redis.hashget("dollarPrice")
            .then((rial: number) => {
                if(rial) {
                    priceRial = Number(rial/10)
                }
                const cursMap = curs.map((cur: any) => {
                    if (cur.ab_name !== 'IRR') {
                        let curInfo = {
                            currencyName : cur.name,
                            persianName : cur.per_name,
                            shortName : cur.ab_name,
                            icon: cur.icon,
                            _id: cur._id
                        }
                        if (type === '1') {
                            return redis.hashGetAll(cur.ab_name+'-g')
                            .then((price: any) => {
                                if(price && price.current && !Number.isNaN(Number(price.current))) {
                                    if (priceRial) {
                                        curInfo['price'] = Math.ceil(Number(price.current) * priceRial)
                                        curInfo['min'] = Math.ceil(Number(price.min) * priceRial)
                                        curInfo['max'] = Math.ceil(Number(price.max) * priceRial)
                                    }
                                }
                                curArray.push(curInfo)
                            })
                            .catch((err)=>{
                                throw (err)
                            })
                        } else {
                            curArray.push(curInfo)
                        }
                    } else {
                        curArray.unshift({
                            currencyName : cur.name,
                            persianName : cur.per_name,
                            shortName : cur.ab_name,
                            icon: cur.icon,
                            _id: cur._id
                        })
                    }
                })
                Promise.all(cursMap)
                .then(() => {
                    successRes(res,'currencies informations', curArray)
                })
                .catch((err) => {
                    next (err)
                })         
            })
            .catch((err)=>{
               next(err)
            })  
        } else {
            const error = new myError (
                'currencies not found ', 
                400, 
                5, 
                'ارزیی پیدا نشد!', 
                'خطا رخ داد'
                )
            next(error) 
        }
    })
    .catch((err) => {
        next(err)
    })
}))


serviceRoutes.get('/getImages/:imageType/:imageName', 
  tryCatch((req, res, next) => {
    const imageType = req.params.imageType
    const imageName = req.params.imageName

    const validPaths = ['coins']
    let imageFile
    if (req.query.type && validPaths.includes(req.query.type)) {
      imageFile = fs.readFileSync(`./images/${imageName}`)
    } else {
      imageFile = fs.readFileSync(`./images/${imageType}/${imageName}`)
    }
    const ext = path.extname(imageName)
    res.contentType(`image/${ext}`)
    res.send(imageFile)
  }))

serviceRoutes.get('/getActiveOffers', 
// isAuthorized,
tryCatch(async (req, res, next) => {
    const userId = req.session.userId
    const curId = req.query.curIdOp
    const status = req.query.status
    let query = []
    let rialObj 
    query.push({ expDate: { $gt: Date.now() } })
    if (ObjectID.isValid(curId)) {
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
    Active_Offers.find( { $and: query } )
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
                                owner: userId && userId === offer.userId.toString() ? true : false,
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
                                owner: userId && userId === offer.userId.toString() ? true : false,
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
                    offers.forEach((off: any) => {
                        const givenCur = _.find(curs, (i) => { return i._id.toString() === off.curGivenId.toString()})
                        const takenCur = _.find(curs, (i) => { return i._id.toString() === off.curTakenId.toString()})    
                        if(givenCur && takenCur) {
                            dataArray.push ({
                                giveCurname : givenCur.name,
                                giveCurValue : off.curGivenVal,
                                //givenCurPersianName : givenCur.per_name,
                                //givenCurShortName : givenCur.ab_name,
                                //givenCurIcon : givenCur.icon,
                                takenCurname : takenCur.name,
                                takenCurValue : off.curTakenVal,
                                //takenCurpersianName: takenCur.per_name,
                                //takenCurShortName : takenCur.ab_name,
                                //takenCurIcon : takenCur.icon,
                                createDate : off.created_at,
                                expireDate : off.expDate,
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
            const error = new myError(
                'there is not any active offer in network', 
                400, 
                5, 
                'there is not any active offer in network!', 
                'خطا رخ داد'
                )
            next(error)
        }
    })
    .catch((err) =>{
        next(err)
    })
 }))

serviceRoutes.post('/filterOnTxs', 
tryCatch((req, res, next) => {
    console.log('req.body: ', req.body)
    const curId = req.body.curIdOp
    const txType = req.body.txType
    Currencies.findOne({ ab_name: 'IRR' })
    .then((doc: any) => {
        if (doc && doc.ab_name === 'IRR') {
            searchOnTxs({ curId, txType, rial: doc })
            .then((result) => {
                successRes(res, '', result)
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
}))

serviceRoutes.post('/filterOnOffers',
userValidationRules('body', 'offerIdOp'),
userValidationRules('body', 'curGivenIdOp'),
userValidationRules('body', 'curGivenValOp'),
userValidationRules('body', 'curTakenIdOp'),
userValidationRules('body', 'curTakenValOp'),
userValidationRules('body', 'expDateOp'),
userValidationRules('body', 'created_atOp'),
validate,
tryCatch((req, res, next) => {
    const offerId = req.body.offerIdOp
    const curGivenId = req.body.curGivenIdOp
    const curGivenVal = req.body.curGivenValOp
    const curTakenId = req.body.curTakenIdOp
    const curTakenVal = req.body.curTakenValOp
    const expDate = req.body.expDateOp
    const created_at = req.body.created_atOp

    searchOnActiveOffers({ offerId, curGivenId, curGivenVal, curTakenId, curTakenVal, expDate, created_at })
    .then((result) => {
        successRes(res, '', result)
    })
    .catch((err) => {
        next(err)
    })
}))




serviceRoutes.get('/getLocalHorlyPrice', 
userValidationRules('query','currencyId'),
userValidationRules('query','interval'),
userValidationRules('query','pageNumber'),
validate,
  tryCatch((req, res, next) => {
    const currencyId = req.query.currencyId
    const interval = req.query.interval
    const pageNumber  = req.query.pageNumber
    let collection 
    if(interval==="h"){
        collection = LocalHourly
    }else if(interval==="d"){
        //collection = 
    }else if(interval==="w"){
        //collection = 
    }else if(interval==="y"){
        //collection = 
    }
    else if(interval==="m"){
        //collection = 
    }
   collection.aggregate()
    .project({
        currencies:{
            $filter: {
                input: "$currencies",
                as: "currency",
                cond: {
                    $eq: ["$$currency.currencyId",new ObjectID(currencyId)]
                }
            }
        }
    }).sort({name: -1}).skip(Number(pageNumber)*Number(process.env.CHART_LIMIT)).limit(20)
    .then((r)=>{
        successRes(res,"....",r)
    }).catch((err)=>{
        next(err)
    })
}))