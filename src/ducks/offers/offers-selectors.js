function selectorLastTxs(state) {
    return state.offers.lastTxs;
  }

function selectorLastDefaultTxs(state) {
  return state.offers.lastDefaultTxs;
}

function selectorActiveOffers(state) {
  return state.offers.activeOffers;
}

function selectorUserActiveOffers(state) {
  return state.offers.userActiveOffers;
}


export {   
    selectorLastTxs, 
    selectorLastDefaultTxs,
    selectorActiveOffers,
    selectorUserActiveOffers
};