import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardChartsContainer = styled.div`


    width: 680px;
    height: 545px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-bottom: ${space(1)}px;
    margin-left: ${space(1)}px;

    .title {
        font-style: normal;
        font-weight: normal;
        font-size: ${fz('s')}px;        
        line-height: 18px;
        color: #FFF69D;
        margin-top: ${space(2)}px;
        margin-right: ${space(3)}px;
    }

    hr {
        margin-top: ${space(2)}px;
        background-color: rgba(255, 246, 157, 0.26);
    }

    .content {
        display: flex;
        flex-direction: row;
        // justify-content: right;
        // align-items: right;
        

        .chartPart {
            .hLineTop {
                width: 635px;
                height: 1px;
                background-color: rgba(255, 246, 157, 0.26);
                margin-top: ${space(4)}px;
            }
            .chart {
                height: 310px;
            }
        }

        .toolsPart {
            display: flex;
            flex-direction: row;
            // justify-content: center;
            // align-items: center;

            .toolsVLine {
                width: 1px;
                min-height: 50vh;
                background-color: rgba(255, 246, 157, 0.26);
            }

            .tools {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                margin-right: 10px;

                .toolsBtn {
                    width: 20px;
                    height: 20px;
                    border: none;
                    margin: 0 auto;
                    background-color: #837D43;
                }
            }
        }
    }


    



    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardChartsContainer;