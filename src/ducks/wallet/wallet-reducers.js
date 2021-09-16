import ActionTypes from "../../configs/actionTypes-config";

// State
const wallet_init_state = {
  userWallet: [],
};

//

const wallet_reducers = {

  [ActionTypes.SET_USER_WALLET](state, action) {
    return {
      ...state,
      userWallet: action.data
    };
  },

  [ActionTypes.LOGOUT]() {
    return wallet_init_state;
  },
};

//

function walletReducers(state = wallet_init_state, action) {
  const reducer = wallet_reducers[action.type];
  return reducer ? reducer(state, action) : state;
}

export { wallet_init_state };
export default walletReducers;