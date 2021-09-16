import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllLastDefaultTxs } from "../ducks/offers/offers-api";
import { setLastDefaultTxsAction } from "../ducks/offers/offers-actions";
import { selectorLastDefaultTxs } from "../ducks/offers/offers-selectors";

function GetLastDefaultTxs(query) {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorLastDefaultTxs);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getAllLastDefaultTxs(query)
      .then((response) => {
        dispatch(setLastDefaultTxsAction(response.data.data));
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

export default GetLastDefaultTxs;