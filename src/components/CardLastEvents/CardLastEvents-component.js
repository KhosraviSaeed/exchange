import React from "react";

import CardLastEventsContainer from './CardLastEvents-styles'
import LastEventRow from '../LastEventRow'

function CardLastEvents (props) {

    return (
        <div>
            <CardLastEventsContainer>
                <div className='header'>
                    <button className='headerFirstItem'>
                        رویداد
                    </button>
                </div>
                <div className='headerLine'></div>
                {
                    [1, 2, 3].map((e) => (
                        <LastEventRow>

                        </LastEventRow>
                    ))
                }
            </CardLastEventsContainer>
        </div>
    );
}

export default CardLastEvents;