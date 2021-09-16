import React, { useState } from "react";

import CardWalletBuyAndSellContainer from './CardWalletBuyAndSell-styles'
import { priceFormatter, numbersFormatter } from '../../helpers/general-helper'
import TabBuy from './TabBuy'
import TabSell from './TabSell'
import TabSend from './TabSend'
import TabCreateOffer from './TabCreateOffer'
import TabChargeAccount from './TabChargeAccount'


function CardWalletBuyAndSell (props) {
    let { currencies, userWalletData } = props
    let [tabBuy, setTabBuy] = useState(true)
    let [tabSell, setTabSell] = useState(false)
    let [tabSend, setTabSend] = useState(false)
    let [tabCreateOffer, setTabCreateOffer] = useState(false)
    let [tabChargeAccount, setTabChargeAcount] = useState(false)

    return (
        <div>
            <CardWalletBuyAndSellContainer>
                <div className='header'>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabBuy(true)
                                setTabSell(false)
                                setTabSend(false)
                                setTabCreateOffer(false)
                                setTabChargeAcount(false)
                            }}
                        >
                            خرید    
                        </button>
                        {
                            tabBuy && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabBuy(false)
                                setTabSell(true)
                                setTabSend(false)
                                setTabCreateOffer(false)
                                setTabChargeAcount(false)
                            }}
                        >
                            فروش    
                        </button>
                        {
                            tabSell && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabBuy(false)
                                setTabSell(false)
                                setTabSend(false)
                                setTabCreateOffer(false)
                                setTabChargeAcount(true)
                            }}
                        >
                            شارژ حساب    
                        </button>
                        {
                            tabChargeAccount && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabBuy(false)
                                setTabSell(false)
                                setTabSend(true)
                                setTabCreateOffer(false)
                                setTabChargeAcount(false)
                            }}
                        >
                            ارسال    
                        </button>
                        {
                            tabSend && 
                            <hr/>
                        }
                    </div>
                    <div className='tab'>
                        <button
                            className='tabBtn'
                            onClick={() => {
                                setTabBuy(false)
                                setTabSell(false)
                                setTabSend(false)
                                setTabCreateOffer(true)
                                setTabChargeAcount(false)
                            }}
                        >
                            ایجاد پیشنهاد    
                        </button>
                        {
                            tabCreateOffer && 
                            <hr/>
                        }
                    </div>      
                </div>
                <div className='content'>
                    {
                        tabBuy && 
                        <TabBuy
                            data={currencies}
                        />
                    }
                    {
                        tabSell && 
                        <TabSell
                            data={userWalletData}
                        />
                    }
                    {
                        tabSend && 
                        <TabSend
                            data={userWalletData}
                        />
                    }
                    {
                        tabCreateOffer && 
                        <TabCreateOffer
                            userWalletData={userWalletData}
                            currencies={currencies}
                        />
                    }
                    {
                        tabChargeAccount &&
                        <TabChargeAccount
                            data={currencies}
                        />
                    }

                </div>

            </CardWalletBuyAndSellContainer>
        </div>
    );
}

export default CardWalletBuyAndSell;