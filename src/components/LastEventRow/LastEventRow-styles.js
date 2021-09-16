import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let LastEventRowContainer = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${space(2)}px;
    margin-bottom: ${space(1)}px;

    .firstPart {
        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: ${fz('sm')}px;
        line-height: 18px;
        color: #EEEEEE;
        margin-right: ${space(1)}px;
        margin-left: ${space(1)}px;
    }



    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}


`
export default LastEventRowContainer;