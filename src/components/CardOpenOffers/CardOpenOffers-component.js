import React, { useState } from "react";

import CardOpenOffersContainer from './CardOpenOffers-styles'
import { priceFormatter, numbersFormatter } from "../../helpers/general-helper";
import ModalConfirmation from '../ModalConfirmation'
import useWithdrawOffers from '../../hooks/useWithdrawOffers'



function CardOpenOffers (props) {

    let { withdrawOffers, loading: withdrawOffersLoading } = useWithdrawOffers()

    let { userActiveOffers, userActiveOffersLoading, userActiveOffersRefetch } = props


    const newArr = Array.from(Array(userActiveOffers.length)).fill(false);
    let [userActiveOffersCheckArray, setUserActiveOffersCheckArray] = useState(newArr)
    let [checked, setChecked] = useState(false)
    let [globalOfferIds, setGlobalOfferIds] = useState([])

    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)

    return (
        <div>
            <CardOpenOffersContainer>
                <div className='title'>
                    سفارشات باز شما
                </div>
                <hr/>
                <div className='firstRow'>
                    <input 
                        className='selectBox'
                        type='checkbox'
                        onClick={() => {
                            let newArr = Array.from(Array(userActiveOffers.length)).fill(true);
                            if (checked === false) {
                                setChecked(true)
                            } else {
                                newArr = Array.from(Array(userActiveOffers.length)).fill(false);
                                setChecked(false)
                            }
                            userActiveOffersCheckArray = newArr
                            setUserActiveOffersCheckArray(userActiveOffersCheckArray)
                        }}
                        >
                    </input>
                    <img
                        className='dropImage'
                        src='svgs/drop.svg'
                    >
                    </img>
                    <button 
                        className='deleteBtn'
                        onClick={async() => {
                            let offerIds = []
                            await userActiveOffersCheckArray.map((e, i) => {
                                if (e === true) {
                                    offerIds.push(userActiveOffers[i].offerId)
                                }
                            })
                            globalOfferIds = offerIds
                            setGlobalOfferIds(globalOfferIds)
                            setOpen(true)
                        }}
                    >
                        
                        <img
                            className='deleteImage'
                            src='svgs/delete.svg'
                        >
                        </img>
                    </button>
                    <ModalConfirmation
                        isOpen={isOpen}
                        toggleModal={toggleModal}
                        title='حذف پیشنهادات'
                        loading={withdrawOffersLoading}
                        onAction={() => {
                            withdrawOffers({ offerIds: globalOfferIds })
                            .then(() => {
                                userActiveOffersRefetch()
                                toggleModal()
                            })
                        }}
                    >    
                    </ModalConfirmation>
                    <div className='delete'>
                        حذف
                    </div>
                    <button className='orderBtn'>
                        مرتب سازی
                    </button>
                    <img
                        className='dropImage'
                        src='svgs/drop.svg'
                    >
                    </img>
                </div>
                <div className='content'>
                {
                    !userActiveOffersLoading &&
                    userActiveOffers.map((e, i) => (
                        <div key={i} className='rows'>
                            <input 
                                type="checkbox"
                                className='rowsSelectBox'
                                checked={userActiveOffersCheckArray[i]}
                                onChange={() => {
                                    const newArr = [...userActiveOffersCheckArray]
                                    newArr[i] = !newArr[i]
                                    userActiveOffersCheckArray = newArr
                                    setUserActiveOffersCheckArray(userActiveOffersCheckArray)
                                }}
                                >
                            </input>
                            <div className='message'>
                                {
                                    !e.title && e.txType === 'sell' &&
                                    `پیشنهاد فروش 
                                    ${numbersFormatter(e.Gvalue)} 
                                    عدد 
                                    ${e.GpersianName}
                                     به ازای 
                                     ${priceFormatter(e.Tvalue)}
                                     ریال در تاریخ 
                                    ${new Date(e.createDate).toLocaleString('fa-IR')} 
                                    با تاریخ انقضای
                                     ${new Date(e.expireDate).toLocaleString('fa-IR')}
                                     در سیستم ثبت شد.`
                                }
                                {
                                    !e.title && e.txType === 'buy' &&
                                    `پیشنهاد خرید 
                                    ${numbersFormatter(e.Gvalue)} 
                                    عدد 
                                    ${e.GpersianName}
                                     به ازای 
                                     ${priceFormatter(e.Tvalue)}
                                     ریال در تاریخ 
                                    ${new Date(e.createDate).toLocaleString('fa-IR')} 
                                    با تاریخ انقضای
                                     ${new Date(e.expireDate).toLocaleString('fa-IR')}
                                     در سیستم ثبت شد.`
                                }
                            </div>
                        </div>
                    ))
                }
                </div>
       
            </CardOpenOffersContainer>
        </div>
    );
}

export default CardOpenOffers;