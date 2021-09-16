import styled from "styled-components";
import { space, breakpoint, color, fz, imageSize } from "../../helpers/theme-helper";

let ProfileContainer = styled.div`



.headerDiv {
    

    .firstLayer {
        position: relative;
        margin: 0 auto;
        width: 905px;
        height: 450px;
        border-bottom-left-radius: 450px;
        border-bottom-right-radius: 450px; 
        background: #161616;
        border: 1px solid #424242;
        box-sizing: border-box;
        box-shadow: inset 0px 12px 55px 11px rgba(66, 66, 66, 0.56);
        z-index: 1;
    }

    .secondLayer {
        position: relative;
        border-bottom-left-radius: 460px;
        border-bottom-right-radius: 460px; 
        margin: 0 auto;
        width: 975px;
        height: 460px;
        margin-top: -420px;
        background: #000000;
    }

    .imageHolder {
        position: relative;
        width: 145px;
        height: 145px;
        margin: 0 auto;
        margin-top: -400px;
        border-radius: 50%;
        background: #252222;
        box-shadow: 0px 0px 10px 5px rgba(255, 247, 172, 0.45);
        z-index: 2;
    }

    .name-familyName {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 35px;
        font-style: normal;
        font-weight: normal;
        font-size: 25px;
        line-height: 29px;
        color: #FFF69D;
        z-index: 2;
    }

    .userLevel {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 20px;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 18px;
        color: #FFF69D;
        z-index: 2;
    }
}

.goldLine {
    margin-right: -275px;
    margin-top: -130px;   
    margin-bottom: 250px;

    // .goldLineImage {
    //     width: 900px;
    // }
}

.bankCard {
    position: relative;
    margin: 0 auto;
    margin-top: 200px;
    width: 420px;
    height: 220px;
    background: #000000;
    border: 1px solid rgba(255, 246, 157, 0.56);
    box-shadow: 0px 0px 10px 5px rgba(255, 247, 172, 0.45);
    z-index: 1;

    .bankName {
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 15px;
        color: #FFF69D;
        margin-top: 40px;
        margin-right: 55px;
    }

    .bankId {
        margin-top: 40px;
        margin-right: 80px;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 23px;
        color: #FFF69D;
    }

    .bankLastRow {
        display: flex;
        flex-direction: row;
        margin-top: 45px;
        margin-right: 55px;
        
        .bankUsername {
            font-style: normal;
            font-weight: normal;
            font-size: 13px;
            line-height: 15px;
            color: #FFF69D;
        }
        .bankDate {
            font-style: normal;
            font-weight: normal;
            font-size: 13px;
            line-height: 15px;
            color: #FFF69D;
            margin-right: 190px;
        }
    }
}

.cardsDiv {
    margin-right: 60px;
    margin-left: 60px;
    margin-top: -75px;

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 40px;

        .infoCard {
            width: 315px;
            height: 180px;
            background: #000000;

            .infoCardTitle {
                font-style: normal;
                font-weight: normal;
                font-size: 15px;
                line-height: 18px;
                color: #FFF69D;
                margin-top: 40px;
                margin-right: 30px;
            }

            .infoCardInfo {
                width: 200px;
                height: 55px;
                margin-top: 25px;
                margin-right: 30px;

                .infoCardInfoFRow {
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #DDDDDD;
                }

                .infoCardInfoSRow {
                    margin-top: 20px;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 14px;                    
                    color: #DDDDDD;
                }
            }

            .infoCardBtnDiv {
                margin-right: 250px;

                .infoCardBtn {
                    border: none;
                    background-color: transparent;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 10px;
                    line-height: 12px;
                    color: #FFF69D;
                }
            }
        }
    }

}

.levelCard {
    position: relative;
    margin: 0 auto;
    margin-top: 65px;
    width: 605px;
    height: 470px;
    background: #000000;
    z-index: 1;

    .levelCardTitle {
        display: flex;
        flex-direction: row;
        justify-content: center;   
        padding-top: 25px;     
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 23px;
        color: #FFF69D;
    }

    .topCircle {
        padding-top: 70px;
    }

    .rightCircle{
        margin-right: -180px;
        margin-top: -20px;
    }

    .leftCircle {
        margin-left: -180px;
        margin-top: -100px;
    }

    .levelTitle {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 5px;
        font-style: normal;
        font-weight: normal;
        font-size: 10px;
        line-height: 12px;
        color: rgba(255, 246, 157, 0.5);
    }
    .levelTitle2 {
        display: flex;
        flex-direction: row;
        justify-content: center;
        font-style: normal;
        font-weight: normal;
        font-size: 10px;
        line-height: 12px;
        color: rgba(255, 246, 157, 0.5);
    }

    .inStar {
        margin-top: 15px;
        margin-right: 15px;
    }

    .circle1 {
        position: relative;
        margin: 0 auto;
        width: 72px;
        height: 72px;
        background: #000000;
        border-radius: 50%;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 10px 5px rgba(255, 246, 157, 0.46);
        z-index: 4;
    }

    .circle2 {
        position: relative;
        margin: 0 auto;
        width: 85px;
        height: 85px;
        background: rgba(40, 39, 30, 0.3);
        border: 8px solid rgba(255, 246, 157, 0.1);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 3px 2px rgba(255, 246, 157, 0.5);
        margin-top: -80px;
        border-radius: 50%;
        z-index: 3;
    }

    .circle3 {
        position: relative;
        margin: 0 auto;
        width: 130px;
        height: 130px;
        background: rgba(40, 39, 30, 0.3);
        border: 1px solid rgba(255, 246, 157, 0.5);
        border-radius: 50%;
        box-sizing: border-box;
        box-shadow: inset 0px 0px 10px 5px rgba(255, 246, 157, 0.5);
        margin-top: -110px;
        z-index: 3;
    }

    .inCard {
        position: relative;
        margin: 0 auto;
        width: 590px;
        height: 140px;
        background: rgba(255, 246, 157, 0.3);
        border: 1px solid #000000;
        box-sizing: border-box;
        margin-top: -175px;
        z-index: 2;
    }
}

.squareDiv {
    margin-top: 60px;
    margin-right: 130px;
    margin-left: 130px;
    margin-bottom: 40px;

    .squareRow {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 5px;
    }

    .lSquareCard {
        width: 45px;
        height: 45px;
        background: rgba(255, 246, 157, 0.3);
    } 

    .squareCard {
        width: 45px;
        height: 45px;
        background: rgba(255, 246, 157, 0.2);
    } 

    .gSquareCard {
        width: 45px;
        height: 45px;
        background: linear-gradient(180deg, rgba(255, 246, 157, 0.3) 0%, rgba(255, 246, 157, 0) 100%);
    }
}

.changePassDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;  
    align-items: center;  

    .changePassBtn {
        margin-top: 90px;
        margin-bottom: 145px;
        width: 600px;
        height: 55px;
        background: #000000;
        border: none;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 18px;
        color: #FFF69D;
    }
}


    @media screen and (max-width: ${breakpoint("tablet")}) {}
    @media screen and (max-width: ${breakpoint("mobile")}) {}




`
export default ProfileContainer;