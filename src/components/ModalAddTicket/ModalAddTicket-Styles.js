import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";


let ModalAddTicketContainer = styled("div")`

margin: 0 auto;
width: 900px;
min-height: 400px;
background: #151515;
display: flex;
flex-direction: column;

.ticketTypeDiv {
    margin-right: 40px;

    .ticketType {    
        width: 315px;
        height: 44px;
        background: #151515;
        margin-top: 25px;
    
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 15px;
        color: #FFF69D;
    }
}



.cardTicketTitleDiv {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 50px;


    .cardTicketTitle {
        width: 820px;
        height: 55px;
        background: #000000;
        border: none;

        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: rgba(190, 190, 190, 0.3);
        padding: ${space(1)}px;
    }
}

.cardTicketMessageDiv {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;

    .cardTicketMessage {
        width: 820px;
        height: 280px;
        background: #000000;
        border: none;

        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: rgba(190, 190, 190, 0.3);
        padding: ${space(1)}px;
    }
}

.BtnDiv {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: ${space(7)}px;
    margin-bottom: ${space(7)}px;

    .Btn {   
        width: 820px;
        height: 45px;
                
        background: #000000;
        border: 1px solid rgba(255, 246, 157, 0.6);
        box-sizing: border-box;
        box-shadow: 0px 0px 6px 4px rgba(255, 247, 172, 0.4);
        border: none;

        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 15px;
        color: #FFF69D;
    }
}


@media screen and (max-width: ${breakpoint("tablet")}) {}
@media screen and (max-width: ${breakpoint("mobile")}) {}

`;

export default ModalAddTicketContainer;
