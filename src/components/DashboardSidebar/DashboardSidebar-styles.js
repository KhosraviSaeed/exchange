
import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let DashboardSidebarContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .firstIcon {
        background: ${color('sidBarIcon.gradient')};
        margin-top: 370px;
    }

    .iconBtn {
        background: ${color('sidBarIcon.gradient')};
        margin-top: ${space(6)}px;
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default DashboardSidebarContainer;