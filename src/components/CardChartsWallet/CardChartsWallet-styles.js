import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardChartsWalletContainer = styled.div`


    width: 240px;
    height: 235px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-left: ${space(12)}px;
    margin-bottom: ${space(1)}px;

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

    .content {
        display: flex;
        flex-direction: column;        

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            margin-top: ${space(5)}px;

            .headerTitle {
                font-style: normal;
                font-weight: bold;
                font-size: 12px;
                line-height: 14px;
                color: #676060;
            }
        }

        .box {
            margin: 0 auto;
            width: 180px;
            height: 65px;
            margin-top: ${space(1)}px;
            background: #1F1D1D;
        }

        .loginOrRegister {
            display: flex;
            flex-direction: row;
            margin: 0 auto;
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
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardChartsWalletContainer;