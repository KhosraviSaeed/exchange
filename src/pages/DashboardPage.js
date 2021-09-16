import * as React from "react";

import DashboardLayout from '../Layouts/Dashboard'
import Dashboard from '../components/Dashboard'
import GetDashCardPrices from '../hooks/useGetDashCardPrices'
import GetLastDefaultTxs from '../hooks/useGetLastDefaultTxs'

function DashboardPage (props) {

    let { 
        data: cardPrices, 
        loading: cardPricesLoading, 
        refetch: cardPricesRefetch, 
        hasError: cardPricesHasError 
    } = GetDashCardPrices("1")

    let { 
        data: lastDefaultTxs, 
        loading: lastDefaultTxsLoading, 
        refetch: lastDefaultTxsRefetch, 
        hasError: lastDefaultTxsHasError 
    } = GetLastDefaultTxs({ })

    return (
        <DashboardLayout>
            
            <Dashboard
                cardPrices={cardPrices}
                cardPricesLoading={cardPricesLoading}
                lastDefaultTxs={lastDefaultTxs}
                lastDefaultTxsLoading={lastDefaultTxsLoading}
            />
        </DashboardLayout>
    );
}

export default DashboardPage