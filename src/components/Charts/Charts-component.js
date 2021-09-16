import React from "react";
import ChartsContainer from './Charts-styles'
import CardActiveOffers from '../CardActiveOffers'
import CardCharts from '../CardCharts'
import CardOffer from '../CardOffer'
import CardChartsTx from '../CardChartsTx'
import CardOpenOffers from '../CardOpenOffers'
import CardChartsWallet from '../CardChartsWallet'

import GetUserActiveOffers from '../../hooks/useGetUserActiveOffers'


function Charts (props) {
    let { currencyId, rialId } = props
    let { 
        data: userActiveOffers, 
        loading: userActiveOffersLoading, 
        refetch: userActiveOffersRefetch, 
        hasError: userActiveOffersHasError 
    } = GetUserActiveOffers(currencyId)

    return (
        <ChartsContainer>
            <div className='firstPart'>
                <div className='rightPart'>
                    <div className='rightUpPart'>
                        <CardCharts />
                        <CardChartsTx 
                            currencyId={currencyId}
                            rialId={rialId}
                        />
                    </div>
                    <div className='rightDownPart'>
                        <CardActiveOffers 
                            currencyId={currencyId}
                            rialId={rialId}
                        />                        
                    </div>                    
                </div>
                <div className='leftPart'>
                    <CardChartsWallet />
                    <CardOffer 
                        currencyId={currencyId}
                        rialId={rialId}
                        userActiveOffersRefetch={userActiveOffersRefetch}
                    />
                </div>
            </div>
            <div className='secondPart'>
                <CardOpenOffers 
                    userActiveOffers={userActiveOffers}
                    userActiveOffersLoading={userActiveOffersLoading}
                    userActiveOffersRefetch={userActiveOffersRefetch}
                />
            </div>
        </ChartsContainer>
    );
}

export default Charts;