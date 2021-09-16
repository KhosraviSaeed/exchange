import { useState } from "react";

import { acceptOffer } from "../ducks/offers/offers-api";

function useAcceptOffer() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doAcceptOffer(data) {
    setLoading(true);
    return acceptOffer(data)
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
    acceptOffer: doAcceptOffer,
    loading,
    hasError
  };
}

export default useAcceptOffer;