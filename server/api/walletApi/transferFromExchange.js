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
exports.transferFromExchangeApi = void 0;
var myError_1 = require("../myError");
var currencies_1 = require("../../db/currencies");
var bitcoin = require("../walletApi/bitcoin");
var etheriuem = require("../walletApi/etheriuem");
var mongoose = require("mongoose");
var user_1 = require("../../db/user");
var _ = require("lodash");
var pendingTransfers_1 = require("../../db/pendingTransfers");
exports.transferFromExchangeApi = function (currencyId, value, receiver, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var info, resObj, checkStatus, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                checkStatus = function () {
                    return null;
                };
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                return [2 /*return*/, session.withTransaction(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, user_1.User.findOne({ _id: userId }).session(session)
                                    .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                    var error;
                                    return __generator(this, function (_a) {
                                        if (user) {
                                            return [2 /*return*/, currencies_1.Currencies.findOne({ _id: currencyId })
                                                    .then(function (cur) { return __awaiter(void 0, void 0, void 0, function () {
                                                    var CurAbName, curInWall_1, error, error, error;
                                                    return __generator(this, function (_a) {
                                                        CurAbName = "";
                                                        if (cur) {
                                                            curInWall_1 = _.find(user.wallet, function (i) { return i.currency.toString() === currencyId.toString(); });
                                                            if (curInWall_1) {
                                                                if (curInWall_1.value >= Number(value)) {
                                                                    CurAbName = cur.ab_name;
                                                                    switch (CurAbName) {
                                                                        case "BTC":
                                                                            checkStatus = function () {
                                                                                return bitcoin.bitcoinTransferFromExchange(value, receiver)
                                                                                    .then(function (txHash) {
                                                                                    info = {
                                                                                        status: "pending",
                                                                                        txHash: txHash
                                                                                    };
                                                                                })["catch"](function (err) {
                                                                                    throw err;
                                                                                });
                                                                            };
                                                                        case "ETH":
                                                                            return [2 /*return*/, etheriuem.sendEther(receiver.toString(), value)
                                                                                    .then(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                    var bodySuccessfulOffer, bodyTransaction;
                                                                                    return __generator(this, function (_a) {
                                                                                        if (result && result.transactionHash) {
                                                                                            bodySuccessfulOffer = {
                                                                                                userId: user._id,
                                                                                                transactions: []
                                                                                            };
                                                                                            bodyTransaction = {
                                                                                                txId: result.transactionHash,
                                                                                                currencyId: currencyId,
                                                                                                currencyName: CurAbName,
                                                                                                value: Number(value),
                                                                                                type: 'send'
                                                                                            };
                                                                                            bodySuccessfulOffer.transactions.push(bodyTransaction);
                                                                                        }
                                                                                        else if (result) {
                                                                                            throw ("could not get any transaction " + result);
                                                                                        }
                                                                                        else {
                                                                                            throw ("could not get result ");
                                                                                        }
                                                                                        return [2 /*return*/];
                                                                                    });
                                                                                }); })["catch"](function (err) {
                                                                                    throw err;
                                                                                })];
                                                                        case "TRX":
                                                                    }
                                                                    return [2 /*return*/, Promise.all([checkStatus()])
                                                                            .then(function () {
                                                                            return pendingTransfers_1.PendingTransfers.findOne({ userId: userId }).session(session)
                                                                                .then(function (userPending) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                var usrPending;
                                                                                return __generator(this, function (_a) {
                                                                                    switch (_a.label) {
                                                                                        case 0:
                                                                                            if (!userPending) return [3 /*break*/, 2];
                                                                                            userPending.transactions.push({
                                                                                                txId: info.txHash,
                                                                                                currencyId: currencyId,
                                                                                                currencyName: CurAbName,
                                                                                                value: value,
                                                                                                type: "send"
                                                                                            });
                                                                                            return [4 /*yield*/, userPending.save()];
                                                                                        case 1:
                                                                                            _a.sent();
                                                                                            return [3 /*break*/, 4];
                                                                                        case 2:
                                                                                            usrPending = {
                                                                                                userId: userId,
                                                                                                transactions: [{
                                                                                                        txId: info.txHash,
                                                                                                        currencyId: currencyId,
                                                                                                        currencyName: CurAbName,
                                                                                                        value: value,
                                                                                                        type: "id"
                                                                                                    }]
                                                                                            };
                                                                                            return [4 /*yield*/, pendingTransfers_1.PendingTransfers.create([usrPending], { session: session })];
                                                                                        case 3:
                                                                                            _a.sent();
                                                                                            _a.label = 4;
                                                                                        case 4:
                                                                                            curInWall_1.value -= value;
                                                                                            return [4 /*yield*/, user.save()];
                                                                                        case 5:
                                                                                            _a.sent();
                                                                                            resObj =
                                                                                                {
                                                                                                    status: "success",
                                                                                                    txValue: value,
                                                                                                    txHash: info.txHash
                                                                                                };
                                                                                            return [2 /*return*/];
                                                                                    }
                                                                                });
                                                                            }); })["catch"](function (err) {
                                                                                throw err;
                                                                            });
                                                                        })["catch"](function (err) {
                                                                            throw err;
                                                                        })];
                                                                }
                                                                else {
                                                                    error = new myError_1["default"]('you do not have enough currency ', 400, 5, 'موجودی کافی نمی باشد', 'خطا رخ داد');
                                                                    throw error;
                                                                }
                                                            }
                                                            else {
                                                                error = new myError_1["default"]('currency not found in user wallet', 400, 5, 'ارز در کیف پول پیدا نشد', 'خطا رخ داد');
                                                                throw error;
                                                            }
                                                        }
                                                        else {
                                                            error = new myError_1["default"]('currency not found', 400, 5, 'ارز پیدا نشد', 'خطا رخ داد');
                                                            throw error;
                                                        }
                                                        return [2 /*return*/];
                                                    });
                                                }); })["catch"](function (err) {
                                                    throw err;
                                                })];
                                        }
                                        else {
                                            error = new myError_1["default"]('user not found', 400, 5, 'کاربر پیدا نشد.', 'خطا رخ داد');
                                            throw error;
                                        }
                                        return [2 /*return*/];
                                    });
                                }); })["catch"](function (err) {
                                    throw err;
                                })];
                        });
                    }); })
                        .then(function () {
                        return resObj;
                    })["catch"](function (err) {
                        console.log("error in with Transaction", err);
                        throw ("error in with transaction");
                    })["finally"](function () {
                        session.endSession();
                    })["catch"](function (err) {
                        throw err;
                    })];
        }
    });
}); };
