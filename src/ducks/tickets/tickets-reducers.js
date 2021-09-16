import ActionTypes from "../../configs/actionTypes-config";

// State
const tickets_init_state = {
  userTickets: [],
};

//

const tickets_reducers = {

  [ActionTypes.SET_USER_TICKETS](state, action) {
    return {
      ...state,
      userTickets: action.data
    };
  },

  [ActionTypes.LOGOUT](state, action) {
    return tickets_init_state;
  }
};

//

function ticketsReducers(state = tickets_init_state, action) {
  const reducer = tickets_reducers[action.type];
  return reducer ? reducer(state, action) : state;
}

export { tickets_init_state };
export default ticketsReducers;
