import React from "react";
import { priceFormatter } from "../../helpers/general-helper";

import LastEventRowContainer from './LastEventRow-styles'

function LastEventRow (props) {

    return (
        <>
            <LastEventRowContainer>
                <div className='firstPart'>
                    پیشنهاد بیت کوین ۲+ اتریوم ۳ شما پذیرفته شد.
                </div>

            </LastEventRowContainer>
        </>
    );
}

export default LastEventRow;