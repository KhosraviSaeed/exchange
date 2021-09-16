import React from "react";
import axios from "axios";
import { Router, Redirect, navigate } from "@reach/router";
import { ThemeProvider } from "styled-components";


import "./resources/styles/iransans.css";
import "./resources/styles/normalize.css";

import themeConfig from "./configs/theme-config";
import ProtectedRoute from "./components/ProtectedRoute";

import GlobalStyle from "./components/GlobalStyle";
import withRedux from "./components/withRedux";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";
import ProfilePage from './pages/ProfilePage';

import WalletPage from './pages/WalletPage'
import WalletCurDetailsPage from './pages/WalletCurDetailsPage'

import ChartsPage from './pages/ChartsPage'

import TicketsPage from './pages/TicketsPage'

import { 
  LINK_LOGIN,
  LINK_DASHBOARD,
  LINK_PROFILE,
  LINK_WALLET,
  LINK_WALLET_CUR_DETAILS,
  LINK_CHARTS,
  LINK_TICKETS
} from './configs/constants-config'


import store from "./configs/store-config";
// import { logoutAction } from "./ducks/user/user-actions";

// if (!window.mockMode) {
//   axios.interceptors.response.use(
//     function (response) {
//       return response;
//     },
//     function (error) {
//       let unauthorized = error?.response?.status === 401;
//       if (unauthorized) {
//         store.dispatch(logoutAction());
//         navigate("/login", { state: { unAuth: false } });
//       }
//       return Promise.reject(error);
//     }
//   );
// }

function App() {
  return (
    <ThemeProvider theme={themeConfig}>
      <GlobalStyle />
        <Router>

          <Redirect from="/" to={LINK_DASHBOARD} />
          <LoginPage path={LINK_LOGIN} />
          <ProtectedRoute render={DashboardPage} path={LINK_DASHBOARD} />
          <ProtectedRoute render={ProfilePage} path={LINK_PROFILE} />
          <ProtectedRoute render={WalletPage} path={LINK_WALLET} />
          <ProtectedRoute render={WalletCurDetailsPage} path={LINK_WALLET_CUR_DETAILS} />
          <ProtectedRoute render={ChartsPage} path={LINK_CHARTS} />
          <ProtectedRoute render={TicketsPage} path={LINK_TICKETS} />
          
        </Router>
    </ThemeProvider>
  );
}

export default withRedux(App)