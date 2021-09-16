const Client = require('bitcoin-core')
import { conformsTo } from 'lodash'
import myError from '../myError'
import { Currencies } from '../../db/currencies'
export const transferToExchangeApi = async(currencyId,signedRawTxHex,value) => {
    Currencies.findOne({_id:currencyId})
    .then((cur)=>{
        let CurAbName = ""
        if(cur){
            value = Number(value)
            CurAbName = cur.ab_name
            switch(CurAbName) {
                case "BTC":
                    // const client = new Client({ 
                    //     network: 'testnet', 
                    //     username: 'polychain', 
                    //     password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce', 
                    //     host:"127.0.0.1",
                    //     port:8332 
                    //     })
                    // client.decodeRawTransaction(signedRawTxHex)
                    // .then((tx) => {
                    //     if(tx) {
                    //         const txValue = Number(tx[0].vout[0].value)
                    //         if(txValue===Number(value)) {
                    //             client.sendRawTransaction(signedRawTxHex)
                    //             .then((txHashOrId) => {
                    //                 return txHashOrId
                    //             })
                    //             .catch((err) => {
                    //                 throw(err)    
                    //             })
                    //         } else {
                    //             //
                    //         }
                        
                    //     } else {
                    //         //
                    //     }
                    // })
                    // .catch((err) => {
                    //     throw err
                    // })   
                    break;
                
                case "ETH":
                    //
                break;
                
                case "TRX":
                    //
                break;
                
            }
        }else{
            const error = new myError(
                'currency not found', 
                400, 
                5, 
                'ارز مربوطه  پیدا نشد.', 
                'خطا رخ داد'
                )
            throw error
        }  
    }).catch((err)=>{
        throw err
    })
        
}       

