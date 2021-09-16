import { useState } from "react";

import { withdrawOffers } from "../ducks/offers/offers-api";

function useWithdrawOffers() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doWithdrawOffers(data) {
    setLoading(true);
    return withdrawOffers(data)
    .then(() => {

    })
    .catch((err) => {
      setHasError(true)
    })
    .finally(() => {
      setLoading(false)
    })
  }
  


  return {
    withdrawOffers: doWithdrawOffers,
    loading,
    hasError
  };
}

export default useWithdrawOffers;