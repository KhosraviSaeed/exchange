import ActionTypes from "../../configs/actionTypes-config";

function setLastTxsAction(data) {
  return {
    type: ActionTypes.SET_LAST_TXS,
    data
  };
}

function setLastDefaultTxsAction(data) {
  return {
    type: ActionTypes.SET_LAST_DEFAULT_TXS,
    data
  };
}

function setActiveOffersAction(data) {
  return {
    type: ActionTypes.SET_ACTIVE_OFFERS,
    data
  };
}

function setUserActiveOffersAction(data) {
  return {
    type: ActionTypes.SET_USER_ACTIVE_OFFERS,
    data
  };
}

export { 
  setLastTxsAction,
  setLastDefaultTxsAction,
  setActiveOffersAction,
  setUserActiveOffersAction
 };