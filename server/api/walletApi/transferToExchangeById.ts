import * as _ from 'lodash'
import myError from '../myError'
import { Currencies } from '../../db/currencies'
import { User } from '../../db/user'
import * as mongoose from 'mongoose'
import * as bitcoin from '../walletApi/bitcoin'
import * as etherium  from './etheriuem'
import * as tron  from './tron'
import { PendingTransfers } from '../../db/pendingTransfers'
import { SuccessfulTransfers } from '../../db/successfulTransfers'
export const transferToExchangeByIdApi = async(currencyId, txId, userId) => {
    let info
    let resObj
    let userHaveDoc = false
    let checkStatus = () => {
        return null
    }
    const session  = await mongoose.startSession()
    return session.withTransaction(() => {
        return User.findOne({ _id: userId }).session(session)
        .then((user) => {
            if(user) {
                return PendingTransfers.findOne({ userId: userId })
                .then((userPending) => {
                    if(userPending && userPending.userId.toString() === userId.toString()) {
                        userHaveDoc = true
                        let pendingTx = _.find(userPending.transactions, (i) => { return i.txId.toString() === txId.toString() })
                        if(pendingTx) {
                            const error = new myError(
                                'transaction already exsist', 
                                400, 
                                5, 
                                'تراکنش قبلا وجود دارد', 
                                'خطا رخ داد'
                                )
                            throw error
                        }
                    } 
                    return Currencies.findOne({ _id: currencyId })
                    .then((cur) => {
                        let CurAbName = ""
                        if(cur) {
                            CurAbName = cur.ab_name
                            switch(CurAbName) {
                            case "BTC":
                                checkStatus = () => {
                                    return bitcoin.bitcoinTransferToExchangeById(txId)
                                    .then((result) => {
                                        info = result
                                    })
                                    .catch((err) => {
                                        throw err
                                    })
                                }
                            break;
                            case "ETH":
                                return etherium.checkTransaction(txId)
                                .then((transaction) => {
                                    if(transaction && transaction.hash.toString() === txId.toString()) {
                                        let curInWall = _.find(user.wallet, (i) => { return i.currency.toString()=== currencyId.toString()})
                                        if(curInWall) {
                                            curInWall.value += Number(transaction.value)
                                        } else {
    
                                        }
                                            return
                                    } else {
                                        throw "transaction not valid"
                                    }
                                })
                                .catch((err)=>{
                                    console.log("api error: ",err)
                                })
                                //
                            case "TRX":
                                return tron.validateByTXId(txId)
                                .then((transaction: any) => {
                                    if(transaction.result) {
                                        const resObj = {
                                            status:"successful",
                                            txValue : transaction
                                        } 
                                        return resObj 
                                    } else {
                                        const resObj = {
                                            status:"pending",
                                            txValue : transaction
                                        } 
                                    }
                                })
                                .catch((err) => {
                                    throw(err)
                                })
    
                            // default
                            } 
                            return Promise.all([checkStatus()])
                            .then(() => {
                                if(userHaveDoc) {
                                        userPending.transactions.push({
                                            txId:txId,
                                            currencyId:currencyId,
                                            currencyName:CurAbName,
                                            value:info.txAmount,
                                            type:"id"
                                        })
                                        userPending.save()
                                        .then(() => {
                                            if(info.status === 'Confirmed') {
                                                return SuccessfulTransfers.findOne({ userId: userId }).session(session)
                                                .then(async (userSuccess) => {
                                                    if(userSuccess && userSuccess.userId.toString() === userId.toString()) {
                                                        userSuccess.transactions.push({
                                                            txId,
                                                            currencyId,
                                                            currencyName: CurAbName,
                                                            value: info.txAmount,
                                                            type: "id"
                                                        })
                                                        await userSuccess.save()
                                                    } else {
                                                        const usrSuccess = {
                                                            userId:userId,
                                                            transactions: [{
                                                                txId,
                                                                currencyId,
                                                                currencyName: CurAbName,
                                                                value: info.txAmount,
                                                                type: "id"
                                                            }]
                                                        }
                                                        await SuccessfulTransfers.create([usrSuccess], { session })
                                                    }
                                                    return PendingTransfers.findOne({ userId:userId }).session(session)
                                                    .then(async (userPendinAfterSave) => {
                                                        userPendinAfterSave.transactions = _.filter(userPendinAfterSave.transactions, (i) => { return i.txId.toString() !== txId.toString() }) 
                                                        await userPendinAfterSave.save()
                                                        let cur = _.find(user.wallet, (i) => { return i.currency.toString() === currencyId.toString()})
                                                        if(cur) {
                                                            cur.value +=info.txAmount
                                                            await user.save()
                                                        } else {
                                                            user.wallet.push({
                                                                currency: currencyId,
                                                                value: info.txAmount
                                                            })
                                                            await user.save()
                                                        }
                                                        resObj = {
                                                            status: 'successful',
                                                            value: info.txAmount
                                                        }
                                                    }).catch((err)=>{
                                                        throw err
                                                    })
                                                }).catch((err)=>{
                                                    throw err
                                                })
                                            } else {
                                                resObj = {
                                                    status: 'pending',
                                                    value: info.txAmount
                                                }
                                            }
                                        })
                                        .catch((err) => {
                                            throw err
                                        })
                                } else {
                                    const usrPending = {
                                        userId:userId,
                                        transactions: [{
                                            txId,
                                            currencyId,
                                            currencyName: CurAbName,
                                            value: info.txAmount,
                                            type: "id"
                                        }]
                                    }
                                    PendingTransfers.create([usrPending])
                                    .then(() => {
                                        if(info.status === 'Confirmed') {
                                            return SuccessfulTransfers.findOne({ userId: userId }).session(session)
                                            .then(async (userSuccess) => {
                                                if(userSuccess && userSuccess.userId.toString() === userId.toString()) {
                                                    userSuccess.transactions.push({
                                                        txId,
                                                        currencyId,
                                                        currencyName: CurAbName,
                                                        value: info.txAmount,
                                                        type: "id"
                                                    })
                                                    await userSuccess.save()
                                                } else {
                                                    const usrSuccess = {
                                                        userId:userId,
                                                        transactions: [{
                                                            txId,
                                                            currencyId,
                                                            currencyName: CurAbName,
                                                            value: info.txAmount,
                                                            type: "id"
                                                        }]
                                                    }
                                                    await SuccessfulTransfers.create([usrSuccess], { session })
                                                }
                                                return PendingTransfers.findOne({ userId:userId }).session(session)
                                                .then(async (userPendinAfterSave) => {
                                                    userPendinAfterSave.transactions = _.filter(userPendinAfterSave.transactions, (i) => { return i.txId.toString() !== txId.toString() }) 
                                                    await userPendinAfterSave.save()
                                                    let cur = _.find(user.wallet, (i) => { return i.currency.toString() === currencyId.toString()})
                                                    if(cur) {
                                                        cur.value +=info.txAmount
                                                        await user.save()
                                                    } else {
                                                        user.wallet.push({
                                                            currency: currencyId,
                                                            value: info.txAmount
                                                        })
                                                        await user.save()
                                                    }
                                                    resObj = {
                                                        status: 'successful',
                                                        value: info.txAmount
                                                    }
                                                }).catch((err)=>{
                                                    throw err
                                                })
                                            }).catch((err)=>{
                                                throw err
                                            })
                                        } else {
                                            resObj = {
                                                status: 'pending',
                                                value: info.txAmount
                                            }
                                        }
                                    })
                                    .catch((err) => {
                                        throw err
                                    })
                                }
                            })
                            .catch((err) => {
                                throw err
                            })
    
                        } else {
                            const error = new myError(
                                'currency not found', 
                                400, 
                                5, 
                                'ارز مربوطه  پیدا نشد.', 
                                'خطا رخ داد'
                                )
                            throw error
                        }
                    })
                    .catch((err) => {
                        throw err
                    })
                })
                .catch((err) => {
                    throw err
                })
            } else {
                const error = new myError(
                    'user not found', 
                    400, 
                    5, 
                    'کاربر پیدا نشد.', 
                    'خطا رخ داد'
                    )
                throw error 
            }
        })
        .catch((err) => {
            throw err
        })
    })
    .then(() => {
        return resObj
    })
    .catch((err) => {
        throw ("error in with Transaction"+ ":" + err)
    })
    .finally(() => {
        session.endSession()
    })
}

