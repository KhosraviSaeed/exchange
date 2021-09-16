import ActionTypes from "../../configs/actionTypes-config";

function setUserticketsAction(data) {
  return {
    type: ActionTypes.SET_USER_TICKETS,
    data
  };
}


function logoutAction(profile) {
  return {
    type: ActionTypes.LOGOUT
  };
}



export { 
  setUserticketsAction,
  logoutAction 
};
