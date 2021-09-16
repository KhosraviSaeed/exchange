const Client = require('bitcoin-core')
import myError from '../myError'
import * as _ from 'lodash'

export const bitcoinTransferFromExchange = async(value, receiver) => {
    const client = new Client({ 
        network: 'testnet', 
        username: 'polychain', 
        password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce', 
        host:"127.0.0.1",
        port:8332 
    })
    const query_options = { 
                            "minimumAmount":value,       
                            //"maximumAmount":value,       
                            "maximumCount":1 ,             
                        }
    return client.listUnspent(0, 9999999, [], true, query_options)
    .then((unspentTx) => {
        if(unspentTx[0]) {
            const txid = unspentTx[0].txid
            const vout = unspentTx[0].vout
            const txValue =  unspentTx[0].amount
            let txFee = value*(0.001)
            const StxFee = txFee.toFixed(8)
            const totalValue =  Number(value) + Number(StxFee)
            let change = txValue - totalValue
            const Schange = change.toFixed(8)
            const nodeAddress = unspentTx[0].address
            const input = [{                
                            "txid": txid,        
                            "vout": vout,                                   
                        }]
            let output = []
            let obj = {}
            let obj_2 ={}
            obj[receiver] = value
            obj_2[nodeAddress] = Schange
            output.push(obj,obj_2)
            return client.createRawTransaction(input,output)
            .then((txHex) => {
                return client.signRawTransactionWithWallet(txHex)
                .then((sinedHex) => {
                    return client.sendRawTransaction(sinedHex.hex)
                    .then((txHashOrId) => {
                        return txHashOrId
                    })
                    .catch((err) => {
                        console.log("error in sendsigned",err)
                        throw err
                    })
                })
                .catch((err)=>{
                    console.log("error in sign ",err)
                    throw err
                })
            })
            .catch((err )=> {
                console.log("error in create raw tx",err)
                throw err
            })     
        } else {
            const error = new myError(
                'you do not have unspent trancaction', 
                400, 
                5, 
                'تراکنش خرج نشده پیدا نشد', 
                'خطا رخ داد'
                )
            throw error
        }  
    })
    .catch((err) => {
        console.log("error in lisutxo",err)
        throw err
    })
}


export const bitcoinTransferToExchangeById = async(txId) => {
    const btcAddress = ["tb1qfpf6lss60wmle9wanetjxjjt6lc6z65mapk50s"]
    const client = new Client({ 
        network: 'testnet', 
        username: 'polychain', 
        password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce', 
        host: "127.0.0.1",
        port: 8332 
    })
    return client.getTransaction(txId)
    .then((txInfo) => {
        if(txInfo){
            const tx = _.find(txInfo.details, (i) => { return i.category.toString() === "receive" && btcAddress.includes(i.address.toString())})
            if(tx) {
                let status
                if(txInfo.confirmations>=6)
                {
                    status = "Confirmed"
                }else{
                    status = "pending"
                }
                const info = {
                "txAddress":tx.address,
                "txAmount":tx.amount,
                "status":status
                }
                return info
            } else {
                const error = new myError(
                'tx not found', 
                400, 
                5, 
                'تراکنش یافت نشد', 
                'خطا رخ داد'
                )
                throw error
            }
        } else {
            const error = new myError(
                'transaction  not found', 
                400, 
                5, 
                'تراکنش  مربوطه  پیدا نشد.', 
                'خطا رخ داد'
                )
            throw error
        }
    })
    .catch((err) => {
        throw err
    })
}

