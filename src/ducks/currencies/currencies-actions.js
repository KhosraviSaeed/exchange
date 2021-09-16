import ActionTypes from "../../configs/actionTypes-config";

function setDashCardPricesAction(data) {
  return {
    type: ActionTypes.SET_DASH_CARD_PRICES,
    data
  };
}

export { 
  setDashCardPricesAction,
 };