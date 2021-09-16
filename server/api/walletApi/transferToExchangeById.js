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
exports.transferToExchangeByIdApi = void 0;
var _ = require("lodash");
var myError_1 = require("../myError");
var currencies_1 = require("../../db/currencies");
var user_1 = require("../../db/user");
var mongoose = require("mongoose");
var bitcoin = require("../walletApi/bitcoin");
var etherium = require("./etheriuem");
var tron = require("./tron");
var pendingTransfers_1 = require("../../db/pendingTransfers");
var successfulTransfers_1 = require("../../db/successfulTransfers");
exports.transferToExchangeByIdApi = function (currencyId, txId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var info, resObj, userHaveDoc, checkStatus, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userHaveDoc = false;
                checkStatus = function () {
                    return null;
                };
                return [4 /*yield*/, mongoose.startSession()];
            case 1:
                session = _a.sent();
                return [2 /*return*/, session.withTransaction(function () {
                        return user_1.User.findOne({ _id: userId }).session(session)
                            .then(function (user) {
                            if (user) {
                                return pendingTransfers_1.PendingTransfers.findOne({ userId: userId })
                                    .then(function (userPending) {
                                    if (userPending && userPending.userId.toString() === userId.toString()) {
                                        userHaveDoc = true;
                                        var pendingTx = _.find(userPending.transactions, function (i) { return i.txId.toString() === txId.toString(); });
                                        if (pendingTx) {
                                            var error = new myError_1["default"]('transaction already exsist', 400, 5, 'تراکنش قبلا وجود دارد', 'خطا رخ داد');
                                            throw error;
                                        }
                                    }
                                    return currencies_1.Currencies.findOne({ _id: currencyId })
                                        .then(function (cur) {
                                        var CurAbName = "";
                                        if (cur) {
                                            CurAbName = cur.ab_name;
                                            switch (CurAbName) {
                                                case "BTC":
                                                    checkStatus = function () {
                                                        return bitcoin.bitcoinTransferToExchangeById(txId)
                                                            .then(function (result) {
                                                            info = result;
                                                        })["catch"](function (err) {
                                                            throw err;
                                                        });
                                                    };
                                                    break;
                                                case "ETH":
                                                    return etherium.checkTransaction(txId)
                                                        .then(function (transaction) {
                                                        if (transaction && transaction.hash.toString() === txId.toString()) {
                                                            var curInWall = _.find(user.wallet, function (i) { return i.currency.toString() === currencyId.toString(); });
                                                            if (curInWall) {
                                                                curInWall.value += Number(transaction.value);
                                                            }
                                                            else {
                                                            }
                                                            return;
                                                        }
                                                        else {
                                                            throw "transaction not valid";
                                                        }
                                                    })["catch"](function (err) {
                                                        console.log("api error: ", err);
                                                    });
                                                //
                                                case "TRX":
                                                    return tron.validateByTXId(txId)
                                                        .then(function (transaction) {
                                                        if (transaction.result) {
                                                            var resObj_1 = {
                                                                status: "successful",
                                                                txValue: transaction
                                                            };
                                                            return resObj_1;
                                                        }
                                                        else {
                                                            var resObj_2 = {
                                                                status: "pending",
                                                                txValue: transaction
                                                            };
                                                        }
                                                    })["catch"](function (err) {
                                                        throw (err);
                                                    });
                                                // default
                                            }
                                            return Promise.all([checkStatus()])
                                                .then(function () {
                                                if (userHaveDoc) {
                                                    userPending.transactions.push({
                                                        txId: txId,
                                                        currencyId: currencyId,
                                                        currencyName: CurAbName,
                                                        value: info.txAmount,
                                                        type: "id"
                                                    });
                                                    userPending.save()
                                                        .then(function () {
                                                        if (info.status === 'Confirmed') {
                                                            return successfulTransfers_1.SuccessfulTransfers.findOne({ userId: userId }).session(session)
                                                                .then(function (userSuccess) { return __awaiter(void 0, void 0, void 0, function () {
                                                                var usrSuccess;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            if (!(userSuccess && userSuccess.userId.toString() === userId.toString())) return [3 /*break*/, 2];
                                                                            userSuccess.transactions.push({
                                                                                txId: txId,
                                                                                currencyId: currencyId,
                                                                                currencyName: CurAbName,
                                                                                value: info.txAmount,
                                                                                type: "id"
                                                                            });
                                                                            return [4 /*yield*/, userSuccess.save()];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 4];
                                                                        case 2:
                                                                            usrSuccess = {
                                                                                userId: userId,
                                                                                transactions: [{
                                                                                        txId: txId,
                                                                                        currencyId: currencyId,
                                                                                        currencyName: CurAbName,
                                                                                        value: info.txAmount,
                                                                                        type: "id"
                                                                                    }]
                                                                            };
                                                                            return [4 /*yield*/, successfulTransfers_1.SuccessfulTransfers.create([usrSuccess], { session: session })];
                                                                        case 3:
                                                                            _a.sent();
                                                                            _a.label = 4;
                                                                        case 4: return [2 /*return*/, pendingTransfers_1.PendingTransfers.findOne({ userId: userId }).session(session)
                                                                                .then(function (userPendinAfterSave) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                var cur;
                                                                                return __generator(this, function (_a) {
                                                                                    switch (_a.label) {
                                                                                        case 0:
                                                                                            userPendinAfterSave.transactions = _.filter(userPendinAfterSave.transactions, function (i) { return i.txId.toString() !== txId.toString(); });
                                                                                            return [4 /*yield*/, userPendinAfterSave.save()];
                                                                                        case 1:
                                                                                            _a.sent();
                                                                                            cur = _.find(user.wallet, function (i) { return i.currency.toString() === currencyId.toString(); });
                                                                                            if (!cur) return [3 /*break*/, 3];
                                                                                            cur.value += info.txAmount;
                                                                                            return [4 /*yield*/, user.save()];
                                                                                        case 2:
                                                                                            _a.sent();
                                                                                            return [3 /*break*/, 5];
                                                                                        case 3:
                                                                                            user.wallet.push({
                                                                                                currency: currencyId,
                                                                                                value: info.txAmount
                                                                                            });
                                                                                            return [4 /*yield*/, user.save()];
                                                                                        case 4:
                                                                                            _a.sent();
                                                                                            _a.label = 5;
                                                                                        case 5:
                                                                                            resObj = {
                                                                                                status: 'successful',
                                                                                                value: info.txAmount
                                                                                            };
                                                                                            return [2 /*return*/];
                                                                                    }
                                                                                });
                                                                            }); })["catch"](function (err) {
                                                                                throw err;
                                                                            })];
                                                                    }
                                                                });
                                                            }); })["catch"](function (err) {
                                                                throw err;
                                                            });
                                                        }
                                                        else {
                                                            resObj = {
                                                                status: 'pending',
                                                                value: info.txAmount
                                                            };
                                                        }
                                                    })["catch"](function (err) {
                                                        throw err;
                                                    });
                                                }
                                                else {
                                                    var usrPending = {
                                                        userId: userId,
                                                        transactions: [{
                                                                txId: txId,
                                                                currencyId: currencyId,
                                                                currencyName: CurAbName,
                                                                value: info.txAmount,
                                                                type: "id"
                                                            }]
                                                    };
                                                    pendingTransfers_1.PendingTransfers.create([usrPending])
                                                        .then(function () {
                                                        if (info.status === 'Confirmed') {
                                                            return successfulTransfers_1.SuccessfulTransfers.findOne({ userId: userId }).session(session)
                                                                .then(function (userSuccess) { return __awaiter(void 0, void 0, void 0, function () {
                                                                var usrSuccess;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            if (!(userSuccess && userSuccess.userId.toString() === userId.toString())) return [3 /*break*/, 2];
                                                                            userSuccess.transactions.push({
                                                                                txId: txId,
                                                                                currencyId: currencyId,
                                                                                currencyName: CurAbName,
                                                                                value: info.txAmount,
                                                                                type: "id"
                                                                            });
                                                                            return [4 /*yield*/, userSuccess.save()];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 4];
                                                                        case 2:
                                                                            usrSuccess = {
                                                                                userId: userId,
                                                                                transactions: [{
                                                                                        txId: txId,
                                                                                        currencyId: currencyId,
                                                                                        currencyName: CurAbName,
                                                                                        value: info.txAmount,
                                                                                        type: "id"
                                                                                    }]
                                                                            };
                                                                            return [4 /*yield*/, successfulTransfers_1.SuccessfulTransfers.create([usrSuccess], { session: session })];
                                                                        case 3:
                                                                            _a.sent();
                                                                            _a.label = 4;
                                                                        case 4: return [2 /*return*/, pendingTransfers_1.PendingTransfers.findOne({ userId: userId }).session(session)
                                                                                .then(function (userPendinAfterSave) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                var cur;
                                                                                return __generator(this, function (_a) {
                                                                                    switch (_a.label) {
                                                                                        case 0:
                                                                                            userPendinAfterSave.transactions = _.filter(userPendinAfterSave.transactions, function (i) { return i.txId.toString() !== txId.toString(); });
                                                                                            return [4 /*yield*/, userPendinAfterSave.save()];
                                                                                        case 1:
                                                                                            _a.sent();
                                                                                            cur = _.find(user.wallet, function (i) { return i.currency.toString() === currencyId.toString(); });
                                                                                            if (!cur) return [3 /*break*/, 3];
                                                                                            cur.value += info.txAmount;
                                                                                            return [4 /*yield*/, user.save()];
                                                                                        case 2:
                                                                                            _a.sent();
                                                                                            return [3 /*break*/, 5];
                                                                                        case 3:
                                                                                            user.wallet.push({
                                                                                                currency: currencyId,
                                                                                                value: info.txAmount
                                                                                            });
                                                                                            return [4 /*yield*/, user.save()];
                                                                                        case 4:
                                                                                            _a.sent();
                                                                                            _a.label = 5;
                                                                                        case 5:
                                                                                            resObj = {
                                                                                                status: 'successful',
                                                                                                value: info.txAmount
                                                                                            };
                                                                                            return [2 /*return*/];
                                                                                    }
                                                                                });
                                                                            }); })["catch"](function (err) {
                                                                                throw err;
                                                                            })];
                                                                    }
                                                                });
                                                            }); })["catch"](function (err) {
                                                                throw err;
                                                            });
                                                        }
                                                        else {
                                                            resObj = {
                                                                status: 'pending',
                                                                value: info.txAmount
                                                            };
                                                        }
                                                    })["catch"](function (err) {
                                                        throw err;
                                                    });
                                                }
                                            })["catch"](function (err) {
                                                throw err;
                                            });
                                        }
                                        else {
                                            var error = new myError_1["default"]('currency not found', 400, 5, 'ارز مربوطه  پیدا نشد.', 'خطا رخ داد');
                                            throw error;
                                        }
                                    })["catch"](function (err) {
                                        throw err;
                                    });
                                })["catch"](function (err) {
                                    throw err;
                                });
                            }
                            else {
                                var error = new myError_1["default"]('user not found', 400, 5, 'کاربر پیدا نشد.', 'خطا رخ داد');
                                throw error;
                            }
                        })["catch"](function (err) {
                            throw err;
                        });
                    })
                        .then(function () {
                        return resObj;
                    })["catch"](function (err) {
                        throw ("error in with Transaction" + ":" + err);
                    })["finally"](function () {
                        session.endSession();
                    })];
        }
    });
}); };
