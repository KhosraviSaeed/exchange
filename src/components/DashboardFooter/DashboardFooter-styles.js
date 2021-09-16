
import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let DashboardFooterContainer = styled.div`

    display: flex;
    flex-direction: columns;
    justify-content: space-between;
    align-items: center;
    height: ${space(7)}px;



    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default DashboardFooterContainer;