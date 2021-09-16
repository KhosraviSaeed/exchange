'use strict'
require('dotenv').config({ path: 'test/.env' })
const fs = require('fs')
const moment = require( 'moment-timezone')
const path = require('path')
const mongodb = require('mongodb')
// const supertest = require('supertest')
const supertest = require('supertest-session')
const {
    set, get, constants, clone, testAuth, testAddEntity, testEditEntity, testRequiredField,
    testEntityNotFound, sendTransaction, testTransaction, testTxSaved, getUserVerificationToken,
    closeDB
} = require('./test_utils')
const { expect, use } = require('chai')
const testUtils = require('./test_utils')
const { SSL_OP_EPHEMERAL_RSA } = require('constants')

//const uuid = require('uuid/v4')
//const { Product } = require('../db/products')
//const { connected } = require('process')
//const { cond } = require('lodash')
const api = supertest("http://localhost:3001",
    // {
    // before: function (req) {
    //     req.set('authorization', true);
    //   }
    // }
)
const apiAdmin = supertest(process.env.TEST_USER_API_URL)
const adminUsername = 'blockchain.specialist.aut@gmail.com'
const adminPassword = '123456'
const adminObjectId = "5f017f55b6757b9512e53895"


const myEmail = "morteza@gmail.com"
const myPassword = "123456"


const SecondUserEmail = "morteza۲@gmail.com"
const SecondUserPassord = "123456"

const adminEmail = "admin@gmail.com"
const adminpassword = "123456"


const givenCurencyName = "BITCOIN"
const givenCurencyPersianName = "بیت کوین"
const givenCurencyshorName = "BTC"

const takenCurencyName = "ETHEREUM"
const takenCurencyPersianName = "اتریوم"
const takenCurencyshorName = "ETH"

const thirdCurencyName = "TRON"
const thirdCurencyPersianName = "ترون"
const thirdCurencyshorName = "TRX"

const givenCurrencyValue = 1
const takenCurrecuyValue = 1
const offerExpireDate =moment().tz('Iran').add(3, 'days').format('YYYY-MM-DD')
const oneSecondLater =moment().tz('Iran').add(1, 'minutes').toISOString()
//const oneSecondLater = Date.now()+60*1000

const expiedOfferExpireDate = moment().tz('Iran').subtract(1, 'days').format('YYYY-MM-DD')
use(require('chai-datetime'))

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// describe('1: register an admin', async () => {
//     it('register an admin for create a currency ', (done) => {
//         apiAdmin.post('/admin/register')
//             .send({ email : adminEmail,
//                     password :adminpassword,
//                     name : adminName ,
//                     lastName : adminLastName
//                   })
//             .expect(200)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 expect(res.body).to.have.property('data')
//                 expect(res.body.data).to.have.property('email')
//                 expect(res.body.data.email).to.be.equal(adminEmail)
//                 set('adminemail', res.body.data.email)
//                 // expect(res.body.data).to.have.property('role')
//                 // expect(res.body.data.role).to.be.equal("...........")
//                // set('adminrole', res.body.data.role)
//                 done()
//             })
//     })
// })

describe('2: login a with admin', async () => {
    // before( () => {
    //     testUtils.deleteCurrenciesColllection()
    // })
    before(function(done) {
        testUtils.deleteCurrenciesColllection()
        done()
     }) 

    it('logging in with admin ', (done) => {
        apiAdmin.post('/admin/login')
            .send({ email : adminEmail,
                    password : adminpassword 
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                //expect(res.body.data).to.have.property('profile')
                expect(res.body.data).to.have.property("role")
                expect(res.body.data.role).to.be.equal("Admin")
                done()
            })
    })
    
})

describe('3: add currencies',  () => {
    // before( () => {
    //     testUtils.deleteCurrenciesColllection()
    //      })
    it('add the given currency ', (done) => {
        console.log("must be after")
        apiAdmin.post('/admin/addCurrency')
            .send({ currencyName : givenCurencyName,
                    persianName : givenCurencyPersianName,
                    abName :givenCurencyshorName
                  })
            .expect(200)
                
            .end((err, res) => {
                console.log("add currency")
                console.log("add currency")
                console.log("add currency")
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                set('givenCurId', res.body.data)
                done()
            })
    })

    it('add the taken currency ', (done) => {
        apiAdmin.post('/admin/addCurrency')
            .send({ currencyName : takenCurencyName,
                    persianName : takenCurencyPersianName,
                    abName :takenCurencyshorName
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                set('takenCurId', res.body.data)
                done()
            })
    })

    it('add the third currency ', (done) => {
        apiAdmin.post('/admin/addCurrency')
            .send({ currencyName : thirdCurencyName,
                    persianName : thirdCurencyPersianName,
                    abName : thirdCurencyshorName
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                set('thirdCurId', res.body.data)
                done()
            })
    })
})
describe('4: login with first user', async () => {
    it('logging in with user ', (done) => {
        api.post('/auth/login')
            .send({ username : myEmail,
                    password : myPassword 
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                expect(res.body.data).to.have.property('userId')
                //expect(res.body.data.userId).to.be.equal(myUserId)
                
                done()
            })
    })
})

