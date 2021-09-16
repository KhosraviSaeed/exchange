import ActionTypes from "../../configs/actionTypes-config";

function setUserWalletDataAction(data) {
  return {
    type: ActionTypes.SET_USER_WALLET,
    data
  };
}

export { 
  setUserWalletDataAction,
 };