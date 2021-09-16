import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getUserTickets } from "../ducks/tickets/tickets-api";
import { setUserticketsAction } from "../ducks/tickets/tickets-actions";
import { selectorUserTicketsData } from "../ducks/tickets/tickets-selectors";

function useGetUserTickets() {
  let [loading, setLoading] = useState(true);
  let [hasError, setHasError] = useState(false);
  let dispatch = useDispatch();
  let localData = useSelector(selectorUserTicketsData);

  function fetch() {
    setLoading(true);
    setHasError(false);

    getUserTickets()
      .then((response) => {
        dispatch(setUserticketsAction(response.data.data));
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

export default useGetUserTickets;