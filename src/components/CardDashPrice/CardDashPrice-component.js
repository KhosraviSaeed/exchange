import React from "react";

import CardDashPriceContainer from './CardDashPrice-styles'
import { priceFormatter, numbersFormatter, toImageUrl } from '../../helpers/general-helper'

function CardDashPrice (props) {
    let { currencyName, icon, persianName, abName, price, min, max } = props.data

    return (
        <div>
            <CardDashPriceContainer>
                <div className='cryptoImage'>
                    <img
                    className='image'
                    src={toImageUrl(icon)}
                    >
                    </img>
                </div>
                <div className='cryptoNameDiv'>
                    <hr/>
                    <div className='cryptoName'>
                        {currencyName}
                    </div>
                    <hr/>
                </div>
                <div className='currentPriceDiv'>
                    <div className='currentPrice'>
                    {`${priceFormatter(price)} تومان`}
                    </div>
                </div>
                <div className='changePriceDiv'>
                    <div className='percent'>
                        {numbersFormatter(5.7)}+
                    </div>
                    <div className='bullet'></div>
                </div>
                <div className='maxPriceDiv'>
                    <div className='maxTitle'>
                        ماکسیمم
                    </div>
                    <div className='maxPrice'>
                        {priceFormatter(max)}
                    </div>
                    <div className='maxScalePrice'>
                        تومان
                    </div>
                </div>
                <div className='minPriceDiv'>
                    <div className='minTitle'>
                            مینیمم
                    </div>
                    <div className='minPrice'>
                        {priceFormatter(min)}
                    </div>
                    <div className='minScalePrice'>
                        تومان
                    </div>
                </div>
            
            </CardDashPriceContainer>
        </div>
    );
}

export default CardDashPrice;