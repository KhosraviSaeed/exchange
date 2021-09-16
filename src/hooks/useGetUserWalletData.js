import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllUserWalletData } from "../ducks/wallet/wallet-api";
import { setUserWalletDataAction } from "../ducks/wallet/wallet-actions";
import { selectorUserWalletData } from "../ducks/wallet/wallet-selectors";

function GetUserWalletData() {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorUserWalletData);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getAllUserWalletData()
      .then((response) => {
        dispatch(setUserWalletDataAction(response.data.data));
      })
      .catch((e) => {
        setHasError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetch();
  }, []);

  return {
    data: localData,
    loading,
    refetch: fetch,
    hasError
  };
}

export default GetUserWalletData;