describe('5: add currency value', async () => {
    let givenCur
    let takenCur
    before(async () => {
        //    cookie2 = get('cookie2')
        givenCur = get('givenCurId')
        takenCur = get('takenCurId')
        console.log("...........",givenCur)
        console.log("...........",takenCur)

    })

    it('adding given currency value ', (done) => {
        api.post('/user/addCurrencyValue')
            .send({ currencyId : givenCur,
                    currencyValue : 5000 
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.body)
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.be.equal("value added successfully")
                //expect(res.body.data.userId).to.be.equal(myUserId)
                done()
            })
    })
})

describe('6: create an offer by first user ', async () => {
    let givenCur
    let takenCur
    let thirdCur
    before(async () => {
        //    cookie2 = get('cookie2')
        givenCur = get('givenCurId')
        takenCur = get('takenCurId')
        thirdCur = get('thirdCurId')
        console.log("...........",givenCur)
        console.log("...........",takenCur)

    })

    it('create offer successfully', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.body)
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('offerId', res.body.data)
                done()
            })
        })
    it('create offer for withdraw ', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('offerForWithdrawId', res.body.data)
                done()
            })
    })
    it('create offer for withdraw by second user', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('offerForWithdrawByScondUserId', res.body.data)
                done()
            })
    })
    it('create offer with big taken currency value', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: 1000000000,
                expDate: offerExpireDate
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('offerWithBigTakenValueId', res.body.data)
                done()
            })
    })
    it('create oneSecondAliveOffer', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: oneSecondLater
                
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.body)
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('oneSecondAliveOfferId', res.body.data)
                done()
            })
    })









    it('create offer with nonexisting taken currency in acceptor wallet', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: thirdCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: 1000000000,
                expDate: offerExpireDate
               })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                //expect(res.body.data)
                set('offerWithNonExistingTCurId', res.body.data)
                done()
            })
        })
    it('create offer  without curGivenId ', (done) => {
        api.post('/user/createOffer')
            .send({
                //curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curGivenId is required!')         
                done()
            })
        })
    it('create offer  with  invalid curGivenId ', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: 12346587,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curGivenId is not valid!')         
                done()
            })
    })
    it('create offer  with  nonexisiting  curGivenId  or curTakenId in Currecies collection ', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: "5f742739462e2522ace336ec",
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curTakenId error')         
                done()
            })
    })
    it('create offer  without curTakenId', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                //curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curTakenId is required!')         
                done()
            })
        })
    it('create offer  without curGivenVal', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                //curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curGivenVal is required!')         
                done()
            })
    })
    it('create offer  without curTakenVal', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                //curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curTakenVal is required!')
                done()
            })
        })
    // it('create offer  without expDate', (done) => {
    //    api.post('/user/createOffer')
    //        .send({
    //            curGivenId: givenCur,
    //             curTakenId: takenCur,
    //             curGivenVal: givenCurrencyValue,
    //             curTakenVal: takenCurrecuyValue,
    //             //expDate: offerExpireDate
    //            })
    //         .expect(422)
    //         .end((err, res) => {
    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body).to.have.property('metaData')
    //             expect(res.body.metaData).to.have.property('messageEnglish')
    //             expect(res.body.metaData.messageEnglish).to.equal('expDate is required!')
    //             done()
    //         })
    // })
    it(' insert string as givenValue', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: "givenValue",
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curGivenVal is not valid!')
                done()
            })
    })
    it(' insert string as takenValue', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: "takenValue",
                expDate: offerExpireDate
               })
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curTakenVal is not valid!')
                done()
            })
    })
    // it(' insert invaid date', (done) => {
    //     api.post('/user/createOffer')
    //         .send({
    //             curGivenId: givenCur,
    //             curTakenId: takenCur,
    //             curGivenVal: givenCurrencyValue,
    //             curTakenVal: takenCurrecuyValue,
    //             expDate: ".."
    //            })
    //         .expect(422)
    //         .end((err, res) => {
    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body).to.have.property('metaData')
    //             expect(res.body.metaData).to.have.property('messageEnglish')
    //             expect(res.body.metaData.messageEnglish).to.equal('expDate is not valid!')
    //             done()
    //         })
    // })
    it('create offer with same currency', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId: givenCur,
                curTakenId: givenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('curGivenId must be different from curTakenId')         
                done()
            })
        })
    it('create offer with insuficient value', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId :givenCur,
                curTakenId: takenCur,
                curGivenVal: 10000000000000000000,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('Given: user has not enough credit in his/her wallet')         
                done()
            })
        })
    it('create offer with nonexisiting currecy in user wallet ', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId :thirdCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: offerExpireDate
               })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('User does not have this kind of currency')         
                done()
            })
        })
    it('create expired offer ', (done) => {
        api.post('/user/createOffer')
            .send({
                curGivenId :givenCur,
                curTakenId: takenCur,
                curGivenVal: givenCurrencyValue,
                curTakenVal: takenCurrecuyValue,
                expDate: expiedOfferExpireDate
               })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('expire date must be in the future(not before creating offer date)')         
                done()
            })
    })
})

