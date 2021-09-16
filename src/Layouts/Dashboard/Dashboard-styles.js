
import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let DashboardContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: right;
    border-radius: ${({ theme }) => theme.radii.xxl}px;
    background-color: ${color('primary.main')};
    box-shadow: 15px 30px 30px 11px rgba(26, 26, 26, 0.33);
    border-image: 4px solid ${color('primary.gradient')};

    hr {
        width: 100%;
        border: none;
        height: 0.5px;
        font-weight: 0.5px;
        background-color: ${color('hr.main')};
    }

    .content {
        display: flex;
        flex-direction: row;
        justify-content: right;

        .vLine {
            min-height: 85vh;
            width: 1px;
            border: 1px solid rgba(255, 246, 157, 0.26);
        }

        .sidebar {
            flex: 7%;
        }
        .childeren {
            flex: 93%;
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}

`

export default DashboardContainer;