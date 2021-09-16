import React, { useState } from "react";

import ModalGetPrice from '../ModalGetPrice'
import useGetPrice from "../../hooks/useGetPrice"
import useBuyCurrency from "../../hooks/useBuyCurrency";


function TabBuy(props) {

    let { data: currencies } = props
    let [cur, setCur] = useState()
    let [curName, setCurName] = useState()
    let [curId, setCurId] = useState()
    let [amount, setAmount] = useState()
    let [desc, setDesc] = useState()

    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)

    let { data: lastPrice, getLastPrice, loading: getPriceLoading } = useGetPrice()
    let { buyCurrency, loading: buyCurrencyLoading } = useBuyCurrency()

    return (
        <>
            <div className='inputDiv'>
                <div className='titles'>
                    ارز رمز
                </div>
                <div className='inputs'>
                    <select 
                    className='input'
                    onChange={(e) => {
                        cur = e.target.value
                        setCur(cur)
                        curId = currencies.find((v)=> v.shortName === cur)._id
                        curName = currencies.find((v)=> v.shortName === cur).persianName
                        setCurId(curId)
                        setCurName(curName)
                    }}
                    >
                        <option>{undefined}</option>
                        {
                            currencies.map((e, i) => (
                                i !== 0 &&
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
                onClick={ () => {
                    getLastPrice({ currency: curId, quantity: amount }) 
                    .then(() => {
                        setOpen(true)
                        setTimeout(() => {
                            setOpen(false)
                        }, 120000);
                    })  
                }}
                >
                    ثبت نهایی
                </button>
                <ModalGetPrice
                    isOpen={isOpen}
                    toggleModal={toggleModal}
                    title='تایید خرید'
                    lastPrice={lastPrice}
                    loading={getPriceLoading}
                    txType={'buy'}
                    curName={curName}
                    quantity={amount}
                    onAction={() => {
                        buyCurrency({
                            currency:curId,
                            quantity: amount
                        })
                        .then(() => {
                            setCur("")
                            setAmount("")
                            setDesc("")
                            toggleModal()
                        })
                    }}
                >    
                </ModalGetPrice>
            </div>
        </>
    )
}

export default TabBuy