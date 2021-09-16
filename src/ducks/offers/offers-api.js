import axios from "axios";
import { 
  GET_LAST_TXS,
  GET_LAST_DEFAULT_TXS,
  CREATE_OFFER,
  ACCEPT_OFFER,
  WITHDRAW_OFFERS,
  GET_ACTIVE_OFFERS,
  GET_USER_ACTIVE_OFFERS,
 } 
 from "../../configs/constants-config";


function getAllLastTxs({ curIdOp, txType }) {
  return axios.post(GET_LAST_TXS, { curIdOp, txType }, { withCredentials: true } );
}

function getAllLastDefaultTxs(query) {
  return axios.get(GET_LAST_DEFAULT_TXS(query), { withCredentials: true } );
}

function getAllActiveOffers(curIdOp) {
  return axios.get(GET_ACTIVE_OFFERS(curIdOp), { withCredentials: true } );
}

function getAllUserActiveOffers(curIdOp) {
  return axios.get(GET_USER_ACTIVE_OFFERS(curIdOp), { withCredentials: true } );
}

function createOffer (data) {
  return axios.post(CREATE_OFFER, data, { withCredentials: true })
}

function acceptOffer (data) {
  return axios.get(ACCEPT_OFFER(data), { withCredentials: true })
}

function withdrawOffers (data) {
  return axios.post(WITHDRAW_OFFERS, data, { withCredentials: true })
}


export {
    getAllLastTxs,
    getAllLastDefaultTxs,
    createOffer,
    acceptOffer,
    withdrawOffers,
    getAllActiveOffers,
    getAllUserActiveOffers,
}