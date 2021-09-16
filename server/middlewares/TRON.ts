import * as tronWeb from 'tronweb'
import { Currencies } from '../db/currencies';
import { User } from '../db/user'
import * as _ from 'lodash'

// export function TRONTransferTo(userId, systemAccount, userAccount, privateKey, amount){

//     User.findOne({ _id : userId })
//     .then((user) => {

//         if(user && user._id.toString() === userId.toString()){
//             const HttpProvider = tronWeb.providers.HttpProvider;
//             const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
//             const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
//             const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
//             const tw = new tronWeb(fullNode,solidityNode,eventServer,privateKey);
//             const am = amount * 1000000
//             tw.trx.getAccount(userAccount.toString()).then((usrAcc) =>{
//                 if(usrAcc){
//                 tw.trx.sendTransaction(systemAccount, am)

//                 }else{
//                     const error = "user Tron Account not fount"
//                     console.log("Error in TRONTransferTo : ", error)
//                 }
                
//             })
//             .catch((err) => console.log(err))
            

//         }else{
//             const error = 'user not fount'
//             console.log('Error in TRONTransferTo : ', error)
//         }

//     })
//     .catch((err) => console.log('Error in TRONTransferTo : ', err))

// }

export function validateByTXId(userId, hash){
    const systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5'
    User.findOne({ _id : userId })
    .then((user) => {
        if(user && user._id.toString() === userId.toString()){

            const HttpProvider = tronWeb.providers.HttpProvider;
            const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
            const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
            const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
            const TronWeb = new tronWeb(fullNode,solidityNode,eventServer,systemPrivateKey);
            console.log("here : ", TronWeb)
            TronWeb.trx.getTransaction(hash.toString())
            .then((transaction) => {
                return transaction
            })
            .catch((err) => {throw(err)})

        }else{
            const error = 'user not fount'
            console.log('Error in TRONTransferTo : ', error)
            throw(error)
        }
    })

}


export function TRONTransferFrom(userId, destAccount, am){
    const systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5'
    let tronId = undefined
    const amount = am * 1000000

    Currencies.findOne({name : "TRON"})
    .then((curTRONObj) => {
        tronId = curTRONObj._id
        User.findOne({ _id : userId })
        .then((user) => {
            if(user && user._id.toString() === userId.toString()){

                let userTronWal = _.find(user.wallet, (e) => e.currency.toString() === tronId.toString())
                if(userTronWal.value >= am){

                    const HttpProvider = tronWeb.providers.HttpProvider;
                    const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
                    const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
                    const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
                    const TronWeb = new tronWeb(fullNode,solidityNode,eventServer,systemPrivateKey);
                    TronWeb.trx.sendTransaction(destAccount, amount)
                    .then((transaction) => {

                        if(transaction.result){

                            userTronWal.value = userTronWal.value - am
                            user.save()
                            console.log("Transaction to destination account done. ")
    
                        }else{
                            const error = "Transaciton Failed"
                            console.log(error)
                            throw(error)
                        }

                    })
                    .catch((err) => {
                        console.log("Error : ", err)
                        throw(err)
                    })

                }else{
                    const error = "user does not have enough TRON currency in his/her wallet"
                    console.log(error)
                    throw(error)
                }

            }else{
                const error = 'user not fount'
                console.log('Error in TRONTransferTo : ', error)
                throw(error)
            }
        })
        .catch((err) => {
            console.log('Error in TRONTransferTo : ', err)
            throw(err)
        })

    })
    .catch((err) => {
        console.log(err)
        throw(err)
    })
}