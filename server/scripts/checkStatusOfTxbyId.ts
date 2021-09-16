import * as mongoose from 'mongoose'
import * as _ from 'lodash'

import { PendingTransfers } from '../db/pendingTransfers'
import { SuccessfulTransfers } from '../db/successfulTransfers'

import * as redis from '../api/redis'
import * as bitcoin from '../api/walletApi/bitcoin'
import * as etherium  from '../api/walletApi/etheriuem'
import * as tron  from '../api/walletApi/tron'
 
const checkStatusOfTxById = () => {
    return PendingTransfers.find()
    .then((txs) => {
        return txs.map((e) => {
            let info
            let resObj
            return redis.hashGetAll(e.currencyId.toString())
            .then(async (curObj: any) => {
                if (curObj) {
                    switch (curObj.currencyName) {
                        case 'BTC':
                            bitcoin.bitcoinTransferToExchangeById(e.txId)
                            .then((result) => {
                                info = result
                            })
                            .catch((err) => {
                                throw err
                            })
                            break;

                        case 'ETH':
                            break;
                            
                        case 'TRX':
                            break;        
                    
                        default:
                            break;
                    }
                    if(info.status === 'Confirmed') {
                        const session  = await mongoose.startSession()
                        return session.withTransaction(async () => {
                            return SuccessfulTransfers.findOne({ userId: e.userId }).session(session)
                            .then(async (doc) => {
                                if (!doc) {
                                    const successDoc = {
                                        userId: e.userId,
                                        transactions: [{
                                            txId: e.txId,
                                            currencyId: e.currencyId,
                                            currencyName: e.currencyName,
                                            value: e.value,
                                            type: e.type
                                        }]
                                    }
                                    await SuccessfulTransfers.create([successDoc], { session })
                                    await e.remove()
                                } else {
                                    const theTx = _.find(doc.transactions, (v) => v.txId === e.txId)
                                    if (!theTx) {
                                        doc.transactions.push({
                                            txId: e.txId,
                                            currencyId: e.currencyId,
                                            currencyName: e.currencyName,
                                            value: e.value,
                                            type: e.type
                                        })
                                        await doc.save()
                                        await e.remove()
                                    } else {
                                        console.log('reapeted tx!')
                                        await e.remove()
                                        return
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                return
                            })
                        })
                        .then(() => {
                            return resObj
                        })
                        .catch((err) => {
                            console.log(err)
                            return
                        })
                        .finally(() => {
                            session.endSession()
                        })
                    } else {
                        return 
                    }
                } else {
                    console.log('No currency info')
                    return
                }
            })
            .catch((err) => {
                console.log(err)
                return
            })
        })
    })
    .catch((err) => {
        console.log(err)
    })
}

export default checkStatusOfTxById;