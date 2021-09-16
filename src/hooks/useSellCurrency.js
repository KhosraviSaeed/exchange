import { useState } from "react";

import { sellCurrency } from "../ducks/wallet/wallet-api";

function useSellCurrency() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doSellCurrency(data) {
    setLoading(true);
    return sellCurrency(data)
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
    sellCurrency: doSellCurrency,
    loading,
    hasError
  };
}

export default useSellCurrency;