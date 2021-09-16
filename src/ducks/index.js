import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import LocalStorage from "redux-persist/lib/storage";

import userReducers, { user_init_state } from "./user/user-reducers";
import currenciesReducers, { currencies_init_state } from "./currencies/currencies-reducers";
import offersReducers, { offers_init_state } from "./offers/offers-reducers";
import walletReducers, { wallet_init_state } from "./wallet/wallet-reducers";
import ticketsReducers, { tickets_init_state } from "./tickets/tickets-reducers";

const PERSISTOR_VERSION = 1;

// State
const init_state = {
  user: user_init_state,
  currencies: currencies_init_state,
  offers: offers_init_state,
  wallet: wallet_init_state,
  tickets: tickets_init_state
};

// Persistors
const userPersistConfig = {
  key: "user",
  storage: LocalStorage,
  version: PERSISTOR_VERSION
};

const currenciesPersistConfig = {
  key: "currencies",
  storage: LocalStorage,
  version: PERSISTOR_VERSION
};

// Make it ready
const combinedReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducers),
  currencies: persistReducer(currenciesPersistConfig, currenciesReducers),
  offers: offersReducers,
  wallet: walletReducers,
  tickets: ticketsReducers
});

export { init_state };
export default combinedReducer;
