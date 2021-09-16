import { useState } from "react";

import { createOffer } from "../ducks/offers/offers-api";

function useCreateOffer() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doCreateOffer(data) {
    setLoading(true);
    return createOffer(data)
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
    createOffer: doCreateOffer,
    loading,
    hasError
  };
}

export default useCreateOffer;