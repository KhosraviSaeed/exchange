import { useState } from "react";

import { deleteTickets } from "../ducks/tickets/tickets-api";

function useDeleteTickets() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doDeleteTickets(data) {
    setLoading(true);
    return deleteTickets(data)
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
    deleteTickets: doDeleteTickets,
    loading,
    hasError
  };
}

export default useDeleteTickets;