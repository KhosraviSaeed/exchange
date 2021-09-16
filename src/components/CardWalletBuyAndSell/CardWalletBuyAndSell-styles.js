import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardWalletBuyAndSellContainer = styled.div`

    display: flex;
    flex-direction: column;
    align-items: right;
    width: 1035px;
    background-color: #000000;
    margin-left: ${space(6)}px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 65px;

        .tab {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .tabBtn {
                border: none;
                background-color: transparent;
                color: #FFF69D;
                font-style: normal;
                font-weight: normal;
                font-size: ${fz('m')}px;
                line-height: 21px;
            }
    
            hr {
                width: 150px;
                height: 0px;
                border: 1px solid rgba(255, 246, 157, 0.56);
                margin-bottom: -${space(4)}px;
                margin-top: ${space(4)}px;
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: right;
        width: 1005px;
        background: #181818;
        margin-right: ${space(3)}px;
        margin-left: ${space(3)}px;
        margin-bottom: ${space(12)}px;
    }

    .inputDiv {
        display: flex;
        flex-direction: column;
        align-items: right;
        margin-right: ${space(12)}px;
        margin-top: ${space(9)}px;

        .titles {
            font-style: normal;
            font-weight: bold;
            font-size: ${fz('s')}px;
            line-height: 16px;
            color: #FFFFFF;
        }
        
        .inputs {
            display: flex;
            flex-direction: row;
            // justify-content: center;
            align-items: center;

            .input {
                width: 340px;
                height: 44px;
                background: #313131;
                font-size: ${fz('xms')}px;
                padding: ${space(1)}px;
                padding-right: ${space(4)}px;
                margin-top: ${space(2)}px;
                margin-left: ${space(4)}px;
                border: none;
                color: #BEBEBE;
            }
            
            .inputDest {
                width: 645px;
                height: 44px;
                font-size: ${fz('xms')}px;
                background: #313131;
                margin-top: ${space(2)}px;
                margin-left: ${space(2)}px;
                padding: ${space(1)}px;
                padding-right: ${space(4)}px;
                border: none;
                color: #BEBEBE;
            }

            .scanBtn {
                width: 44px;
                height: 44px;
                background: #444444;
                border: none;
                font-style: normal;
                font-weight: normal;
                font-size: ${fz('xms')}px;
                line-height: 14px;
                color: #BEBEBE;
                margin-top: ${space(2)}px;
            }

            .inputSign {
                width: 700px;
                height: 44px;
                font-size: ${fz('xms')}px;
                background: #313131;
                margin-top: ${space(2)}px;
                margin-left: ${space(2)}px;
                padding: ${space(1)}px;
                padding-right: ${space(4)}px;
                color: #BEBEBE;
            }
        }   
        
        .textarea {
            width: 700px;
            height: 110px;
            font-size: ${fz('xms')}px;
            background: #313131;
            margin-top: ${space(2)}px;
            padding: ${space(2)}px;
            padding-right: ${space(4)}px;
            border: none;
            color: #BEBEBE;
        }
    }

    .btnDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 95px;
        margin-bottom: 150px;

        .finalBtn {
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('sm')}px;
            line-height: 18px;
            color: #FFF69D;
            width: 770px;
            height: 45px;
            background: #000000;
            border: 1px solid #FFF69D;
            box-sizing: border-box;
            box-shadow: 0px 0px 10px 5px rgba(255, 247, 172, 0.45);
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}


`
export default CardWalletBuyAndSellContainer;