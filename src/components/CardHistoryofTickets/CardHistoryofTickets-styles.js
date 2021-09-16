import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let CardHistoryofTicketsContainer = styled.div`


    width: 1100px;
    background: #000000;  
    margin-top: ${space(6)}px;
    margin-bottom: 100px;

    .cardHistory {

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            height: 65px;
    
            .tab {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
    
                .tabBtn {
                    border: none;
                    background-color: transparent;
                    color: #FFF69D;
                    font-style: normal;
                    font-weight: normal;
                    font-size: ${fz('m')}px;
                    line-height: 21px;
                }
        
                hr {
                    width: 150px;
                    height: 0px;
                    border: 1px solid rgba(255, 246, 157, 0.56);
                    margin-bottom: -${space(4)}px;
                    margin-top: ${space(4)}px;
                }
            }
        }

        .content {
            display: flex;
            flex-direction: column;

            width: 1050px;
            min-height: 200px;
            margin-bottom: 100px;

            background: #181818;
            border: 1px solid #000000;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            

            .contentFirstRow {
                display: flex;
                flex-direction: row;
                align-items: center;
                
                margin-right: 95px;
                margin-top: ${space(9)}px;
        
                .selectBox {
                    width: 15px;
                    height: 15px;
                    background: #000000;
                    border: 1px solid #FFF69D;
                    box-sizing: border-box;
                    margin-left: ${space(2)}px;
                }
        
                .dropImage {
                    width: 10px;
                    height: 15px;
                }
        
                .deleteBtn {
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 14px;
                    color: #FFF69D;
                    background: transparent;
                    border: none;
                    margin-right: ${space(12)}px;
                    
        
                    .deleteImage {
                        width: 15px;
                        height: 20px;
                        margin-left: ${space(1)}px;
                    }
                }
        
                .delete {
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 14px;
                    margin-left: ${space(12)}px;
        
                    color: #FFF69D;
                }
            }

            .rows {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: ${space(4)}px;
                margin-bottom: 60px;

                .ticketRow {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    width: 930px;
                    height: 55px;
                    background: #000000;
                    margin-top: ${space(2)}px;

                    font-style: normal;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 12px;
                    color: #FFFFFF;

                    .ticketRowCheckBox {
                        background: #000000;
                        border: 1px solid rgba(255, 246, 157, 0.7);
                        box-sizing: border-box;
                        width: 15px;
                        height: 15px;
                        margin-right: ${space(7)}px;
                        margin-left: ${space(4)}px;
                    }

                    .qInCard {
                        min-width: 800px;
                        max-width: 800px;
                    }

                    .detailsBtn {
                        border: none;
                        background-color: transparent;
                        color: #FFF69D;
                    }

                }

                .detailsCard {  
                    overflow: auto;            
                    width: 930px;
                    height: 250px;
                    background: #262626;
                    margin-top: ${space(2)}px;

                    .detailsCardQandM {

                        .detailsCardQ {
                            font-style: normal;
                            font-weight: 500;
                            font-size: 12px;
                            line-height: 12px;
                            color: #FFFFFF;
                            max-width: 500px;
                            min-width: 100px;
                            padding: ${space(2)}px;
                            margin-top: 30px;
                            margin-right: 60px;
                        }

                        .qDate {
                            font-style: normal;
                            font-weight: 500;
                            font-size: 12px;
                            line-height: 12px;
                            color: #DDDDDD 22%;
                            margin-right: 770px;
                        }

                        .detailsCardMessageDiv {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-right: 90px;
                            margin-top: 20px;
                            margin-bottom: 30px;

                            .flesh {

                            }

                            .qLine {
                                width: 45px;
                                height: 0px;                               
                                border: 1px solid #FFF69D;
                                transform: rotate(90deg);
                                margin-top: 20px;
                                margin-right: -15px;
                            }

                            .detailsCardMessage {
                                font-style: normal;
                                font-weight: 500;
                                font-size: 12px;
                                line-height: 12px;
                                color: #FFFFFF;
                                max-width: 500px;
                                min-width: 100px;
                                padding: ${space(2)}px;
                                margin-right: -15px;
                            }
                        }
                        .mDate {
                            font-style: normal;
                            font-weight: 500;
                            font-size: 12px;
                            line-height: 12px;
                            color: #DDDDDD 22%;
                            margin-right: 770px;
                            margin-top: -20px;
                        }
                    }



                    .detailsCard‌BtnDiv {
                        margin-top: ${space(7)}px;
                        margin-bottom: ${space(10)}px;
                        margin-right: 720px;

                        .detailsCard‌BtnReply {
                            width: 70px;
                            height: 20px;
                            background: #222222;
                            border: 1px solid rgba(255, 246, 157, 0.8);
                            box-sizing: border-box;
                            font-style: normal;
                            font-weight: normal;
                            font-size: 12px;
                            line-height: 14px;
                            color: rgba(255, 246, 157, 0.8);
                            margin-left: ${space(1)}px;
                        }
                        .detailsCard‌BtnClose {
                            width: 70px;
                            height: 20px;
                            background: #222222;
                            border: 1px solid rgba(255, 246, 157, 0.8);
                            box-sizing: border-box;
                            font-style: normal;
                            font-weight: normal;
                            font-size: 12px;
                            line-height: 14px;

                            color: rgba(255, 246, 157, 0.8);
                        }
                    }
                }
            }
        }
    }
    

    

    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default CardHistoryofTicketsContainer;