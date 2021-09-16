import { useState } from "react";

import { createTicket } from "../ducks/tickets/tickets-api";

function useCreateTicket() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doCreateTicket(data) {
    setLoading(true);
    return createTicket(data)
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
    createTicket: doCreateTicket,
    loading,
    hasError
  };
}

export default useCreateTicket;