// describe('8: withdraw created offer', async () => {    
//     let offerId
//     before(async () => {
//         offerId = get('offerForWithdrawId')
//         console.log("offerid issss ", offerId)
//     })
//     it('withdraw offer succesfuly', (done) => {
//         api.get('/user/withdrawOffer'+ "?" + "offerId=" + offerId)
//             .expect(200)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 expect(res.body).to.have.property('data')
//                 //expect(res.body.data).to.be.equal(true)
//                 //expect(res.body).to.have.property('metaData')
//                 //expect(res.body.metaData).to.have.property('messageEnglish')
//                 //expect(res.body.metaData.messageEnglish).to.equal('There is no offer with the given Id')
//                 done()
//             })
//     })
//     it('withdraw offer with invalid offer id', (done) => {
//         api.get('/user/withdrawOffer'+ "?" + "offerId=" + "jkfsdgh" )
//             .expect(422)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 // expect(res.body).to.have.property('data')
//                 // expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('offerId is not valid!')
//                 done()
//             })
//     })
//     it('withdraw offer without offer id', (done) => {
//         api.get('/user/withdrawOffer')
//             .expect(422)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 // expect(res.body).to.have.property('data')
//                 // expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('offerId is required!')
//                 done()
//             })
//     })
//     it('withdraw offer with nonexsisting offer id in active offers', (done) => {
//         api.get('/user/withdrawOffer'+ "?" + "offerId=" + "5f742739462e2522ace336ec")
//             .expect(400)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 // expect(res.body).to.have.property('data')
//                 // expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('There is no offer with the given Id')
//                 done()
//             })
//     })
// })
// describe('9: accept your own offer ', async () => {
//     let offerId
//     let offerWithBigTakenValueId
//     before(async () => {
//         offerId = get('offerId')
        
//         console.log("offerid is ", offerId)
//     })
//     it('accept your own offer', (done) => {
//         api.get('/user/acceptOffer'+ "?" + "offerId=" + offerId )
//             .expect(400)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('acceptor and creator must be different')              
//                 done()
//             })
//     })
// })
describe('7.5: logout first user ', async () => {
    let offerId
    before(async () => {
        offerId = get('offerId')
        console.log("offerid is ", offerId)
    })
    it('logout', (done) => {
        api.get('/auth/logout' )
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                done()
            })
    })
})
describe('10: login with second user ', async () => {
    let takenCur
    before(async () => {
        takenCur = get('takenCurId')
    })
    it('logging in with second user ', (done) => {
        api.post('/auth/login')
            .send({ username : SecondUserEmail,
                    password : SecondUserPassord 
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('data')
                expect(res.body.data).to.have.property('userId')
                //expect(res.body.data.userId).to.be.equal(myUserId)           
                done()
            })
    })
    it('adding taken currency value ', (done) => {
        api.post('/user/addCurrencyValue')
            .send({ currencyId : takenCur,
                    currencyValue : 5000222 
                  })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.be.equal("value added successfully")
                //expect(res.body.data.userId).to.be.equal(myUserId)
                done()
            })
    })
})
describe('11: accept created offer', async () => {
    let offerId
    let offerWithBigTakenValueId 
    let offerWithNonExistingTCurId
    before(async () => {   
    offerId = get('offerId')
    offerWithBigTakenValueId = get("offerWithBigTakenValueId")
    offerWithNonExistingTCurId = get("offerWithNonExistingTCurId")
    
    }) 
    it('accept offer successfuly', (done) => {
        api.get('/user/acceptOffer'+ "?" + "offerId=" + offerId )
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                 expect(res.body).to.have.property('data')
                 expect(res.body.data).to.be.equal(offerId)                            
                 done()
            })
    })
    it('accept offer witout offer id', (done) => {
        api.get('/user/acceptOffer')
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('offerId is required!')
                done()
            })
    })
    it('accept offer with invalid offer id', (done) => {
        api.get('/user/acceptOffer'+ "?" + "offerId=" + "23468dgzj" )
            .expect(422)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('offerId is not valid!')
                done()
            })
        })
    it('accept offer with not enough taken currency value ', (done) => {
        api.get('/user/acceptOffer'+ "?" + "offerId=" + offerWithBigTakenValueId )
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('There is no enough currency in acceptor wallet or acceptor does not have the currency')
                done()
            })
        })
    it('accept offer with non existing taken currency in acceptor wallet', (done) => {
        api.get('/user/acceptOffer'+ "?" + "offerId=" + offerWithNonExistingTCurId)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    done(err)
                }
                expect(res.body).to.have.property('metaData')
                expect(res.body.metaData).to.have.property('messageEnglish')
                expect(res.body.metaData.messageEnglish).to.equal('There is no enough currency in acceptor wallet or acceptor does not have the currency')
                done()
            })
    })
    
    it('accept offer with nonexisting offer id in active offers collections', (done) => {
         api.get('/user/acceptOffer'+ "?" + "offerId=" + "b3e6ae42-7e8b-4b40-810a-172657bf892e")
             .expect(400)
             .end((err, res) => {
                 if (err) {
                     done(err)
                 }
                 console.log("it after second before")
                 expect(res.body).to.have.property('metaData')
                 expect(res.body.metaData).to.have.property('messageEnglish')
                 expect(res.body.metaData.messageEnglish).to.equal('There is no offer with the given offer Id')
                 done()
             })
        })
})
 
