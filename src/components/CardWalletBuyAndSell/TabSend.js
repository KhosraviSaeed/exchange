import React, { useState } from "react";


function TabSend(props) {
    let { data: userWalletData } = props

   
    let [cur, setCur] = useState()
    let [amount, setAmount] = useState()
    let [sendType, setSendType] = useState()
    let [dest, setDest] = useState()
    let [desc, setDesc] = useState()
      

    let [isDisabled, setIsDisabled] = useState(true)

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
                            userWalletData.map((e, i) => (
                                e.shortName !== 'IRR' &&
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
            <div className='inputDiv'>
                <div className='titles'>
                    نوع انتقال
                </div>
                <div className='inputs'>
                    <select 
                    className='input'
                    name='sendType'
                    onChange={(e) => setSendType(e.target.value)}
                    >
                    <option>{undefined}</option>
                    <option>انتقال درون شبکه</option>
                    <option>انتقال خارج از شبکه</option>
                    </select>
                </div>
            </div>
            <div className='inputDiv'>
                {
                    sendType === 'انتقال درون شبکه' &&
                    <>
                        <div className='titles'>
                            مقصد
                        </div>
                        <div className='inputs'>
                            <input 
                            className='inputDest'
                            placeholder='لطفا نام کاربری مقصد را وارد نمایید ...'
                            onChange={(e) => setDest(e.target.value)}
                            >
                            </input>
                            <button className='scanBtn'>
                                اسکن
                            </button>
                        </div>
                    </>
                }
                {
                    sendType === 'انتقال خارج از شبکه' &&
                    <>
                        <div className='titles'>
                            مقصد
                        </div>
                        <div className='inputs'>
                            <input 
                                className='inputDest'
                                placeholder='لطفا کلید عمومی مقصد را وارد نمایید ...'
                                onChange={(e) => setDest(e.target.value)}
                                >
                            </input>
                            <button className='scanBtn'>
                                اسکن
                            </button>
                        </div>
                    </>
                }

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
                disabled={false}
                >
                    ثبت نهایی
                </button>
            </div>
        </>
    )
}

export default TabSend