import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let ChartsContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: center;


    .firstPart {
        display: flex;
        flex-direction: row;
        margin-top: ${space(10)}px;
        margin-right: ${space(6)}px;

        .rightPart {
            display: flex;
            flex-direction: column;
            

            .rightUpPart {
                display: flex;
                flex-direction: row;

            }
            .rightDownPart {

            }
        }

        .leftPart {
            margin-right: -${space(1)}px;
        }
    }

    .secondPart {
        margin-top: ${space(1)}px;
        margin-right: ${space(4)}px;
        margin-bottom: 100px;
    }

    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default ChartsContainer;