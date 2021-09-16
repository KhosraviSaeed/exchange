import React, { useState } from "react";

import useAcceptOffer from '../../hooks/useAcceptOffer'
import ModalConfirmation from '../ModalConfirmation'
import { numbersFormatter, priceFormatter } from '../../helpers/general-helper'



function ActiveOffersResultRow (props) {
    let { acceptOffer, loading: acceptOfferLoading } = useAcceptOffer()
    let e = props.data

    let [isOpen, setOpen] = useState(false)
    const toggleModal = () => setOpen(!isOpen)


    return (
        <div className='resultRow'>
            <button 
                className='accept'
                disabled={e.owner}
                onClick={() => {
                    setOpen(true)
                }}
                >
                تایید
            </button>
            <ModalConfirmation
                isOpen={isOpen}
                toggleModal={toggleModal}
                title='خرید پیشنهاد'
                loading={acceptOfferLoading}
                onAction={() => {
                    acceptOffer(e.offerId)
                    .then(() => {
                        props.activeOffersRefetch()
                        toggleModal()
                    })
                }}
            >    
            </ModalConfirmation>
            {
                e.txType === 'sell' &&
                <>
                    <div className='resultAmountSell'>
                        {numbersFormatter(e.Gvalue)}
                    </div>
                    <div className='resultPriceSell'>
                        {priceFormatter(e.Tvalue)}
                    </div>
                </>
            }
            {
                e.txType === 'buy' &&
                <>
                    <div className='resultAmountBuy'>
                        {numbersFormatter(e.Gvalue)}
                    </div>
                    <div className='resultPriceBuy'>
                        {priceFormatter(e.Tvalue)}
                    </div>
                </>
            }
            <div className='resultDate'>
                {`${numbersFormatter(9)}:${numbersFormatter(11)}`}
            </div>
            <div className='resultExpDate'>
                {`${1}:${22}:${17}`}
            </div>
            </div>
    )
}

export default ActiveOffersResultRow
