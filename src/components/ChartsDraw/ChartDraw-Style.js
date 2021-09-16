import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardOfferContainer = styled.div`


    width: 240px;
    height: 455px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-left: ${space(2)}px;

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

    .btnDivInBuy {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: ${space(6)}px;

        .btnBuyInBuy {
            width: 90px;
            height: 20px;
            border: none;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;        
            line-height: 14px;
            color: #DDDDDD;
            background: #164F22;
        }

        .btnSellInBuy {
            width: 90px;
            height: 20px;      
            background: #1F1D1D;            
            border: none;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;        
            line-height: 14px;
            color: #DDDDDD;
        }
    }

    .btnDivInSell {    
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: ${space(6)}px;

        .btnBuyInSell {
            width: 90px;
            height: 20px;
            border: none;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;        
            line-height: 14px;
            color: #DDDDDD;
            background: #1F1D1D;            
        }

        .btnSellInSell {
            width: 90px;
            height: 20px;      
            background: #5B0202;
            border: none;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;        
            line-height: 14px;
            color: #DDDDDD;
        }
    }

    .amountDiv {
        display: flex;
        flex-direction: column;
        margin-top: 45px;

        .amountTitle {
            font-style: normal;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;            
            color: #676060;
            margin-bottom: ${space(1)}px;
            margin-right: 30px;
        }
        .amountBox {
            width: 180px;
            height: 30px;
            background: #1F1D1D;
            margin: 0 auto;
            padding: ${space(1)}px;
            border: none;
            font-style: normal;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            color: #676060;
        }
    }

    .line {
        width: 180px;
        height: 1px;
        background-color: #2D2D2D;
        margin: 0 auto;
        margin-top: ${space(8)}px;
    }

    .finalizeBtnInBuy {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 180px;
        height: 30px;
        background: #164F22;
        border: none;
        margin: 0 auto;
        margin-top: 115px;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: #DDDDDD;
    }

    .finalizeBtnInSell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 180px;
        height: 30px;
        background: #5B0202;
        border: none;
        margin: 0 auto;
        margin-top: 115px;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: #DDDDDD;
    }

    .loginOrRegister {
        display: flex;
        flex-direction: column;
        justify-content: center;
        display: flex;
        flex-direction: row;
        margin-top: ${space(8)}px;

        .login {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            color: #FFF69D;
            margin-left: ${space(1)}px;
        }
        .or {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            color: #676060;
            margin-left: ${space(1)}px;
        }
        .register {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            color: #FFF69D;
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardOfferContainer;