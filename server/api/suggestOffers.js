"use strict";
exports.__esModule = true;
exports.prepForKS = exports.knapsack = exports.suggestOffers = exports.normalizing = void 0;
var moment = require('moment-timezone');
var math = require('mathjs');
var ActiveOffers_1 = require("../db/ActiveOffers");
function normalizing(arr, asc) {
    var mArr = math.matrix(arr);
    var min = math.min(mArr).valueOf();
    var max = math.max(mArr).valueOf();
    var nArr = mArr;
    var i;
    if (max == min) {
        for (i = 0; i < math.size(mArr).get([0]); i++) {
            nArr = math.subset(nArr, math.index(i), max);
        }
        return nArr.valueOf();
    }
    if (asc) {
        for (i = 0; i < math.size(mArr).get([0]); i++) {
            nArr = math.subset(nArr, math.index(i), (((mArr.get([i]) - min) / (max - min)) + 1));
        }
        return nArr.valueOf();
    }
    else {
        for (i = 0; i < math.size(mArr).get([0]); i++) {
            nArr = math.subset(nArr, math.index(i), 2 - (((mArr.get([i]) - min) / (max - min))));
        }
        return nArr.valueOf();
    }
}
exports.normalizing = normalizing;
function suggestOffers(_a) {
    var userId = _a.userId, price = _a.price, capacity = _a.capacity, offerType = _a.offerType, currencyId = _a.currencyId, rialId = _a.rialId;
    if (offerType == 'buy') {
        // get all offers except the user's offers
        var maxPrice = price + 0.05 * price;
        return ActiveOffers_1.Active_Offers.find({ $and: [
                { userId: { $ne: userId } },
                { expDate: { $gt: Date.now() } },
                { curTakenId: currencyId },
                { curGivenId: rialId },
                { curGivenVal: { $lt: maxPrice } }
            ]
        })
            .then(function (offers) {
            if (offers && Array.isArray(offers) && offers.length > 0) {
                var offerIds_1 = [];
                var offerFeatures = [];
                var prices_1 = [];
                var values_1 = [];
                var expDate_1 = [];
                offers.forEach(function (off) {
                    offerIds_1.push(off._id.toString());
                    prices_1.push(off.curGivenVal);
                    values_1.push(off.curTakenVal);
                    expDate_1.push(Math.round((moment(off.expDate) - moment()) / 60000));
                });
                prices_1 = normalizing(prices_1, false);
                expDate_1 = normalizing(expDate_1, false);
                var weights = values_1;
                offerFeatures = math.concat(math.concat(math.reshape(math.matrix(prices_1), [prices_1.length, 1]), math.reshape(math.matrix(values_1), [values_1.length, 1]), 1), math.reshape(math.matrix(expDate_1), [expDate_1.length, 1]), 1).valueOf();
                var coefs = [[0.3], [0.2], [0.5]];
                var data = prepForKS(offerIds_1, offerFeatures, weights, coefs);
                var sugOffers = knapsack(data, capacity);
                return sugOffers;
            }
            else {
                console.log("There is no offer to suggest");
            }
        })["catch"](function (err) {
            console.log("Error in middlewares/suggestOffers.ts : ", err);
        });
    }
    else {
        if (offerType == 'sell') {
            // get all offers except the user's offers
            var maxPrice = price + 0.05 * price;
            ActiveOffers_1.Active_Offers.find({ $and: [
                    { userId: { $ne: userId } },
                    { expDate: { $gt: Date.now() } },
                    { curGivenId: currencyId },
                    { curTakenId: rialId },
                    { curTakenVal: { $lt: maxPrice } }
                ]
            })
                .then(function (offers) {
                if (offers && Array.isArray(offers) && offers.length > 0) {
                    var offerIds_2 = [];
                    var offerFeatures = [];
                    var prices_2 = [];
                    var values_2 = [];
                    var expDate_2 = [];
                    offers.forEach(function (off) {
                        offerIds_2.push(off._id.toString());
                        prices_2.push(off.curTakenVal);
                        values_2.push(off.curGivenVal);
                        expDate_2.push(Math.round((moment(off.expDate) - moment()) / 60000));
                    });
                    prices_2 = normalizing(prices_2, true);
                    expDate_2 = normalizing(expDate_2, false);
                    var weights = values_2;
                    offerFeatures = math.concat(math.concat(math.reshape(math.matrix(prices_2), [prices_2.length, 1]), math.reshape(math.matrix(values_2), [values_2.length, 1]), 1), math.reshape(math.matrix(expDate_2), [expDate_2.length, 1]), 1).valueOf();
                    var coefs = [[0.3], [0.2], [0.5]];
                    var data = prepForKS(offerIds_2, offerFeatures, weights, coefs);
                    var sugOffers = knapsack(data, capacity);
                    return sugOffers;
                }
                else {
                    console.log("There is no offer to suggest");
                }
            })["catch"](function (err) {
                console.log("Error in middlewares/suggestOffers.ts : ", err);
            });
        }
        else {
            console.log("offerType must be buy or sell");
        }
    }
}
exports.suggestOffers = suggestOffers;
function knapsack(items, capacity) {
    // This implementation uses dynamic programming.
    // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
    // which will be later used as the code execution goes on.
    // This is called memoization in programming.
    // The cell will store best solution objects for different capacities and selectable items.
    var memo = [];
    // Filling the sub-problem solutions grid.
    for (var i = 0; i < items.length; i++) {
        // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
        var row = [];
        for (var cap = 1; cap <= capacity; cap++) {
            row.push(getSolution(i, cap));
        }
        memo.push(row);
    }
    // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
    return (getLast());
    function getLast() {
        var lastRow = memo[memo.length - 1];
        return lastRow[lastRow.length - 1];
    }
    function getSolution(row, cap) {
        var NO_SOLUTION = { maxValue: 0, subset: [] };
        // the column number starts from zero.
        var col = cap - 1;
        var lastItem = items[row];
        // The remaining capacity for the sub-problem to solve.
        var remaining = cap - lastItem.w;
        // Refer to the last solution for this capacity,
        // which is in the cell of the previous row with the same column
        var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
        // Refer to the last solution for the remaining capacity,
        // which is in the cell of the previous row with the corresponding column
        var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;
        // If any one of the items weights greater than the 'cap', return the last solution
        if (remaining < 0) {
            return lastSolution;
        }
        // Compare the current best solution for the sub-problem with a specific capacity
        // to a new solution trial with the lastItem(new item) added
        var lastValue = lastSolution.maxValue;
        var lastSubValue = lastSubSolution.maxValue;
        var newValue = lastSubValue + lastItem.v;
        if (newValue >= lastValue) {
            // copy the subset of the last sub-problem solution
            var _lastSubSet = lastSubSolution.subset.slice();
            _lastSubSet.push(lastItem);
            return { maxValue: newValue, subset: _lastSubSet };
        }
        else {
            return lastSolution;
        }
    }
}
exports.knapsack = knapsack;
function prepForKS(offerIds, offerFeatures, weights, coefs) {
    var values = math.multiply(math.matrix(offerFeatures), math.matrix(coefs));
    var data = math.concat(math.concat(math.reshape(math.matrix(offerIds), [offerIds.length, 1]), values, 1), math.reshape(math.matrix(weights), [weights.length, 1]), 1).valueOf();
    var dataObj = Object.values(data.reduce(function (c, _a) {
        var n = _a[0], v = _a[1], w = _a[2];
        c[n] = c[n] || { id: n, v: v, w: w };
        c[n].v = v;
        c[n].w = w;
        return c;
    }, {}));
    return dataObj;
}
exports.prepForKS = prepForKS;
