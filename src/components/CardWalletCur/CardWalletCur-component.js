import React from "react";
import { navigate } from '@reach/router'

import CardWalletCurContainer from './CardWalletCur-styles'
import { priceFormatter, numbersFormatter, toImageUrl } from '../../helpers/general-helper'
import { LINK_WALLET_CUR_DETAILS } from '../../configs/constants-config'

function CardWalletCur (props) {
    let { persianName, shortName, value, commitment, totalPrice, totalRialPrice, icon } = props.data 
    return (
        <div>
            <CardWalletCurContainer>
                <div className='cryptoImage'>
                    <img
                    className='image'
                    src={toImageUrl(icon)}
                    >
                    </img>
                </div>
                <div className='cryptoNameDiv'>
                    <div className='cryptoName'>
                        {persianName}
                    </div>
                </div>
                <hr/>
                {
                    shortName !== 'IRR' &&
                    <>
                        <div className='currentPriceDiv'>
                            <div className='priceTitle'>
                                ارزش
                            </div>
                            <div className='currentPrice'>
                                {`${priceFormatter(totalRialPrice)} تومان`}
                            </div>
                        </div>
                        <hr />
                    </>
                }
                <div className='balanceDiv'>
                    <div className='balanceTitle'>
                        موجودی
                    </div>
                    <div className='currentBalance'>
                    {`${priceFormatter(value)}`}
                    </div>
                </div>
                <hr/>
                {
                    shortName !== 'IRR' &&
                    <>
                        <div className='volumeDiv'>
                            <div className='volumeTitle'>
                                حجم بازار
                            </div>
                            <div className='currentvolume'>
                            {`${priceFormatter(11000000000)} تومان`}
                            </div>
                        </div>
                    </>
                }
                <div className='btnDiv'>
                    <button
                        className='btn'
                        onClick={() => {
                            navigate(`${LINK_WALLET_CUR_DETAILS}?curId=`)
                        }}
                    >
                        جزییات
                    </button>
                </div>
            </CardWalletCurContainer>
        </div>
    );
}

export default CardWalletCur;