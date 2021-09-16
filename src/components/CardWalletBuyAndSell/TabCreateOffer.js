import React, { useState } from "react";
import useCreateOffer from '../../hooks/useCreateOffer'


function TabCreateOffer(props) {
        let { currencies, userWalletData } = props
        let [title, setTitle] = useState()
        let [firstItem, setFirstItem] = useState()
        let [firstValue, setFirstValue] = useState()
        let [secondItem, setSecondItem] = useState()
        let [secondValue, setSecondValue] = useState()
        let [expDate, setExpDate] = useState()
        let [desc, setDesc] = useState()

        let { createOffer, loading } = useCreateOffer()
        let isDisabled = firstItem && secondItem && firstValue && secondValue

    return (
        <>
            <div className='inputDiv'>
                <div className='titles'>
                    عنوان پیشنهاد
                </div>
                <div className='inputs'>
                    <input 
                        className='input'
                        onChange={(e) => setTitle(e.target.value)}
                        >
                    </input>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                    ارز فروش
                </div>
                <div className='inputs'>
                    <select 
                    className='input'
                    onChange={(e) => setFirstItem(e.target.value)}
                    >
                    <option>{undefined}</option>
                        {
                            userWalletData.filter((k) => k.shortName !== secondItem).map((e, i) => (
                                <option key={i}>{e.shortName}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                   مقدار
                </div>
                <div className='inputs'>
                    <input 
                        className='input'
                        type='number'
                        onChange={(e) => setFirstValue(e.target.value)}
                        >
                    </input>
                    <input 
                    className='input'
                    placeholder='ارزش به تومان'
                    readOnly
                    >
                    </input>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                    ارز خرید
                </div>
                <div className='inputs'>
                    <select 
                    className='input'
                    onChange={(e) => setSecondItem(e.target.value)}
                    >
                    <option>{undefined}</option>
                        {  
                            currencies.filter((k) => k.shortName !== firstItem).map((e, i) => (
                                <option key={i}>{e.shortName}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                   مقدار
                </div>
                <div className='inputs'>
                    <input 
                        className='input'
                        type='number'
                        onChange={(e) => setSecondValue(e.target.value)}
                        >
                    </input>
                    <input 
                    className='input'
                    placeholder='ارزش به تومان'
                    readOnly
                    >
                    </input>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                    تاریخ انقضا
                </div>
                <div className='inputs'>
                    <div className='input'>

                    </div>
                </div>
            </div>
            <div className='inputDiv'>
                <div className='titles'>
                   توضیحات
                </div>
                <textarea 
                className='textarea'
                onChange={(e) => setDesc(e.target.value)}
                >
                </textarea>
            </div>
            <div className='btnDiv'>
                <button 
                className='finalBtn'
                disabled={loading || !isDisabled}
                onClick={() => {
                    createOffer({
                        curGivenId: currencies.find((v) => v.shortName === firstItem)._id,
                        curGivenVal: firstValue,
                        curTakenId: currencies.find((v) => v.shortName === secondItem)._id,
                        curTakenVal: secondValue,
                        expDate: '2021-10-09'
                    })
                }}
                >
                    ثبت نهایی
                </button>
            </div>
        </>
    )
}

export default TabCreateOffer