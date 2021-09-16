import ActionTypes from "../../configs/actionTypes-config";

function setProfileByLoginAction(profileByLogin) {
  return {
    type: ActionTypes.SET_PROFILE_BY_LOGIN,
    data: profileByLogin
  };
}

function logoutAction(profile) {
  return {
    type: ActionTypes.LOGOUT
  };
}



export { 
  setProfileByLoginAction, 
  logoutAction 
};
