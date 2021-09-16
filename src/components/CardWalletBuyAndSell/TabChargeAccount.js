import React, { useState } from "react";


function TabChargeAccount(props) {
    let { data: currencies } = props 

    let [cur, setCur] = useState()
    let [amount, setAmount] = useState()
    let [sign, setSign] = useState()
    let [desc, setDesc] = useState()

    return (
        <>
           <div className='inputDiv'>
                <div className='titles'>
                    ارز رمز
                </div>
                <div className='inputs'>
                    <select 
                    className='input'
                    onChange={(e) => setCur(e.target.value)}
                    >
                        <option>{undefined}</option>
                        {
                            currencies.map((e, i) => (
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
                        onChange={(e) => setAmount(e.target.value)}
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
            { cur && cur !== 'IRR' &&
            <div className='inputDiv'>
                <div className='titles'>
                    کلید خصوصی
                </div>
                <div className='inputs'>
                    <input 
                    className='inputSign'
                    onChange={(e) => setSign(e.target.value)}
                    >
                    </input>
                </div>
            </div>
            }
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
                disabled={false}
                >
                    ثبت نهایی
                </button>
            </div>
        </>
    )
}

export default TabChargeAccount