const moment = require( 'moment-timezone')
const math  = require('mathjs');

import { Active_Offers } from '../db/ActiveOffers';

export function normalizing(arr, asc) {

    let mArr = math.matrix(arr)
    const min = math.min(mArr).valueOf()
    const max = math.max(mArr).valueOf()
    let nArr = mArr
    let i
    if(max == min){
        for(i=0; i < math.size(mArr).get([0]);i++) {
            nArr = math.subset(nArr, math.index(i), max ) 
        }
        return nArr.valueOf()
    }
    if(asc) {
        for(i=0; i < math.size(mArr).get([0]);i++) {
            nArr = math.subset(nArr, math.index(i), (((mArr.get([i]) - min)/(max - min)) + 1)) 
        }
        return nArr.valueOf()
    } else {
        for(i=0; i < math.size(mArr).get([0]); i++) {
            nArr = math.subset(nArr, math.index(i), 2 - (((mArr.get([i]) - min)/(max - min)))) 
        }
        return nArr.valueOf()
    }
}

export function suggestOffers({ userId, price, capacity, offerType, currencyId, rialId }) {
    if(offerType == 'buy') {
        // get all offers except the user's offers
        let maxPrice = price + 0.05*price
        return Active_Offers.find({ $and: 
            [
                { userId :{ $ne: userId} }, 
                { expDate: { $gt: Date.now() } },
                { curTakenId: currencyId },
                { curGivenId: rialId },  
                { curGivenVal: { $lt: maxPrice }}
            ] 
        })
        .then((offers) => {
            if(offers && Array.isArray(offers) && offers.length > 0) {
                let offerIds = []
                let offerFeatures = []
                let prices = []
                let values = []
                let expDate = []
                offers.forEach(off => {
                    offerIds.push(off._id.toString())
                    prices.push(off.curGivenVal)
                    values.push(off.curTakenVal)
                    expDate.push(Math.round((moment(off.expDate) - moment())/60000))
                })
                prices = normalizing(prices, false)
                expDate = normalizing(expDate, false)
                let weights = values
                
                offerFeatures = math.concat(math.concat(math.reshape(math.matrix(prices), [prices.length, 1]), 
                                                        math.reshape(math.matrix(values), [values.length, 1]), 1), 
                                                        math.reshape(math.matrix(expDate), [expDate.length, 1]), 1).valueOf()
                let coefs = [[0.3], [0.2], [0.5]]
                let data = prepForKS(offerIds, offerFeatures, weights, coefs)
                let sugOffers = knapsack(data, capacity)
                return sugOffers
            } else {
                console.log("There is no offer to suggest")
            }
        })
        .catch((err) => {
            console.log("Error in middlewares/suggestOffers.ts : ", err)
        })
    } else {
        if(offerType == 'sell') {
            // get all offers except the user's offers
            let maxPrice = price + 0.05*price
            Active_Offers.find({ $and: 
                [
                    { userId :{ $ne: userId} }, 
                    { expDate: { $gt: Date.now() } },
                    { curGivenId: currencyId },
                    { curTakenId: rialId },  
                    { curTakenVal: { $lt: maxPrice }}
                ] 
            })            
            .then((offers) => {
                if(offers && Array.isArray(offers) && offers.length > 0) {
                    let offerIds = []
                    let offerFeatures = []
                    let prices = []
                    let values = []
                    let expDate = []
                    offers.forEach(off => {
                        offerIds.push(off._id.toString())
                        prices.push(off.curTakenVal)
                        values.push(off.curGivenVal)
                        expDate.push(Math.round((moment(off.expDate) - moment())/60000))
                    })
                    prices = normalizing(prices, true)
                    expDate = normalizing(expDate, false)
                    let weights = values
                    
                    offerFeatures = math.concat(math.concat(math.reshape(math.matrix(prices), [prices.length, 1]), 
                                                            math.reshape(math.matrix(values), [values.length, 1]), 1), 
                                                            math.reshape(math.matrix(expDate), [expDate.length, 1]), 1).valueOf()
                    let coefs = [[0.3], [0.2], [0.5]]
                    let data = prepForKS(offerIds, offerFeatures, weights, coefs)
                    let sugOffers = knapsack(data, capacity)
                    return sugOffers
                } else {
                    console.log("There is no offer to suggest")
                }
            })
            .catch((err) => {
                console.log("Error in middlewares/suggestOffers.ts : ", err)
            })
        } else {
            console.log("offerType must be buy or sell")
        }
    }
}

export function knapsack(items, capacity) {
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
        row.push(getSolution(i,cap));
      }
      memo.push(row);
    }
  
    // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
    return(getLast());
  
    function getLast(){
      var lastRow = memo[memo.length - 1];
      return lastRow[lastRow.length - 1];
    }
  
    function getSolution(row,cap){
      const NO_SOLUTION = {maxValue:0, subset:[]};
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
      if(remaining < 0){
        return lastSolution;
      }
  
      // Compare the current best solution for the sub-problem with a specific capacity
      // to a new solution trial with the lastItem(new item) added
      var lastValue = lastSolution.maxValue;
      var lastSubValue = lastSubSolution.maxValue;
  
      var newValue = lastSubValue + lastItem.v;
      if(newValue >= lastValue) {
        // copy the subset of the last sub-problem solution
        var _lastSubSet = lastSubSolution.subset.slice();
        _lastSubSet.push(lastItem);
        return {maxValue: newValue, subset:_lastSubSet};
      } else {
        return lastSolution;
      }
    }
  }

export function prepForKS(offerIds, offerFeatures, weights, coefs) {

    let values   = math.multiply(math.matrix(offerFeatures), math.matrix(coefs))
    let data = math.concat(math.concat(math.reshape(math.matrix(offerIds), [offerIds.length, 1]), values, 1), 
                                       math.reshape(math.matrix(weights), [weights.length, 1]), 1).valueOf()
    let dataObj = Object.values(data.reduce((c, [n, v, w]) => {
        c[n] = c[n] || {id: n, v, w};
        c[n].v = v
        c[n].w = w
        return c;
      }, {}));
      return dataObj
}
