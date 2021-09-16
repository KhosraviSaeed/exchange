import React from "react";
import CardWalletCur from "../CardWalletCur";
import CardWalletBuyAndSell from '../CardWalletBuyAndSell'

import WalletContainer from './Wallet-styles'

function Wallet (props) {
    let { userWalletData, userWalletLoading, currencies, currenciesLoading } = props
    return (
        <WalletContainer>
            <div className='firstRow'>
                {
                    !userWalletLoading &&
                    userWalletData.map((e, i) => (
                        <CardWalletCur
                            key={i}
                            data={e}
                        >    
                        </CardWalletCur>
                    ))
                }
            </div>
            <div className='secondRow'>
                <CardWalletBuyAndSell
                    currencies={currencies}
                    userWalletData={userWalletData}
                />
            </div>
        </WalletContainer>
    );
}

export default Wallet;