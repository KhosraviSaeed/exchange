import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import store, { persistor } from "../../configs/store-config";

function withRedux(WrappedComponent) {
  const ReduxHOC = class ReduxHOC extends Component {
    render() {
      return (
        <Provider store={store}>
          <PersistGate
            persistor={persistor}
            // loading={<LoadingScreen text="در حال خواندن اطلاعات..." />}
            loading={null}
          >
            <WrappedComponent {...this.props} />
          </PersistGate>
        </Provider>
      );
    }
  };

  return ReduxHOC;
}

export default withRedux;
