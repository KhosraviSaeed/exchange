import React from "react";

import CardChartsWalletContainer from './CardChartsWallet-styles'

function CardChartsWallet (props) {

    return (
        <div>
            <CardChartsWalletContainer>
                <div className='title'>
                    موجودی کیف پول
                </div>
                <hr/>
                <div className='content'>
                    <div className='header'>
                        <div className='headerTitle'>
                            نام ارز
                        </div>
                        <div className='headerTitle'>
                            موجودی
                        </div>
                    </div>
                    <div className='box'>

                    </div>
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
                </div>
            
            </CardChartsWalletContainer>
        </div>
    );
}

export default CardChartsWallet;