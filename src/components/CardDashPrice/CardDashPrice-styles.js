import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardDashPriceContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 305px;
    min-height: 420px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 0px 10px 5px rgba(255, 247, 172, 0.45);
    margin-left: ${space(6)}px;

    .cryptoImage {
        min-width: 105px;
        max-width: 105px;
        min-height: 105px;
        max-height: 105px;
        margin-top: ${space(5)}px;

        .image {
            width: 105px;
            height: 105px;
        }
    }

    .cryptoNameDiv {
        display: flex;
        flex-direction: row;
        margin-top: ${space(3)}px;

        hr {
            width: 85px;
            height: 0px;
            border: 0px solid rgba(255, 246, 157, 0.56);
            background-color: #FFF69D;
            border-width: 0.01em;
        }

        .cryptoName {
            margin-top: 10px;
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('lxl')}px;
            line-height: 29px;
            color: #FFF69D;
        }
    }

    .currentPriceDiv {
        width: 220px;
        height: 45px;
        background: #000000;
        border: 1px solid rgba(255, 246, 157, 0.5);
        box-sizing: border-box;
        box-shadow: -2px -5px 10px 1px rgba(255, 246, 157, 0.25);
        margin-top: ${space(6)}px;

        .currentPrice {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: #FFF69D;
            padding: 10px;
        }
    }

    .changePriceDiv {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: ${space(5)}px;

        .bullet {
            width: 5px;
            height: 5px;
            background: #1CCC6D;
            border: 1px solid #1CCC6D;
            box-sizing: border-box;
            box-shadow: 0px 0px 5px 3px rgba(28, 204, 109, 0.25);            
            margin-right: ${space(3)}px;
        }
        .percent {
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('sm')}px;
            line-height: 18px;
            /* identical to box height */
            color: #FFF69D;
        }
    }

    .maxPriceDiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        min-width: 220px;
        margin-top: ${space(5)}px;

        .maxTitle{
            color: #EEEEEE;
        }
        .maxPrice {
            color: #EEEEEE;
        }
        .maxScalePrice {
            color: #EEEEEE;
        }
    }

    .minPriceDiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        min-width: 220px;
        margin-top: ${space(1)}px;

        .minTitle{
            color: #EEEEEE;
        }
        .minPrice {
            color: #EEEEEE;
        }
        .minScalePrice {
            color: #EEEEEE;
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardDashPriceContainer;