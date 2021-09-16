import axios from "axios";
import { 
  GET_DASH_CARD_PRICES,
 } 
 from "../../configs/constants-config";


function getAllDashCardPrices(type) {
  return axios.get(GET_DASH_CARD_PRICES(type), { withCredentials: true } );
}


export {
    getAllDashCardPrices
}