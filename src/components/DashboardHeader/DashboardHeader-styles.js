
import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let DashboardHeaderContainer = styled.div`

    display: flex;
    flex-direction: column;
    height: ${space(15)}px;

    .headerFirstLine {
        width: 100%;
        margin-top: ${space(1)}px;
        border: 1px solid rgba(255, 246, 157, 0.26);
        height: 1px;
    }

    .headerSecondLine {
        width: 100%;
        border: 1px solid rgba(255, 246, 157, 0.26);
        height: 1px;
    }

    .logoTypeDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: ${fz('lxl')}px;
        line-height: 29px;
        margin-top: ${space(2)}px;

        .logoTypeBtn {
            border: none;
            background-color: transparent;
            color: #FFF69D;
        }
    }

    .secondRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;


        .marketBase {
            margin-top: ${space(1)}px;
            margin-right: 125px;

            .marketBaseBtn {
                width: 125px;
                height: 25px;
                background: #232323;
                border: 1px solid rgba(255, 246, 157, 0.5);
                box-sizing: border-box;
                font-family: Roboto;
                font-style: normal;
                font-weight: normal;
                font-size: ${fz('sm')}px;
                line-height: 18px;
                color: #FFF69D;
            }
        }
    }

    .secondColumn {
        display: flex;
        flex-direction: row;
        margin-left: ${space(5)}px;

        .alarm {
            margin-top: ${space(2)}px;
            margin-left: ${space(3)}px;
        }
        .profileIcon {
            border: none;
            background-color: transparent;
    
            .profileIconImg {
                width: ${imageSize(0)}px;
                height: ${imageSize(0)}px;
                margin-top: ${space(1)}px;
            }
        }
    }


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default DashboardHeaderContainer;