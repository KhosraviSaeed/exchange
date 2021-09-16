import * as _ from 'lodash'

import * as redis from '../api/redis'


import { Accepted_Offers } from '../db/acceptedOffers';
import { Active_Offers } from '../db/ActiveOffers';

export const searchOnTxs = ({ curId, txType, rial }) => {
    const itemsMap = new Map()
    const items = ['curId']
    const definedItems = []
    itemsMap.set('curId', curId)


    items.map((element) => {
        if(itemsMap.get(element)) {
        definedItems.push(element)
        }
    })

    let query = []
    let queryMap = new Map()

    queryMap.set('curId', [ { $or: [ 
        { $and: [{ curGivenId: curId }, { curTakenId: rial._id } ] },
        { $and: [{ curTakenId: curId }, { curGivenId: rial._id } ] }
    ] } ] )
    
    const definedItemsMap = definedItems.map((element) => {
        query.push.apply(query, queryMap.get(element))
    })

    if(query.length === 0) {
        query = [ { $or: [ { curTakenId: rial._id }, { curGivenId: rial._id } ] } ]
    }
    console.log('query: ', query)
    return Promise.all(definedItemsMap)
    .then(() => {
        return Accepted_Offers.find({ $and: query })
        .then((result) => {
            let modifiedResult = []
            if(itemsMap.get('curId')) {
                return redis.hashGetAll(curId.toString())
                .then((curObj: any) => {
                    result.map((e) => {
                        if (e.curTakenId.toString() === rial._id.toString() && txType === 'sell') {
                            modifiedResult.push ({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: e.curGivenVal,
                                Gicon: curObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curTakenVal,
                                Ticon: rial.icon,
                                txType: 'sell'
                            })
                        } else if (e.curGivenId.toString() === rial._id.toString() && txType === 'buy') {
                            modifiedResult.push ({
                                GcurrencyName: curObj.currencyName,
                                GpersianName: curObj.per_name,
                                GshortName: curObj.ab_name,
                                Gvalue: e.curTakenVal,
                                Gicon: curObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curGivenVal,
                                Ticon: rial.icon,
                                txType: 'buy'
                            })
                        } else if (txType === 'all') {
                            if (e.curTakenId.toString() === rial._id.toString()) {
                                modifiedResult.push ({
                                    GcurrencyName: curObj.currencyName,
                                    GpersianName: curObj.per_name,
                                    GshortName: curObj.ab_name,
                                    Gvalue: e.curGivenVal,
                                    Gicon: curObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curTakenVal,
                                    Ticon: rial.icon,
                                    txType: 'sell'
                                })
                            } else if (e.curGivenId.toString() === rial._id.toString()) {
                                modifiedResult.push ({
                                    GcurrencyName: curObj.currencyName,
                                    GpersianName: curObj.per_name,
                                    GshortName: curObj.ab_name,
                                    Gvalue: e.curTakenVal,
                                    Gicon: curObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curGivenVal,
                                    Ticon: rial.icon,
                                    txType: 'buy'
                                })
                            }
                        }
                    })
                    return modifiedResult
                })
                .catch((err) => {
                    throw err
                })
            } else {
                 const resultMap = result.map((e) => {
                     console.log('eeeeeeeee: ', e)
                    if (e.curTakenId.toString() === rial._id.toString() && txType === 'sell') {
                        return redis.hashGetAll(e.curGivenId.toString())
                        .then((curGivenObj: any) => {
                            modifiedResult.push ({
                                GcurrencyName: curGivenObj.currencyName,
                                GpersianName: curGivenObj.per_name,
                                GshortName: curGivenObj.ab_name,
                                Gvalue: e.curGivenVal,
                                Gicon: curGivenObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curTakenVal,
                                Ticon: rial.icon,
                                txType: 'sell'
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    } else if (e.curGivenId.toString() === rial._id.toString() && txType === 'buy') {
                        return redis.hashGetAll(e.curTakenId.toString())
                        .then((curTakenObj: any) => {
                            modifiedResult.push({
                                GcurrencyName: curTakenObj.currencyName,
                                GpersianName: curTakenObj.per_name,
                                GshortName: curTakenObj.ab_name,
                                Gvalue: e.curTakenVal,
                                Gicon: curTakenObj.icon,
                                acceptedDate: e.created_at,
                                TcurrencyName: rial.currencyName,
                                TpersianName: rial.per_name,
                                TshortName: rial.ab_name,
                                Tvalue: e.curGivenVal,
                                Ticon: rial.icon,
                                txType: 'buy'
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    } else if (txType === 'all') {
                        if (e.curTakenId.toString() === rial._id.toString()) {
                            return redis.hashGetAll(e.curGivenId.toString())
                            .then((curGivenObj: any) => {
                                modifiedResult.push ({
                                    GcurrencyName: curGivenObj.currencyName,
                                    GpersianName: curGivenObj.per_name,
                                    GshortName: curGivenObj.ab_name,
                                    Gvalue: e.curGivenVal,
                                    Gicon: curGivenObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curTakenVal,
                                    Ticon: rial.icon,
                                    txType: 'sell'
                                })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        } else if (e.curGivenId.toString() === rial._id.toString()) {
                            return redis.hashGetAll(e.curTakenId.toString())
                            .then((curTakenObj: any) => {
                                modifiedResult.push ({
                                    GcurrencyName: curTakenObj.currencyName,
                                    GpersianName: curTakenObj.per_name,
                                    GshortName: curTakenObj.ab_name,
                                    Gvalue: e.curTakenVal,
                                    Gicon: curTakenObj.icon,
                                    acceptedDate: e.created_at,
                                    TcurrencyName: rial.currencyName,
                                    TpersianName: rial.per_name,
                                    TshortName: rial.ab_name,
                                    Tvalue: e.curGivenVal,
                                    Ticon: rial.icon,
                                    txType: 'buy'
                                })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                })
                return Promise.all(resultMap)
                .then(() => {
                    return modifiedResult
                })
                .catch((err) => {
                    throw err
                })
            }
        })
        .catch((err) => {
            throw err
        })
    })
    .catch((err) => {
        throw err
    })
}



export const searchOnActiveOffers = ({ offerId, curGivenId, curGivenVal, curTakenId, curTakenVal, expDate, created_at }) => {
    const itemsMap = new Map()
    const items = ['offerId', 'curGivenId', 'curGivenVal', 'curTakenId', 'curTakenVal', 'expDate', 'created_at']
    const definedItems = []
    itemsMap.set('offerId', offerId)
    itemsMap.set('curGivenId', curGivenId)
    itemsMap.set('curGivenVal', curGivenVal)
    itemsMap.set('curTakenId', curTakenId)
    itemsMap.set('curTakenVal', curTakenVal)
    itemsMap.set('expDate', expDate)
    itemsMap.set('created_at', created_at)

    items.map((element) => {
        if(itemsMap.get(element)) {
            if (element === 'expDate') {
                if(expDate.from || expDate.to) {
                    definedItems.push(element)
                }
            } else if (element === 'created_at') {
                if(created_at.from || created_at.to) {
                    definedItems.push(element)
                }
            } else if (element === 'curGivenVal') {
                if(curGivenVal.from || curGivenVal.to) {
                    definedItems.push(element)
                }
            } else if (element === 'curTakenVal') {
                if(curTakenVal.from || curTakenVal.to) {
                    definedItems.push(element)
                }
            } else {
                definedItems.push(element)
            }
        }
    })

    let query = [ { expDate: { $gt: Date.now() } } ]
    let queryMap = new Map()
    let queryExpDate 
    let queryCreatedAt
    let queryCurGivenVal
    let queryCurTakenVal

    if (definedItems.includes('expDate')) {
        if (expDate.from && expDate.to) {
            queryExpDate = { expDate: { $gt: expDate.from, $lt: expDate.to } }
        } else if (expDate.from && !expDate.to) {
            queryExpDate = { expDate: { $gt: expDate.from } }
        } else if (!expDate.from && expDate.to) {
            queryExpDate = { expDate: { $lt: expDate.to } }
        }
    }
    if (definedItems.includes('created_at')) {
        if (created_at.from && created_at.to) {
            queryCreatedAt = { created_at: { $gt: created_at.from, $lt: created_at.to } }
        } else if (created_at.from && !created_at.to) {
            queryCreatedAt = { created_at: { $gt: created_at.from } }
        } else if (!created_at.from && created_at.to) {
            queryCreatedAt = { created_at: { $lt: created_at.to } }
        }
    }
    if (definedItems.includes('curGivenVal')) {
        if (curGivenVal.from && curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $gte: curGivenVal.from, $lte: curGivenVal.to } }
        } else if (curGivenVal.from && !curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $gte: curGivenVal.from } }
        } else if (!curGivenVal.from && curGivenVal.to) {
            queryCurGivenVal = { curGivenVal: { $lte: curGivenVal.to } }
        }
    }
    if (definedItems.includes('curTakenVal')) {
        if (curTakenVal.from && curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $gte: curTakenVal.from, $lte: curTakenVal.to } }
        } else if (curTakenVal.from && !curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $gte: curTakenVal.from } }
        } else if (!curTakenVal.from && curTakenVal.to) {
            queryCurTakenVal = { curTakenVal: { $lte: curTakenVal.to } }
        }
    }

    queryMap.set('offerId', { offerId: offerId })
    queryMap.set('curGivenId', { curGivenId: curGivenId })
    queryMap.set('curGivenVal', queryCurGivenVal)
    queryMap.set('curTakenId', { curTakenId: curTakenId })
    queryMap.set('curTakenVal', queryCurTakenVal)
    queryMap.set('expDate', queryExpDate)
    queryMap.set('created_at', queryCreatedAt)
    const definedItemsMap = definedItems.map((element) => {
        query.push(queryMap.get(element))
    })

    return Promise.all(definedItemsMap)
    .then(() => {
        return Active_Offers.find({ $and: query })
        .then((result) => {
           return result
        })
        .catch((err) => {
            throw err
        })
    })
    .catch((err) => {
        throw err
    })
}



