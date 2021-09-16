import React from "react";

import CardChartsTxContainer from './CardChartsTx-styles'
import { numbersFormatter, priceFormatter } from '../../helpers/general-helper'
import useGetLastTxs from '../../hooks/useGetLastTxs'
import GetLastDefaultTxs from '../../hooks/useGetLastDefaultTxs'

function CardChartsTx (props) {


    let { currencyId, rialId } = props
    let { 
        data: lastDefaultTxs, 
        loading: lastDefaultTxsLoading, 
        refetch: lastDefaultTxsRefetch, 
        hasError: lastDefaultTxsHasError 
    } = GetLastDefaultTxs({ curIdOp: currencyId })

    let { data: newData, loading, hasError, getLastTxs, isSearched } = useGetLastTxs()

    return (
        <div>
            <CardChartsTxContainer>
                <div className='title'>
                    تراکنش های اخیر
                </div>
                <hr/>
                <div className='header'>
                    <div className='headerTitle'>
                        تعداد
                    </div>
                    <div className='headerTitle'>
                        قیمت
                    </div>
                    <div className='headerTitle'>
                        زمان
                    </div>
                </div>
                <div className='content'>
                    {
                        !lastDefaultTxsLoading && !isSearched &&
                        lastDefaultTxs.map((e, i) => (
                            <div key={i} className='row'>
                                {
                                    e.txType === 'sell' &&
                                    <>
                                        <div className='amountSell'>
                                            {numbersFormatter(e.Gvalue)}
                                        </div>
                                        <div className='priceSell'>
                                            {priceFormatter(e.Tvalue)}
                                        </div>
                                    </>
                                }
                                {
                                    e.txType === 'buy' &&
                                    <>
                                        <div className='amountBuy'>
                                            {numbersFormatter(e.Gvalue)}
                                        </div>
                                        <div className='priceBuy'>
                                            {priceFormatter(e.Tvalue)}
                                        </div>
                                    </>
                                }

                                <div className='date'>
                                { 
                                    new Date(e.acceptedDate)
                                    .toLocaleString("fa-IR")
                                    .toString()
                                    .split("،")[1]
                                }
                                </div>
                            </div>
                        ))
                    }
                    {
                        isSearched &&
                        lastDefaultTxs.map((e, i) => (
                            <div key={i} className='row'>
                                {
                                    e.txType === 'sell' &&
                                    <>
                                        <div className='amountSell'>
                                            {numbersFormatter(e.Gvalue)}
                                        </div>
                                        <div className='priceSell'>
                                            {priceFormatter(e.Tvalue)}
                                        </div>
                                    </>
                                }
                                {
                                    e.txType === 'buy' &&
                                    <>
                                        <div className='amountBuy'>
                                            {numbersFormatter(e.Gvalue)}
                                        </div>
                                        <div className='priceBuy'>
                                            {priceFormatter(e.Tvalue)}
                                        </div>
                                    </>
                                }

                                <div className='date'>
                                { 
                                    new Date(e.acceptedDate)
                                    .toLocaleString("fa-IR")
                                    .toString()
                                    .split("،")[1]
                                }
                                </div>
                            </div>
                        ))
                    }
                    
                </div>
       
            </CardChartsTxContainer>
        </div>
    );
}

export default CardChartsTx;