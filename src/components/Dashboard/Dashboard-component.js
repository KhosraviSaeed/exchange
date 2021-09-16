import React from "react";
import CardDashPrice from "../CardDashPrice/CardDashPrice-component";

import DashboardContainer from './Dashboard-styles'
import CardLastEvents from '../CardLastEvents'
import CardLastTxs from '../CardLastTxs'

function Dashboard (props) {
    let { cardPrices, lastDefaultTxs, lastDefaultTxsLoading } = props

    return (
        <DashboardContainer>
            <div className='firstRow'>
                {
                    cardPrices.map((e, i) => (
                        i !== 0 &&
                        <CardDashPrice
                            key={i}
                            data={e}
                        >
                        </CardDashPrice>
                    ))
                }
            </div>
            <div className='secondRow'>
                    <CardLastEvents />
                    {
                        !lastDefaultTxsLoading &&
                        <CardLastTxs 
                            lastDefaultTxs={lastDefaultTxs}
                            cardPrices={cardPrices}
                        />
                    }
            </div>
            <div className='oLine1'><img src='/svgs/line1.svg'></img></div>
            <div className='oLine2'><img src='/svgs/line2.svg'></img></div>
        </DashboardContainer>
    );
}

export default Dashboard;