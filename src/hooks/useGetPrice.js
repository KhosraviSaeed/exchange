import { useState } from "react";

import { getLastPrice } from "../ducks/wallet/wallet-api";


function useGetPrice() {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let [localData, setLocalData] = useState()

  function doGetPrice(data) {
    setLoading(true);
    return getLastPrice(data)
      .then((response) => {
          localData = response.data.data
          setLocalData(localData)
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
    getLastPrice: doGetPrice,
    loading,
    hasError 
  };
}

export default useGetPrice;