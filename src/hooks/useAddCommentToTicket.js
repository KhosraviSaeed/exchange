import { useState } from "react";

import { addCommentToTicket } from "../ducks/tickets/tickets-api";

function useAddCommentToTicket() {
  let [loading, setLoading] = useState(false);
  let [hasError, setHasError] = useState(false);

  function doAddCommentToTicket(data) {
    setLoading(true);
    return addCommentToTicket(data)
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
    addCommentToTicket: doAddCommentToTicket,
    loading,
    hasError
  };
}

export default useAddCommentToTicket;