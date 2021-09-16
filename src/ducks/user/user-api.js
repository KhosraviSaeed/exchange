import axios from "axios";
import {
  LOGIN_API,
  LOGOUT_API,
} from "../../configs/constants-config";

export {
  login,
  logout
};

function login({ username, password, preLocation }) {
  return axios.post(LOGIN_API, { username, password }, { withCredentials: true });
}

function logout() {
  return axios.get(LOGOUT_API, {
    withCredentials: true
  });
}





