import React from "react";
import { priceFormatter, toImageUrl } from "../../helpers/general-helper";

import LastTxsRowContainer from './LastTxsRow-styles'

function LastTxsRow (props) {
    let { GshortName, Gvalue, Gicon, TshortName, Tvalue, Ticon, acceptedDate, txType } = props.data

    return (
        <>
            <LastTxsRowContainer>
                <div className='firstPart'>
                    {
                        txType === 'sell' &&
                        <>
                            <div className='firstItemSell'>
                                {priceFormatter(Gvalue)}
                            </div>
                            <div className='firstItemNameSell'> {GshortName} </div>
                        </>
                    }
                    {
                        txType === 'buy' &&
                        <>
                            <div className='firstItemBuy'>
                                {priceFormatter(Gvalue)}
                            </div>
                            <div className='firstItemNameBuy'> {GshortName} </div>
                        </>
                    }
                    <div className='firstIcon'>
                        <img className='firstIconImage' src={toImageUrl(Gicon)}></img>
                    </div>
                </div>
                <div className='secondPart'>
                    {
                        txType === 'sell' &&
                        <>
                            <div className='secondItemSell'>
                                {priceFormatter(Tvalue)}
                            </div>
                            <div className='secondItemNameSell'> {TshortName} </div>
                        </>
                    }
                    {
                        txType === 'buy' &&
                        <>
                            <div className='secondItemBuy'>
                                {priceFormatter(Tvalue)}
                            </div>
                            <div className='secondItemNameBuy'> {TshortName} </div>
                        </>
                    }
                    <div className='secondIcon'>
                        <img className='secondIconImage' src={toImageUrl(Ticon)}></img>
                    </div>
                </div>
                <div className='date'>
                    { new Date(acceptedDate)
                      .toLocaleString("fa-IR")
                      .toString()
                      .split("،")[1]}
                </div>

            </LastTxsRowContainer>
        </>
    );
}

export default LastTxsRow;