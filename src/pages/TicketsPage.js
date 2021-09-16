import * as React from "react";

import DashboardLayout from '../Layouts/Dashboard'
import Tickets from '../components/Tickets'
import useGetUserTickets from '../hooks/useGetUserTickets'

function TicketsPage (props) {

    let { data, loading, hasError, refetch } = useGetUserTickets()
    return (
        <DashboardLayout>
            {
                !loading &&
                <Tickets 
                    data={data}
                    loading={loading}
                    hasError={hasError}
                    refetch={refetch}
                />
            }

        </DashboardLayout>
    );
}

export default TicketsPage