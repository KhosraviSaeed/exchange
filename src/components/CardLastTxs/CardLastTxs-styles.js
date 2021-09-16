import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardLastTxsContainer = styled.div`

    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    width: 640px;
    height: 325px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-left: ${space(6)}px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: ${space(7)}px;

        .headerItems { 
            width: 195px;
            height: 25px;
            background: #000000;
            border: 1px solid rgba(255, 246, 157, 0.5);
            box-sizing: border-box;
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('sm')}px;
            line-height: 18px;
            color: #FFF69D;
        }

        .date {
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            font-size: ${fz('sm')}px;
            line-height: 18px;
            color: #FFF69D;
            width: 70px;
            height: 25px;
            background: #000000;
            border: 1px solid rgba(255, 246, 157, 0.5);
            box-sizing: border-box;            
        }
    }

    .headerLine {
        width: 100%;
        height: 0px;
        border: 1px solid rgba(255, 246, 157, 0.26);
        margin-bottom: ${space(1)}px;
    }

    .bodyFirstIcon {

        .bodyFirstIconImage {
            width: 32px;
            height: 32px;
        }
    }
    .bodyFirstItem {
        Font Family: Roboto;
        Font Style: Medium;
        font-size: ${fz('sm')}px;
        Line Height: 18px;
        Line Height: 100%;
        Align: Left;
        Vertical Align: Top;
        color: #ffffff;
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardLastTxsContainer;