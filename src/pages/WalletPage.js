import * as React from "react";

import DashboardLayout from '../Layouts/Dashboard'
import Wallet from '../components/Wallet'
import useGetUserWalletData from '../hooks/useGetUserWalletData'
import GetDashCardPrices from '../hooks/useGetDashCardPrices'

function WalletPage (props) {
    let { 
        data: userWalletData, 
        loadig: userWalletLoading, 
        refetch: userWalletRefetch, 
        hasError: userWalletHasError 
    } = useGetUserWalletData()

    let { 
        data: currencies, 
        loading: currenciesLoading, 
        refetch: currenciesRefetch, 
        hasError: currenciesHasError 
    } = GetDashCardPrices("2")


    return (
        <DashboardLayout>
            <Wallet
                userWalletData={userWalletData}
                userWalletLoading={userWalletLoading}
                currencies={currencies}
                currenciesLoading={currenciesLoading}
            />
        </DashboardLayout>
    );
}

export default WalletPage