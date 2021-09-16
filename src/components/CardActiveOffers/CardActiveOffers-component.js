import React, { useState } from "react";

import CardActiveOffersContainer from './CardActiveOffers-styles'
import GetActiveOffers from '../../hooks/useGetActiveOffers'
import ActiveOffersResultRow from './ActiveOffersResultRow'


function CardActiveOffers (props) {

    let { currencyId, rialId } = props

    let { 
        data: activeOffers, 
        loading: activeOffersLoading, 
        refetch: activeOffersRefetch, 
        hasError: activeOffersHasError 
    } = GetActiveOffers(currencyId)



    return (
        <div>
            <CardActiveOffersContainer>
                <div className='title'>
                    سفارشات اخیر
                </div>
                <hr/>
                <div className='content'>
                    <div className='filterPart'>
                        <div className='filterTitle'>
                            جستجو
                        </div>
                        <div className='filterRow'>
                            <div className='filterRowTitle'>
                                تعداد
                            </div>
                            <div className='filterRowFrom'>
                                از
                            </div>
                            <input 
                                className='input'
                            >
                            </input>
                            <div className='filterRowTo'>
                                تا
                            </div>
                            <input 
                                className='input'
                            >
                            </input>
                        </div>
                        <div className='filterRow'>
                        <div className='filterRowTitle'>
                                قیمت
                            </div>
                            <div className='filterRowFrom'>
                                از
                            </div>
                            <input 
                                className='input'
                            >
                            </input>
                            <div className='filterRowTo'>
                                تا
                            </div>
                            <input 
                                className='input'
                            >
                            </input>
                        </div>  
                        <div className='btnDiv'>
                            <button className='advanced'>
                                جستجوی پیشرفته
                            </button>
                            <button className='confirm'>
                                تایید
                            </button>
                        </div>    
                    </div>
                    <div className='verticalLine'></div>
                    <div className='resultPart'>
                        <div className='header'>
                            <div className='headerTitle'>
                                پذیرفتن
                            </div>
                            <div className='headerTitle'>
                                تعداد   
                            </div>
                            <div className='headerTitle'>
                                قیمت
                            </div>
                            <div className='headerTitle'>
                                زمان سفارش
                            </div>
                            <div className='headerTitle'>
                                زمان انقضا
                            </div>
                        </div>
                        <div className='resultRows'>      
                        {
                            !activeOffersLoading &&
                            activeOffers.map((e, i) => (
                                <ActiveOffersResultRow
                                    key={i}
                                    data={e}
                                    activeOffersRefetch={activeOffersRefetch}
                                >
                                </ActiveOffersResultRow>

                            ))
                        }
                        </div>

                    </div>
                </div>
       
            </CardActiveOffersContainer>
        </div>
    );
}

export default CardActiveOffers;

