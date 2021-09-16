import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardActiveOffersContainer = styled.div`


    width: 940px;
    height: 245px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 4px 15px 8px rgba(0, 0, 0, 0.25);    
    margin-left: ${space(2)}px;

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
        justify-content: flex-start;



        .filterPart {
            display: flex;
            flex-direction: column;
            

            .filterTitle {
                align-self: center;
                font-style: normal;
                font-weight: bold;
                font-size: 12px;
                line-height: 14px;                
                color: #676060;
                margin-top: ${space(4)}px;
            }

            .filterRow {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-right: ${space(6)}px;
                margin-top: ${space(6)}px;

                .filterRowTitle {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #676060;
                    margin-left: ${space(5)}px;
                }

                .filterRowFrom {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #676060;
                    margin-left: ${space(1)}px;
                }

                .input {
                    width: 90px;
                    height: 20px;                    
                    background: #1F1D1D;
                    margin-left: ${space(4)}px;
                    border: none;
                }
                
                .filterRowTo {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #676060;
                    margin-left: ${space(1)}px;
                }
            }

            .btnDiv {
                display: flex;
                flex-direction: row;
                justify-content: left;
                align-items: center;
                margin-top: ${space(6)}px;
                margin-left: ${space(4)}px;

                .advanced {
                    width: 125px;
                    height: 15px; 
                    border: 1px solid rgba(255, 246, 157, 0.8);
                    box-sizing: border-box;
                    box-shadow: 0px 4px 3px 5px rgba(0, 0, 0, 0.25);
                    background: #000000;
                    margin-left: ${space(1)}px;

                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    line-height: 12px;
                    color: rgba(255, 246, 157, 0.8);
                }

                .confirm {
                    width: 55px;
                    height: 15px; 
                    border: 1px solid rgba(255, 246, 157, 0.8);
                    box-sizing: border-box;
                    box-shadow: 0px 4px 3px 5px rgba(0, 0, 0, 0.25);
                    background: #000000;

                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    line-height: 12px;
                    color: rgba(255, 246, 157, 0.8);
                }
            }

        }

        .verticalLine {
            width: 1px;
            height: 170px;
            background-color: rgba(255, 246, 157, 0.26);
        }

        .resultPart {
            display: flex;
            flex-direction: column;

            .header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: ${space(4)}px;


                .headerTitle {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #676060;
                    margin-left: 45px;
                    margin-right: 30px;
                }
            }
            .resultRows {
                height: 150px;
                overflow: auto;

                .resultRow {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin-top: ${space(3)}px;
    
    
                    .accept {
                        width: 55px;
                        height: 15px;
                        background: #164F22;
                        border: none;
                        margin-right: ${space(6)}px;
    
                        font-style: normal;
                        font-weight: 500;
                        font-size: 10px;
                        line-height: 12px;
                        color: #DDDDDD;
                    }
    
                    .resultPriceSell {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #FF1A1A;
                    }
    
                    .resultAmountSell {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #FF1A1A;
                        margin-right: 20px;
                    }
    
                    .resultPriceBuy {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #1CCC6D;
                    }
    
                    .resultAmountBuy {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #1CCC6D;
                        margin-right: 20px;
                    }
    
                    .resultDate {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #FFF69D;
                        margin-right: 40px;
                    }
    
                    .resultExpDate {
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 14px;                    
                        color: #FFF69D;
                        margin-left: 50px;
                        margin-right: 50px;
                    }
                }

            }
            
        }

    }




    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}

`
export default CardActiveOffersContainer;