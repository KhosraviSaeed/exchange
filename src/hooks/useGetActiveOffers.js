import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllActiveOffers } from "../ducks/offers/offers-api";
import { setActiveOffersAction } from "../ducks/offers/offers-actions";
import { selectorActiveOffers } from "../ducks/offers/offers-selectors";

function GetActiveOffers(curIdOp) {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorActiveOffers);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getAllActiveOffers(curIdOp)
      .then((response) => {
        dispatch(setActiveOffersAction(response.data.data));
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

export default GetActiveOffers;