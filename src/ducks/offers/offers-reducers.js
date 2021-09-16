import ActionTypes from "../../configs/actionTypes-config";

// State
const offers_init_state = {
  lastTxs: [],
  lastDefaultTxs: [],
  activeOffers: [],
  userActiveOffers: []
};

//

const offers_reducers = {

  [ActionTypes.SET_LAST_TXS](state, action) {
    return {
      ...state,
      lastTxs: action.data
    };
  },

  [ActionTypes.SET_LAST_DEFAULT_TXS](state, action) {
    return {
      ...state,
      lastDefaultTxs: action.data
    };
  },

  [ActionTypes.SET_ACTIVE_OFFERS](state, action) {
    return {
      ...state,
      activeOffers: action.data
    };
  },

  [ActionTypes.SET_USER_ACTIVE_OFFERS](state, action) {
    return {
      ...state,
      userActiveOffers: action.data
    };
  },

  [ActionTypes.LOGOUT]() {
    return offers_init_state;
  },
};

//

function offersReducers(state = offers_init_state, action) {
  const reducer = offers_reducers[action.type];
  return reducer ? reducer(state, action) : state;
}

export { offers_init_state };
export default offersReducers;