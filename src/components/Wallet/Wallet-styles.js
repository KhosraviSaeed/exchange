import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let WalletContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
        font-size: ${fz('xxxxl')}px;
    }

    .body {
        font-size: ${fz('l')}px;
    }

    .firstRow {
        margin-top: ${space(12)}px;
        margin-bottom: ${space(8)}px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .secondRow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 200px;
        z-index: 1;
    }

    .oLine1 {
        margin-top: -565px;
        margin-left: -2px;
    }

    .oLine2 {
        margin-top: -705px;
        margin-left: -150px;
        margin-bottom: -123px;
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default WalletContainer;