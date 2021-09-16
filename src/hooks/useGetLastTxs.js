import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllLastTxs } from "../ducks/offers/offers-api";
import { setLastTxsAction } from "../ducks/offers/offers-actions";
import { selectorLastTxs } from "../ducks/offers/offers-selectors";

function useGetLastTxs() {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let [isSearched, setIsSearched] = useState(false)
  let dispatch = useDispatch();
  let localData = useSelector(selectorLastTxs);

  function doGetLastTxs(data) {
    setLoading(true);
    return getAllLastTxs(data)
      .then((response) => {
        dispatch(setLastTxsAction(response.data.data));
        setIsSearched(true)
      })
      .catch(({ response }) => {
        // let errorMessage =
        //   response?.data?.metaData?.message || "مشکلی پیش آمده است.";
        // addToast(errorMessage, { appearance: "error" });
      })
      .finally(() => setLoading(false));
  }

  return {
    data: localData,
    getLastTxs: doGetLastTxs,
    loading,
    hasError, 
    isSearched
  };
}

export default useGetLastTxs;