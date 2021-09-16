import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let LastTxsRowContainer = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: ${space(2)}px;



    .firstPart {
        display: flex;
        flex-direction: row;
        // justify-content: right;
        align-items: center;
        margin-right: ${space(7)}px;

        .firstIcon {
            
            .firstIconImage {
                margin-top: ${space(1)}px;
                width: 28px;
                height: 28px;
            }
        }
        .firstItemSell {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: ${fz('sm')}px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #FF0000;
            margin-right: ${space(1)}px;
        }
        .firstItemNameSell {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: 12px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #FF0000;
            margin-right: ${space(2)}px;
            margin-left: ${space(1)}px;
        }
        .firstItemBuy {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: ${fz('sm')}px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #1CCC6D;
            margin-right: ${space(1)}px;
        }
        .firstItemNameBuy {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: 12px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #1CCC6D;
            margin-right: ${space(2)}px;
            margin-left: ${space(1)}px;
        }
    }

    .secondPart {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: ${space(14)}px;

        .secondIcon {

            .secondIconImage {
                margin-top: ${space(1)}px;
                width: 28px;
                height: 28px;
            }
        }
        .secondItemSell {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: ${fz('sm')}px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            // color: #EEEEEE;
            color: #FF0000;
            margin-right: ${space(1)}px;
        }
        .secondItemNameSell {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: 12px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #FF0000;
            margin-right: ${space(2)}px;
            margin-left: ${space(1)}px;
        }
        .secondItemBuy {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: ${fz('sm')}px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            // color: #EEEEEE;
            color: #1CCC6D;
            margin-right: ${space(1)}px;
        }
        .secondItemNameBuy {
            Font Family: Roboto;
            Font Style: Medium;
            font-size: 12px;
            Line Height: 18px;
            Line Height: 100%;
            Align: Left;
            Vertical Align: Top;
            color: #1CCC6D;
            margin-right: ${space(2)}px;
            margin-left: ${space(1)}px;
        }
    }

    .date {
        font-family: Roboto;
        font-style: normal;
        font-weight: 500;
        font-size: ${fz('sm')}px;
        line-height: 18px;
        color: #FFF69D;
        margin-right: ${space(13)}px;
        margin-left: ${space(4)}px;
    }

    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default LastTxsRowContainer;