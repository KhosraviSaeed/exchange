import ActionTypes from "../../configs/actionTypes-config";

// State
const user_init_state = {
  profileByLogin: {  },
};

//

const user_reducers = {

  [ActionTypes.SET_PROFILE_BY_LOGIN](state, action) {
    return {
      ...state,
      profileByLogin: action.data
    };
  },

  [ActionTypes.LOGOUT](state, action) {
    return user_init_state;
  }
};

//

function userReducers(state = user_init_state, action) {
  const reducer = user_reducers[action.type];
  return reducer ? reducer(state, action) : state;
}

export { user_init_state };
export default userReducers;
