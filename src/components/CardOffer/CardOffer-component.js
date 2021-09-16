import React, { useState } from "react";


import CardOfferContainer from './CardOffer-styles'
import ModalConfirmation from '../ModalConfirmation'
import useCreateOffer from '../../hooks/useCreateOffer'



function CardOffer (props) {

    let { currencyId, rialId, userActiveOffersRefetch } = props
    let { createOffer, loading: createOfferLoading } = useCreateOffer()


    let [amount, setAmount] = useState()
    let [price, setPrice] = useState()
    let [isBuy, setIsBuy] = useState(true)
    let [isSell, setIsSell] = useState(false)

    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)

    return (
        <div>
            <CardOfferContainer>
                <div className='title'>
                    معامله
                </div>
                <hr/>
                {
                    isBuy &&
                    <>
                    <div className='btnDivInBuy'>
                        <button 
                            className='btnBuyInBuy'
                            >
                            خرید
                        </button>
                        <button 
                            className='btnSellInBuy'
                            onClick={() => {
                                setIsBuy(false) 
                                setIsSell(true)
                            }
                            }
                            >
                            فروش
                        </button>
                    </div>
                    <div className='amountDiv'>
                        <div className='amountTitle'>
                            تعداد
                        </div>
                        <input 
                        className='amountBox'
                        onChange={(e) => setAmount(e.target.value) }
                        >

                        </input>
                    </div>
                    <div className='amountDiv'>
                        <div className='amountTitle'>
                            قیمت پیشنهادی
                        </div>
                        <input 
                        className='amountBox'
                        type='text'
                        value={price ? Number(price).toLocaleString() : ""}
                        onChange={(e) => {
                            price = e.target.value.replace(/,/g, '')
                            setPrice(price)
                        } }
                        >

                        </input>
                    </div>
                    <hr className='line'></hr>
                    <button 
                        className='finalizeBtnInBuy'
                        disabled={!amount}
                        onClick={() => setOpen(true)}
                    >
                        ثبت خرید
                    </button>
                    <ModalConfirmation
                        isOpen={isOpen}
                        toggleModal={toggleModal}
                        title='ایجاد پیشنهاد خرید'
                        loading={createOfferLoading}
                        onAction={() => {
                            createOffer({
                                curGivenId: rialId ,
                                curGivenVal: price,
                                curTakenId: currencyId,
                                curTakenVal: amount,
                                expDate: '2021-10-09'
                            })
                            .then(() => {
                                userActiveOffersRefetch()
                                toggleModal()
                                setAmount("")
                                setPrice("")
                            })
                        }}
                    >    
                    </ModalConfirmation>
                    </>
                }
                {
                    isSell &&
                    <>
                    <div className='btnDivInSell'>
                        <button 
                            className='btnBuyInSell'
                            onClick={() => {
                                setIsBuy(true) 
                                setIsSell(false)
                            }
                            }
                            >
                            خرید
                        </button>
                        <button 
                            className='btnSellInSell'
                            >
                            فروش
                        </button>
                    </div>
                    <div className='amountDiv'>
                        <div className='amountTitle'>
                            تعداد
                        </div>
                        <input 
                        className='amountBox'
                        onChange={(e) => setAmount(e.target.value) }
                        >

                        </input>
                    </div>
                    <div className='amountDiv'>
                        <div className='amountTitle'>
                            قیمت پیشنهادی
                        </div>
                        <input 
                        className='amountBox'
                        onChange={(e) => setPrice(e.target.value) }
                        >

                        </input>
                    </div>
                    <hr className='line'></hr>
                    <button 
                        className='finalizeBtnInSell'
                        disabled={!amount}
                        onClick={() => setOpen(true)}
                    >
                        ثبت فروش
                    </button>
                    <ModalConfirmation
                        isOpen={isOpen}
                        toggleModal={toggleModal}
                        title='ایجاد پیشنهاد فروش'
                        loading={createOfferLoading}
                        onAction={() => {
                            createOffer({
                                curGivenId: currencyId ,
                                curGivenVal: amount,
                                curTakenId: rialId,
                                curTakenVal: price,
                                expDate: '2021-10-09'
                            })
                            .then(() => {
                                userActiveOffersRefetch()
                                toggleModal()
                                setAmount("")
                                setPrice("")
                            })
                        }}
                    >    
                    </ModalConfirmation>
                    </>
                }
                <div className='loginOrRegister'>
                    <div className='login'>
                        ورود  
                    </div>
                    <div className='or'>
                        یا  
                    </div>
                    <div className='register'>
                    ثبت نام      
                    </div>
                </div>
       
            </CardOfferContainer>
        </div>
    );
}

export default CardOffer;