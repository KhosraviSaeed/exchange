"use strict";
exports.__esModule = true;
exports.TRONTransferFrom = exports.validateByTXId = void 0;
var tronWeb = require("tronweb");
var currencies_1 = require("../db/currencies");
var user_1 = require("../db/user");
var _ = require("lodash");
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
function validateByTXId(userId, hash) {
    var systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5';
    user_1.User.findOne({ _id: userId })
        .then(function (user) {
        if (user && user._id.toString() === userId.toString()) {
            var HttpProvider = tronWeb.providers.HttpProvider;
            var fullNode = new HttpProvider("https://api.shasta.trongrid.io");
            var solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
            var eventServer = new HttpProvider("https://api.shasta.trongrid.io");
            var TronWeb = new tronWeb(fullNode, solidityNode, eventServer, systemPrivateKey);
            console.log("here : ", TronWeb);
            TronWeb.trx.getTransaction(hash.toString())
                .then(function (transaction) {
                return transaction;
            })["catch"](function (err) { throw (err); });
        }
        else {
            var error = 'user not fount';
            console.log('Error in TRONTransferTo : ', error);
            throw (error);
        }
    });
}
exports.validateByTXId = validateByTXId;
function TRONTransferFrom(userId, destAccount, am) {
    var systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5';
    var tronId = undefined;
    var amount = am * 1000000;
    currencies_1.Currencies.findOne({ name: "TRON" })
        .then(function (curTRONObj) {
        tronId = curTRONObj._id;
        user_1.User.findOne({ _id: userId })
            .then(function (user) {
            if (user && user._id.toString() === userId.toString()) {
                var userTronWal_1 = _.find(user.wallet, function (e) { return e.currency.toString() === tronId.toString(); });
                if (userTronWal_1.value >= am) {
                    var HttpProvider = tronWeb.providers.HttpProvider;
                    var fullNode = new HttpProvider("https://api.shasta.trongrid.io");
                    var solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
                    var eventServer = new HttpProvider("https://api.shasta.trongrid.io");
                    var TronWeb = new tronWeb(fullNode, solidityNode, eventServer, systemPrivateKey);
                    TronWeb.trx.sendTransaction(destAccount, amount)
                        .then(function (transaction) {
                        if (transaction.result) {
                            userTronWal_1.value = userTronWal_1.value - am;
                            user.save();
                            console.log("Transaction to destination account done. ");
                        }
                        else {
                            var error = "Transaciton Failed";
                            console.log(error);
                            throw (error);
                        }
                    })["catch"](function (err) {
                        console.log("Error : ", err);
                        throw (err);
                    });
                }
                else {
                    var error = "user does not have enough TRON currency in his/her wallet";
                    console.log(error);
                    throw (error);
                }
            }
            else {
                var error = 'user not fount';
                console.log('Error in TRONTransferTo : ', error);
                throw (error);
            }
        })["catch"](function (err) {
            console.log('Error in TRONTransferTo : ', err);
            throw (err);
        });
    })["catch"](function (err) {
        console.log(err);
        throw (err);
    });
}
exports.TRONTransferFrom = TRONTransferFrom;
