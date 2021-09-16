import axios from "axios";
import { 
  GET_USER_WALLET,
  GET_LAST_PRICE,
  BUY_CURRENCY,
  SELL_CURRENCY
 } 
 from "../../configs/constants-config";


function getAllUserWalletData() {
  return axios.get(GET_USER_WALLET, { withCredentials: true } );
}

function getLastPrice(data) {
  return axios.post(GET_LAST_PRICE, data, { withCredentials: true } );
}

function buyCurrency(data) {
  return axios.post(BUY_CURRENCY, data, { withCredentials: true } );
}

function sellCurrency(data) {
  return axios.post(SELL_CURRENCY, data, { withCredentials: true } );
}


export {
    getAllUserWalletData,
    getLastPrice,
    buyCurrency,
    sellCurrency
}