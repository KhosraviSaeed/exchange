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
exports.transferToApi = void 0;
var Client = require('bitcoin-core');
exports.transferToApi = function (currency, value, receiver) { return __awaiter(void 0, void 0, void 0, function () {
    var client_1, query_options;
    return __generator(this, function (_a) {
        switch (currency) {
            case "BTC":
                client_1 = new Client({
                    network: 'testnet',
                    username: 'polychain',
                    password: '3QtnxrB7P5y4EpBdad1MkCeB2RHmArvcarw7udgXsAce',
                    host: "127.0.0.1",
                    port: 8332
                });
                query_options = {
                    "minimumAmount": value
                };
                client_1.listUnspent(1, 1, [], true, query_options)
                    .then(function (unspentTx) {
                    if (unspentTx[0]) {
                        var txid = unspentTx[0].txid;
                        var txValue = Number(unspentTx[0].amount);
                        var change = txValue - value;
                        var nodeAddress_1 = unspentTx[0].address;
                        var input = [{
                                "txid": txid,
                                "vout": Number(txValue)
                            }];
                        var output = [
                            {
                                "receiver": txValue,
                                "nodeAddress": change
                            },
                            {
                                "data": "Hi"
                            },
                        ];
                        client_1.createRawTransaction(input, output)
                            .then(function (txHex) {
                            client_1.dumpprivkey(nodeAddress_1)
                                .then(function (priKey) {
                                client_1.signRawTransactionWithKey(txHex, [priKey])
                                    .then(function (sinedHex) {
                                    client_1.sendRawTransaction(sinedHex)
                                        .then(function (txHashOrId) {
                                        return txHashOrId;
                                    })["catch"](function (err) {
                                        throw (err);
                                    });
                                })["catch"](function (err) {
                                    throw (err);
                                });
                            })["catch"](function (err) {
                                throw (err);
                            });
                        })["catch"](function (err) {
                            throw (err);
                        });
                    }
                    else {
                        // throw err
                    }
                })["catch"](function (err) {
                    console.log('the error is', err);
                });
                break;
            case "ETH":
                //
                break;
            case "TRX":
                //
                break;
        }
        return [2 /*return*/];
    });
}); };
