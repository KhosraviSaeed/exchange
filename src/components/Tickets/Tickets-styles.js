import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let TicketsContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .firstRow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: ${space(8)}px;

        .addTicketCard {
            display: flex;
            flex-direction: column;
            align-items: center;

            width: 220px;
            height: 230px;
            background: #000000;
            margin-left: ${space(2)}px;

            .addTicketCardTitle {
                font-style: normal;
                font-weight: 500;
                font-size: 13px;
                line-height: 15px;
                color: #FFF69D;
                margin-top: ${space(12)}px;
            }

            .addTicketCardBtn {
                border: none;
                background: transparent;
                margin-top: ${space(9)}px;

            }
        }
    
        .ticketsStatsCard {

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            width: 870px;
            height: 230px;
            background: #000000;

            table {
                margin-right: -40px;
            }

            td {
                text-align: center;
                font-style: normal;
                font-weight: normal;
                font-size: 13px;
                line-height: 15px;
                color: #FFF69D;
                min-width: 130px;
                max-width: 130px;
                height: 40px;
            }

            .tdTitle {
                font-style: normal;
                font-weight: normal;
                font-size: 13px;
                line-height: 15px;
                color: #676060;
                min-width: 100px;
                max-width: 100px;
                height: 40px;
            }

            .statsImage {
                margin-right: 30px;
            }

        }

    }





    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default TicketsContainer;