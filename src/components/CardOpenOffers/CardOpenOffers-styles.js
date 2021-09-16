import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardOpenOffersContainer = styled.div`


    width: 1185px;
    height: 250px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-left: ${space(2)}px;
    margin-right: ${space(2)}px;

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

    .firstRow {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: ${space(9)}px;
        margin-top: ${space(4)}px;

        .selectBox {
            width: 15px;
            height: 15px;
            background: #000000;
            border: 1px solid #FFF69D;
            box-sizing: border-box;
            margin-left: ${space(1)}px;
        }

        .dropImage {
            width: 10px;
            height: 15px;
        }

        .deleteBtn {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            color: #FFF69D;
            background: #000000;
            border: none;
            margin-right: ${space(12)}px;
            

            .deleteImage {
                width: 15px;
                height: 20px;
            }
        }

        .delete {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            margin-left: ${space(12)}px;

            color: #FFF69D;
        }

        .orderBtn {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 14px;
            color: #FFF69D;
            background: #000000;
            border: none;
            // margin-left: ${space(1)}px;
        }
    }

    .content {

        display: flex;
        flex-direction: column;
        height: 155px;
        overflow: auto;

        .rows {
            display: flex;
            flex-direction: row;
            margin-right: ${space(9)}px;
            margin-top: ${space(5)}px;

            .rowsSelectBox {
                width: 15px;
                height: 15px;
                background: #000000;
                border: 1px solid #FFF69D;
                box-sizing: border-box;
            }

            .message {
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                line-height: 12px;

                color: #FFFFFF;
                margin-right: ${space(5)}px;
            }

        }

    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}


`
export default CardOpenOffersContainer;