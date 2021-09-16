import { useState } from "react";

import { buyCurrency } from "../ducks/wallet/wallet-api";

function useBuyCurrency() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doBuyCurrency(data) {
    setLoading(true);
    return buyCurrency(data)
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
    buyCurrency: doBuyCurrency,
    loading,
    hasError
  };
}

export default useBuyCurrency;