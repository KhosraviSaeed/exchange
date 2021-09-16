"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TRONTransferFrom = exports.validateByTXId = void 0;
var tronWeb = require("tronweb");
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
function validateByTXId(hash) {
    return __awaiter(this, void 0, void 0, function () {
        var systemPrivateKey, HttpProvider, fullNode, solidityNode, eventServer, TronWeb;
        return __generator(this, function (_a) {
            systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5';
            HttpProvider = tronWeb.providers.HttpProvider;
            fullNode = new HttpProvider("https://api.shasta.trongrid.io");
            solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
            eventServer = new HttpProvider("https://api.shasta.trongrid.io");
            TronWeb = new tronWeb(fullNode, solidityNode, eventServer, systemPrivateKey);
            console.log("here : ", TronWeb);
            TronWeb.trx.getTransaction(hash.toString())
                .then(function (transaction) {
                return transaction;
            })["catch"](function (err) { throw (err); });
            return [2 /*return*/];
        });
    });
}
exports.validateByTXId = validateByTXId;
function TRONTransferFrom(destAccount, am) {
    return __awaiter(this, void 0, void 0, function () {
        var systemPrivateKey, amount, HttpProvider, fullNode, solidityNode, eventServer, TronWeb;
        return __generator(this, function (_a) {
            systemPrivateKey = '4a8f251556d19ab6625c0cc012a3c534bf978e6a099d0bb8f42d6539579a10c5';
            amount = am * 1000000;
            HttpProvider = tronWeb.providers.HttpProvider;
            fullNode = new HttpProvider("https://api.shasta.trongrid.io");
            solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
            eventServer = new HttpProvider("https://api.shasta.trongrid.io");
            TronWeb = new tronWeb(fullNode, solidityNode, eventServer, systemPrivateKey);
            TronWeb.trx.sendTransaction(destAccount, amount)
                .then(function (transaction) {
                return transaction;
            })["catch"](function (err) {
                console.log("Error : ", err);
                throw (err);
            });
            return [2 /*return*/];
        });
    });
}
exports.TRONTransferFrom = TRONTransferFrom;
