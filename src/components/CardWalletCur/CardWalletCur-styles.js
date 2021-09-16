import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardWalletCurContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: right;
    min-width: 240px;
    min-height: 360px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 0px 10px 5px rgba(255, 247, 172, 0.45);
    margin-left: ${space(5)}px;

    hr {
        width: 170px;
        height: 1px;
        border: 0px solid rgba(255, 246, 157, 0.56);
        background-color: #FFF69D;
    }

    .title {     
        color: #EEEEEE;
    }

    .cryptoImage {
        min-width: 75px;
        max-width: 75px;
        min-height: 75px;
        max-height: 75px;
        margin-top: ${space(6)}px;
        margin-right: ${space(2)}px;

        .image {
            width: 75px;
            height: 75px;
        }
    }

    .cryptoNameDiv {
        display: flex;
        flex-direction: column;
        margin-right: ${space(6)}px;
        margin-bottom: ${space(3)}px;
        margin-top: ${space(1)}px;

        .cryptoName {
            font-family: IRANSans;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('sm')}px;
            line-height: 18px;
            color: #FFF69D;        
        }
    }

    .currentPriceDiv {
        margin-right: ${space(6)}px;
        margin-left: ${space(6)}px;
        margin-bottom: ${space(1)}px;
        margin-top: ${space(1)}px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .priceTitle {
            font-style: normal;
            font-weight: 500;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #EEEEEE;        
        }

        .currentPrice {
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #FFFFFF;
        }
    }

    .balanceDiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: ${space(6)}px;
        margin-left: ${space(6)}px;
        margin-bottom: ${space(1)}px;
        margin-top: ${space(1)}px;


        .balanceTitle {
            font-style: normal;
            font-weight: 500;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #EEEEEE;        
        }

        .currentBalance {
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #FFFFFF;
        }
    }

    .volumeDiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: ${space(6)}px;
        margin-left: ${space(6)}px;
        margin-top: ${space(1)}px;

        .volumeTitle {
            font-style: normal;
            font-weight: 500;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #EEEEEE; 
        }

        .currentvolume {
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('xms')}px;
            line-height: 18px;            
            color: #FFFFFF;
        }
    }

    .btnDiv {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        margin-top: ${space(7)}px;
        margin-left: ${space(3)}px;

        .btn {
            border: none;
            background: none;
            font-family: IRANSans;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('xms')}px;
            line-height: 18px;
            color: #FFF69D;
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardWalletCurContainer;