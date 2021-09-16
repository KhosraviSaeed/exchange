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
exports.getAccounts = exports.receiveEtherFromClient = exports.sendEther = exports.getEtheriumNonce = exports.checkTransaction = exports.getBalance = exports.createPersonalAccount = exports.createAccount = void 0;
var ethereumjs_common_1 = require("ethereumjs-common");
var Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
exports.createAccount = function () {
    var web3 = new Web3("http://localhost:8545");
    var data = web3.eth.accounts.create();
    return data;
};
exports.createPersonalAccount = function () {
    var web3 = new Web3("http://localhost:8545");
    return web3.eth.personal.newAccount("exchange")
        .then(function (result) {
        return result;
    })["catch"](function (err) {
        console.log(err);
    });
};
exports.getBalance = function (account) { return __awaiter(void 0, void 0, void 0, function () {
    var web3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Web3("http://localhost:8545")];
            case 1:
                web3 = _a.sent();
                return [2 /*return*/, web3.eth.getBalance(account.toString())
                        .then(function (balance) {
                        return balance;
                    })["catch"](function (err) {
                        throw err;
                    })];
        }
    });
}); };
exports.checkTransaction = function (transactionId) { return __awaiter(void 0, void 0, void 0, function () {
    var web3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Web3("http://localhost:8545")];
            case 1:
                web3 = _a.sent();
                return [2 /*return*/, web3.eth.getTransactionReceipt(transactionId)
                        .then(function (txR) {
                        if (txR.blockNumber == undefined) {
                            throw "transaction receipt not found";
                        }
                        else {
                            return web3.eth.getTransaction(transactionId)
                                .then(function (tx) {
                                if (tx.blockNumber == undefined || tx.value == undefined) {
                                    throw "transaction receipt not found";
                                }
                                else {
                                    return tx;
                                }
                            })["catch"](function (err) {
                                throw err;
                            });
                        }
                    })["catch"](function (err) {
                        throw (err);
                    })];
        }
    });
}); };
exports.getEtheriumNonce = (function (address) {
    var web3 = new Web3("http://localhost:8545");
    return web3.eth.getTransactionCount(address, 'pending')
        .then(function (nonce) {
        //got nonce proceed with creating and signing transaction
        return nonce;
    })["catch"](function (err) {
        throw err;
    });
});
exports.sendEther = function (account, value) { return __awaiter(void 0, void 0, void 0, function () {
    var web3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Web3("http://localhost:8545")];
            case 1:
                web3 = _a.sent();
                //unlock it for a period of 15 secs
                return [2 /*return*/, web3.eth.personal.unlockAccount("0x868453967f6806ef86de7cf5e57a32ab28b875b4", "exchange", 15000)
                        .then(function (unlocked) {
                        return web3.eth.sendTransaction({
                            //from: process.env.ADMIN_ETHERIUM_ACCOUNT_ADDRESS,
                            from: '0x868453967f6806ef86de7cf5e57a32ab28b875b4',
                            to: account.toString(),
                            value: web3.utils.toWei(value.toString())
                        })
                            .then(function (receipt) {
                            // then lock it
                            return web3.eth.personal.lockAccount("0x868453967f6806ef86de7cf5e57a32ab28b875b4")
                                .then(function () {
                                return receipt;
                            })["catch"](function (err) {
                                return receipt;
                            });
                        })["catch"](function (err) {
                            throw err;
                        });
                    })["catch"](function (err) {
                        throw (err);
                    })];
        }
    });
}); };
exports.receiveEtherFromClient = function (transactionHash) {
    //receive transaction from the ui and send it
    var web3 = new Web3("http://localhost:8545");
    var rawTx = undefined;
    var transaction = undefined;
    //custom network
    var customCommon = ethereumjs_common_1["default"].forCustomChain('mainnet', {
        name: 'my-network',
        networkId: 1981,
        chainId: 1981
    }, 'petersburg');
    var preData = function () {
        var privateKey = Buffer.from('64061456066baa81c5097c895b5176fb3e1452eaf6f6776e2d7bf07ddb9accfe', 'hex');
        //parameters should be hex string starting with 0x
        var txParams = {
            nonce: '0x01',
            gas: 50002,
            gasPrice: Number(web3.utils.toWei('601', 'gwei')),
            to: '0x868453967f6806ef86de7cf5e57a32ab28b875b4',
            value: 10000003
        };
        // The second parameter is not necessary if these values are used
        var tx = new Tx(txParams, { common: customCommon });
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        return rawTx = '0x' + serializedTx.toString('hex');
    };
    return Promise.all([preData()])
        .then(function () {
        return web3.eth.sendSignedTransaction(rawTx)
            .then(function (result) {
            return result;
        })["catch"](function (err) {
            throw err;
        });
    })["catch"](function (err) {
        throw err;
    });
};
exports.getAccounts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var web3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Web3("http://localhost:8545")];
            case 1:
                web3 = _a.sent();
                return [2 /*return*/, web3.eth.getAccounts()
                        .then(function (result) {
                        console.log("all acounts is ", result);
                    })["catch"](function (err) {
                        throw err;
                    })];
        }
    });
}); };
