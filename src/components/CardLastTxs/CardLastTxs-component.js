import React, { useState } from "react";
import { priceFormatter } from "../../helpers/general-helper";

import CardLastTxsContainer from './CardLastTxs-styles'
import LastTxsRow from '../LastTxsRow'
import useGetLastTxs from '../../hooks/useGetLastTxs'


function CardLastTxs (props) {
    let { lastDefaultTxs, cardPrices }  = props
    let { data: newData, loading, hasError, getLastTxs, isSearched } = useGetLastTxs()
    let [curAbName, setCurAbName] = useState()
    let [curId, setCurId] = useState()
    let [type, setType] = useState('تمام')

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'curAbName':
                curAbName = e.target.value
                setCurAbName(curAbName)
                if (curAbName !== 'تمام') {
                    curId = cardPrices.find((i) => i.shortName === curAbName)._id
                    setCurId(curId)
                    if (type === 'فروش') {
                        getLastTxs({ curIdOp: curId, txType: 'sell' })
                    } else if (type === 'خرید') {
                        getLastTxs({ curIdOp: curId, txType: 'buy' })
                    } else {
                        getLastTxs({ curIdOp: curId, txType: 'all' })
                    }
                } else {
                    curAbName = undefined
                    curId = undefined
                    setCurId(curId)
                    if (type === 'فروش') {
                        getLastTxs({ curIdOp: undefined, txType: 'sell' })
                    } else if (type === 'خرید') {
                        getLastTxs({ curIdOp: undefined, txType: 'buy' })
                    } else {
                        getLastTxs({ curIdOp: undefined, txType: 'all' })
                    }
                }
                break;
            case 'type':
                type = e.target.value
                setType(type)
                if (type === 'تمام') {
                    getLastTxs({ curIdOp: curId, txType: 'all' })
                }
                else if (type === 'فروش') {
                    getLastTxs({ curIdOp: curId, txType: 'sell' })
                } else {
                    getLastTxs({ curIdOp: curId, txType: 'buy' })
                }
                break;
        
            default:
                break;
        }
    }

    return (
        <div>
            <CardLastTxsContainer>
                <div className='header'>
                    <select 
                        className='headerItems'
                        name='curAbName'
                        onChange={handleChange}
                    >
                        <option>تمام</option>
                        {
                            cardPrices.filter((i) => i.shortName !== 'IRR').map((e, i) => (
                                <option key={i}>{e.shortName}</option>
                            ))
                        }
                    </select>
                    <select 
                        className='headerItems'
                        name='type'
                        onChange={handleChange}
                    >
                        <option>تمام</option>
                        <option>فروش</option>
                        <option>خرید</option>
                    </select>
                    <button  className='date'> 
                        زمان
                    </button >
                </div>
                <div className='headerLine'></div>
                {
                    !loading && isSearched &&
                    newData.map((e, i) => (
                        <LastTxsRow
                            key={i}
                            data={e}
                            cardPrices={cardPrices}
                        >
                        </LastTxsRow> 
                    ))
                }
                {
                    !isSearched &&
                    lastDefaultTxs.map((e, i) => (
                        <LastTxsRow
                            key={i}
                            data={e}
                            cardPrices={cardPrices}
                        >
                        </LastTxsRow> 
                    ))
                }         
            </CardLastTxsContainer>
        </div>
    );
}

export default CardLastTxs;