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
exports.bitcoinTransferToExchangeById = exports.bitcoinTransferFromExchange = void 0;
var Client = require('bitcoin-core');
var myError_1 = require("../myError");
var _ = require("lodash");
exports.bitcoinTransferFromExchange = function (value, receiver) { return __awaiter(void 0, void 0, void 0, function () {
    var client, query_options;
    return __generator(this, function (_a) {
        client = new Client({
            network: 'testnet',
            username: 'polychain',
            password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce',
            host: "127.0.0.1",
            port: 8332
        });
        query_options = {
            "minimumAmount": value,
            //"maximumAmount":value,       
            "maximumCount": 1
        };
        return [2 /*return*/, client.listUnspent(0, 9999999, [], true, query_options)
                .then(function (unspentTx) {
                if (unspentTx[0]) {
                    var txid = unspentTx[0].txid;
                    var vout = unspentTx[0].vout;
                    var txValue = unspentTx[0].amount;
                    var txFee = value * (0.001);
                    var StxFee = txFee.toFixed(8);
                    var totalValue = Number(value) + Number(StxFee);
                    var change = txValue - totalValue;
                    var Schange = change.toFixed(8);
                    var nodeAddress = unspentTx[0].address;
                    var input = [{
                            "txid": txid,
                            "vout": vout
                        }];
                    var output = [];
                    var obj = {};
                    var obj_2 = {};
                    obj[receiver] = value;
                    obj_2[nodeAddress] = Schange;
                    output.push(obj, obj_2);
                    return client.createRawTransaction(input, output)
                        .then(function (txHex) {
                        return client.signRawTransactionWithWallet(txHex)
                            .then(function (sinedHex) {
                            return client.sendRawTransaction(sinedHex.hex)
                                .then(function (txHashOrId) {
                                return txHashOrId;
                            })["catch"](function (err) {
                                console.log("error in sendsigned", err);
                                throw err;
                            });
                        })["catch"](function (err) {
                            console.log("error in sign ", err);
                            throw err;
                        });
                    })["catch"](function (err) {
                        console.log("error in create raw tx", err);
                        throw err;
                    });
                }
                else {
                    var error = new myError_1["default"]('you do not have unspent trancaction', 400, 5, 'تراکنش خرج نشده پیدا نشد', 'خطا رخ داد');
                    throw error;
                }
            })["catch"](function (err) {
                console.log("error in lisutxo", err);
                throw err;
            })];
    });
}); };
exports.bitcoinTransferToExchangeById = function (txId) { return __awaiter(void 0, void 0, void 0, function () {
    var btcAddress, client;
    return __generator(this, function (_a) {
        btcAddress = ["tb1qfpf6lss60wmle9wanetjxjjt6lc6z65mapk50s"];
        client = new Client({
            network: 'testnet',
            username: 'polychain',
            password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce',
            host: "127.0.0.1",
            port: 8332
        });
        return [2 /*return*/, client.getTransaction(txId)
                .then(function (txInfo) {
                if (txInfo) {
                    var tx = _.find(txInfo.details, function (i) { return i.category.toString() === "receive" && btcAddress.includes(i.address.toString()); });
                    if (tx) {
                        var status_1;
                        if (txInfo.confirmations >= 6) {
                            status_1 = "Confirmed";
                        }
                        else {
                            status_1 = "pending";
                        }
                        var info = {
                            "txAddress": tx.address,
                            "txAmount": tx.amount,
                            "status": status_1
                        };
                        return info;
                    }
                    else {
                        var error = new myError_1["default"]('tx not found', 400, 5, 'تراکنش یافت نشد', 'خطا رخ داد');
                        throw error;
                    }
                }
                else {
                    var error = new myError_1["default"]('transaction  not found', 400, 5, 'تراکنش  مربوطه  پیدا نشد.', 'خطا رخ داد');
                    throw error;
                }
            })["catch"](function (err) {
                throw err;
            })];
    });
}); };
