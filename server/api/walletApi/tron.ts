import * as tronWeb from 'tronweb'
// import { Currencies } from '../db/currencies';
// import { User } from '../db/user'
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

export async function validateByTXId(hash){

    const systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5'

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

}


export async function TRONTransferFrom(destAccount, am){
    const systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5'
    const amount = am * 1000000


        const HttpProvider = tronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const TronWeb = new tronWeb(fullNode,solidityNode,eventServer,systemPrivateKey);
        TronWeb.trx.sendTransaction(destAccount, amount)
        .then((transaction) => {

            return transaction
            
        })
        .catch((err) => {
            console.log("Error : ", err)
            throw(err)
        })
}