// describe('11_2: accept created offer', async () =>  {
//     let oneSecondAliveOfferId  
//     before(async () => {  
//         await testUtils.sleep(60000)
//         oneSecondAliveOfferId = get('oneSecondAliveOfferId')
//         console.log("one second offer is",oneSecondAliveOfferId)
//     })
//     it('accept expired offer', (done) => {
//         api.get('/user/acceptOffer'+ "?" + "offerId=" +oneSecondAliveOfferId )
//             .expect(400)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 console.log("it after second before")
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('offer is expired')
//                 done()
//             })
//        })
//})
//describe('12: withdraw anoter users offer ', async () => {    
//     let offerId
//     before(async () => {
//         offerId = get('offerForWithdrawByScondUserId')
//         console.log("offerid issss ", offerId)
//     })
//     it('withdraw offer that belong to another user', (done) => {
//         api.get('/user/withdrawOffer'+ "?" + "offerId=" + offerId)
//             .expect(400)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 //expect(res.body).to.have.property('data')
//                 // expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('There is no offer with the given Id')
//                 done()
//             })
//     })
//     })
// describe('13: get price', async () => {    
//     let Cur
//     before(async () => {
//         Cur = get('givenCurId')
//         console.log("Cur issssssssssssssssssssssssssssssss ", Cur)
//     })
//     it('get price of bitcoin succssfuly', (done) => {
//         api.post('/user/getPrice')
//         .send({ 
//                currency: Cur,
//                quantity: 2              
//             })
//             .expect(200)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 expect(res.body).to.have.property('data')
//                 // expect(res.body.data).to.be.equal(true)
//                 //expect(res.body).to.have.property('metaData')
//                 //expect(res.body.metaData).to.have.property('messageEnglish')
//                 //expect(res.body.metaData.messageEnglish).to.equal('There is no offer with the given Id')
//                 done()
//             })
//     })
//     it('get price without cuurrecy', (done) => {
//         api.post('/user/getPrice')
//         .send({ 
//                //currency: Cur,
//                quantity: 2              
//             })
//             .expect(422)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 //expect(res.body).to.have.property('data')
//                 //expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('currency is required!')
//                 done()
//             })
//     })
//     it('get price with invalid  cuurrecy', (done) => {
//         api.post('/user/getPrice')
//         .send({ 
//                currency: "1635748hjjk",
//                quantity: 2              
//             })
//             .expect(422)
//             .end((err, res) => {
//                 if (err) {
//                     done(err)
//                 }
//                 //expect(res.body).to.have.property('data')
//                 //expect(res.body.data).to.be.equal(true)
//                 expect(res.body).to.have.property('metaData')
//                 expect(res.body.metaData).to.have.property('messageEnglish')
//                 expect(res.body.metaData.messageEnglish).to.equal('currency is not valid!')
//                 done()
//             })
//     })

 

 










