import myError from '../myError'
import { Currencies } from '../../db/currencies'
import * as bitcoin from '../walletApi/bitcoin'
import * as etheriuem from '../walletApi/etheriuem'
import * as tron from '../walletApi/tron'
import * as mongoose from 'mongoose'
import { User } from '../../db/user'
import * as _ from 'lodash'
import { PendingTransfers } from '../../db/pendingTransfers'
import { SuccessfulTransfers } from '../../db/successfulTransfers'

export const transferFromExchangeApi = async(currencyId, value, receiver, userId) => {
    let info
    let resObj
    let checkStatus = () => {
        return null
    }
    const session  = await mongoose.startSession()
            return session.withTransaction(async() => {
                return User.findOne({_id:userId}).session(session)
                .then(async (user)=>{
                    if(user){
                        return Currencies.findOne({_id:currencyId})
                            .then(async(cur) => {
                                let CurAbName = ""
                                if(cur){
                                    let curInWall = _.find(user.wallet, (i) => { return i.currency.toString() === currencyId.toString()})
                                    if(curInWall) {
                                     
                                        if(curInWall.value >= Number(value)){
                                            CurAbName = cur.ab_name
                                            switch(CurAbName) {
                                                case "BTC":
                                                    checkStatus = () => {
                                                        return bitcoin.bitcoinTransferFromExchange(value,receiver)
                                                        .then((txHash) => {
                                                            info  = {
                                                                status:"pending",
                                                                txHash:txHash
                                                            }
                                                        })
                                                        .catch((err)=>{
                                                            throw err
                                                        })
                                                    }
                                                   
                                       
                                                case "ETH":
                                                    return etheriuem.sendEther(receiver.toString(),value)
                                                    .then(async (result) => {
                                                        if(result&&result.transactionHash) {
                                                            const bodySuccessfulOffer = {
                                                                userId: user._id ,
                                                                transactions : []
                                                            }
                                                            const bodyTransaction = {
                                                                txId : result.transactionHash,
                                                                currencyId : currencyId,
                                                                currencyName : CurAbName,
                                                                value : Number(value),
                                                                type :  'send'
                                                            }
                                                            bodySuccessfulOffer.transactions.push(bodyTransaction)
                                                        } else if(result) {
                                                            throw ("could not get any transaction "+ result)
                                                        } else {
                                                        throw ("could not get result ")
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        throw err
                                                    })
                                       
                                                case "TRX":
                                                }
                                                return Promise.all([checkStatus()])
                                                .then(() =>{
                                                    return PendingTransfers.findOne({ userId:userId }).session(session)
                                                        .then(async (userPending) => {
                                                            if(userPending){
                                                                userPending.transactions.push({
                                                                    txId: info.txHash,
                                                                    currencyId: currencyId,
                                                                    currencyName: CurAbName,
                                                                    value: value,
                                                                    type: "send"
                                                                })
                                                                await userPending.save()
                                                                
                                                            } else {
                                                                const usrPending = {
                                                                    userId: userId,
                                                                    transactions: [{
                                                                        txId: info.txHash,
                                                                        currencyId: currencyId,
                                                                        currencyName: CurAbName,
                                                                        value: value,
                                                                        type: "id"
                                                                        }]
                                                                    }
                                                                    await PendingTransfers.create([usrPending],{ session })
                                                                }
                                                            curInWall.value -= value
                                                            await user.save()
                                                            resObj = 
                                                                {
                                                                    status:"success",
                                                                    txValue:value,
                                                                    txHash:info.txHash
                                                                }
                                                        }).catch((err)=>{
                                                            throw err
                                                        })
                                                }).catch((err)=>{
                                                    throw err
                                                })
                                             
                                        } else {
                                            const error = new myError(
                                                'you do not have enough currency ', 
                                                400, 
                                                5, 
                                                'موجودی کافی نمی باشد', 
                                                'خطا رخ داد'
                                                )
                                                throw error
                                            }
                                     
                                    } else {
                                        const error = new myError(
                                            'currency not found in user wallet', 
                                            400, 
                                            5, 
                                            'ارز در کیف پول پیدا نشد', 
                                            'خطا رخ داد'
                                            )
                                        throw error
                                 
                                    } 
   
                                   

                                } else {
                                    const error = new myError(
                                        'currency not found', 
                                        400, 
                                        5, 
                                        'ارز پیدا نشد', 
                                        'خطا رخ داد'
                                        )
                                    throw error
                                }

                            }).catch((err)=>{
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
                }).catch((err)=>{
                    throw err
                })
            })
            .then(() => {
            
                return resObj
                 
          
            })
            .catch((err) => {
                console.log("error in with Transaction",err)
               throw("error in with transaction")
            })
            .finally(() => {
                session.endSession()
            })
        

    .catch((err) => {
        throw err
    })
}
