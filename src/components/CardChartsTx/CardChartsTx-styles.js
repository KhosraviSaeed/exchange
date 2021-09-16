import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardChartsTxContainer = styled.div`


    width: 255px;
    height: 545px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    overflow: auto;

    
    .title {
        font-style: normal;
        font-weight: normal;
        font-size: ${fz('s')}px;        
        line-height: 18px;
        color: #FFF69D;
        margin-top: ${space(2)}px;
        margin-right: ${space(3)}px;
    }

    hr {
        margin-top: ${space(2)}px;
        background-color: rgba(255, 246, 157, 0.26);
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-top: ${space(2)}px;

        .headerTitle {
            font-style: normal;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;            
            color: #676060;
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .row {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: ${space(2)}px;

            .amountSell {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #FF1A1A;
            }
            .priceSell {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #FF1A1A;
            }

            .amountBuy {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #1CCC6D;
            }
            .priceBuy {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #1CCC6D;
            }
            .date {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 14px;
                color: #FFF69D;
            }
        }
    }



    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardChartsTxContainer;