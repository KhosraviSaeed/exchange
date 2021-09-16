import ActionTypes from "../../configs/actionTypes-config";

// State
const currencies_init_state = {
  dashCardPrices: [],
};

//

const currencies_reducers = {

  [ActionTypes.SET_DASH_CARD_PRICES](state, action) {
    return {
      ...state,
      dashCardPrices: action.data
    };
  },

  [ActionTypes.LOGOUT]() {
    return currencies_init_state;
  },
};

//

function currenciesReducers(state = currencies_init_state, action) {
  const reducer = currencies_reducers[action.type];
  return reducer ? reducer(state, action) : state;
}

export { currencies_init_state };
export default currenciesReducers;