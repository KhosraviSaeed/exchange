import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllUserActiveOffers } from "../ducks/offers/offers-api";
import { setUserActiveOffersAction } from "../ducks/offers/offers-actions";
import { selectorUserActiveOffers } from "../ducks/offers/offers-selectors";

function GetUserActiveOffers(curIdOp) {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorUserActiveOffers);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getAllUserActiveOffers(curIdOp)
      .then((response) => {
        dispatch(setUserActiveOffersAction(response.data.data));
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

export default GetUserActiveOffers;