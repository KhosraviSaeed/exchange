import React, { useState } from "react";
import useGetPrice from "../../hooks/useGetPrice"
import useSellCurrency from "../../hooks/useSellCurrency";
import ModalGetPrice from '../ModalGetPrice'


function TabSell(props) {

    let { data: userWalletData } = props

    let [cur, setCur] = useState()
    let [curName, setCurName] = useState()
    let [curId, setCurId] = useState()
    let [amount, setAmount] = useState()
    let [desc, setDesc] = useState()

    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)

    let { data: lastPrice, getLastPrice, loading: getPriceLoading } = useGetPrice()
    let { sellCurrency, loading: sellCurrencyLoading } = useSellCurrency()

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
                        console.log('userWalletData: ', userWalletData)
                        cur = e.target.value
                        setCur(cur)
                        curId = userWalletData.find((v)=> v.shortName === cur)._id
                        curName = userWalletData.find((v)=> v.shortName === cur).persianName
                        setCurId(curId)
                        setCurName(curName)
                    }}
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
                    console.log('curId:', curId)
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
                    title='تایید فروش'
                    lastPrice={lastPrice}
                    loading={getPriceLoading}
                    txType={'sell'}
                    curName={curName}
                    quantity={amount}
                    onAction={() => {
                        sellCurrency({
                            currency: curId,
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

export default TabSell