import React from "react";

import ProfileContainer from './Profile-styles'

function Profile (props) {

    return (
        <ProfileContainer>
            <div className='headerDiv'>
                <div className='firstLayer'></div>
                <div className='secondLayer'></div>
                <div className='imageHolder'></div>
                <div className='name-familyName'>حمید دامادی</div>
                <div className='userLevel'>سطح ۲</div>
            </div>
            <div className='bankCard'>
                <div className='bankName'>بانک پاسارگارد</div>
                <div className='bankId'>۱۲۳۴ ۵۶۷۸ ۱۲۳۴ ۵۶۷۸</div>
                <div className='bankLastRow'>
                    <div className='bankUsername'>حمید دامادی</div>
                    <div className='bankDate'>۰۸/۰۳</div>
                </div>
            </div>
            <div className='goldLine'><img className='goldLineImage' src='/svgs/line3.svg'></img></div>
            <div className='cardsDiv'>
                <div className='row'>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                            اطلاعات شخصی
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                حمید
                            </div>
                            <div className='infoCardInfoSRow'>
                                دامادی
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                            اطلاعات بانکی
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                1234 56789 1234 56789
                            </div>
                            <div className='infoCardInfoSRow'>
                                123456789
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                            آدرس
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                تهران- نازی آباد- خیابان عراقی - ...
                            </div>
                            <div className='infoCardInfoSRow'>
                                ۱۲۳۴۵۶۷۸۹۰
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                            شماره ملی
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                ۱۲۳۴۵۶۷۸۹۰
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                        شماره موبایل
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                ۰۹۳۵۸۱۰۴۷۷۶
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                    <div className='infoCard'>
                        <div className='infoCardTitle'>
                            آدرس ایمیل
                        </div>
                        <div className='infoCardInfo'>
                            <div className='infoCardInfoFRow'>
                                hamid.damadi@gmail.com
                            </div>
                        </div>
                        <div className='infoCardBtnDiv'>
                            <button className='infoCardBtn'>
                                ویرایش
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='levelCard'>
                <div className='levelCardTitle'>وضعیت سطح‌بندی</div>
                <div className='topCircle'>
                {/* <div className='levelTitle2'>سطح ۲</div> */}
                    <div className='circle1'><img className='inStar' src='/svgs/star_half.svg'></img></div>
                    <div className='circle2'></div>
                    <div className='circle3'></div>
                </div>
                <div className='rightCircle'>
                    <div className='circle1'><img className='inStar' src='/svgs/star_empty.svg'></img></div>
                    <div className='circle2'></div>
                    <div className='circle3'></div>
                    {/* <div className='levelTitle'>سطح ۳</div> */}
                </div>
                <div className='leftCircle'>
                    <div className='circle1'><img className='inStar' src='/svgs/star_full.svg'></img></div>
                    <div className='circle2'></div>
                    <div className='circle3'></div>
                    <div className='levelTitle'>سطح ۱</div>
                </div>
                <div className='inCard'></div>
                <div className='squareDiv'>
                    <div className='squareRow'>
                        <div className='lSquareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='squareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='squareCard'></div>
                        <div className='lSquareCard'></div>
                    </div>
                    <div className='squareRow'>
                        <div className='gSquareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='squareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='lSquareCard'></div>
                        <div className='gSquareCard'></div>
                    </div>

                </div>
            </div>
            <div className='changePassDiv'>
                <button className='changePassBtn'>
                    تغییر گذرواژه
                </button>
            </div>
        </ProfileContainer>
    );
}

export default Profile;