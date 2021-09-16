import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAllDashCardPrices } from "../ducks/currencies/currencies-api";
import { setDashCardPricesAction } from "../ducks/currencies/currencies-actions";
import { selectorDashCardPrices } from "../ducks/currencies/currencies-selectors";

function GetDashCardPrices(type) {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorDashCardPrices);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getAllDashCardPrices(type)
      .then((response) => {
        dispatch(setDashCardPricesAction(response.data.data));
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

export default GetDashCardPrices;