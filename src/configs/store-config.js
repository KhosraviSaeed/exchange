import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";

import reducers, { init_state } from "../ducks";

const middleware = [];

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//STORE
let store = createStore(
  reducers,
  init_state,
  composeEnhancers(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export { persistor };
export default store;
