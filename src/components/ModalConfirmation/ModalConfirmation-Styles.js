import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";


let ModalConfirmationContainer = styled("div")`

margin: 0 auto;
width: 900px;
min-height: 250px;
background: #151515;
display: flex;
flex-direction: column;

.message {
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    margin-top: 50px;
}

.btnDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 100px;

    .yesBtn {
        width: 200px;
        height: 40px; 
        border: 1px solid rgba(255, 246, 157, 0.8);
        box-sizing: border-box;
        box-shadow: 0px 4px 3px 5px rgba(0, 0, 0, 0.25);
        background: #000000;
        margin-left: ${space(1)}px;

        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 12px;
        color: rgba(255, 246, 157, 0.8);
    }

    .noBtn {
        width: 200px;
        height: 40px; 
        border: 1px solid rgba(255, 246, 157, 0.8);
        box-sizing: border-box;
        box-shadow: 0px 4px 3px 5px rgba(0, 0, 0, 0.25);
        background: #000000;
        margin-left: ${space(1)}px;

        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 12px;
        color: rgba(255, 246, 157, 0.8);
    }
}


@media screen and (max-width: ${breakpoint("tablet")}) {}
@media screen and (max-width: ${breakpoint("mobile")}) {}

`;

export default ModalConfirmationContainer;
