'use strict'
require('dotenv').config({ path: 'test/.env' })
const fs = require('fs')
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
//const uuid = require('uuid/v4')
const { User } = require('../db/user')
const { connected } = require('process')
const { iteratee } = require('lodash')
const apiU1 = supertest(process.env.TEST_API_URL)
const apiU2 = supertest(process.env.TEST_API_URL)
const apiAdmin = supertest(process.env.TEST_API_URL)
const randomNum = parseInt(Math.random() * 100000000000000)
const firstProduct = "5f047cd3b26623ce5db531d2"
const firstQuantity = 2
const secondProduct = "5f018769dc81e2a82da1a1d0"
const secondQuantity = 2
const myUserId = '5f017f6db6757b9512e53896'
const paymentMethod = "Online"
const addressId = "5f02bf98d1dab54424726d86"

const adminUsername = 'blockchain.specialist.aut@gmail.com'
const adminPassword = '123456'
const adminObjectId = "5f017f55b6757b9512e53895"
const myEmail = "yousof.kakhki@gmail.com"
const myPassword = "تخسثحاتت"
const firstEditOrderItem = {
    product: "5f018769dc81e2a82da1a1d0",
    quantity: 1,
   
}
const secondEditOrderItem = {
    product: "5f047cd3b26623ce5db531d2",
    quantity: 0,
   
}

use(require('chai-datetime'))


const walletLength = 2
const activeOffersLength = 5
const userActiveOffersLength = 3

const user1Username = '09123456789'
const user1Password = '123456'
const user1UserId   = '5f85aa0587c5a814af5ee91a'
const user2Username = '09987654321'
const user2Password = '654321'
const user2UserId   = '5f85c496dd7afe1c771f64d0'


describe('1: scenario 1 : User 1 login', async() => {

    it('200 ---- login user 1', (done) => {
        apiU1.post('/auth/login')
        .expect(200)
        .send({
            username:user1Username,
            password:user1Password
        })
        .end((err, res) => {
            if(err){
                done(err)
            }
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('userId')
            expect(res.body.data.userId).to.be.equal(user1UserId)
            console.log('1: session is : ', res.headers['set-cookie'])
            set('loginUser1', 1)
            done()
        })
    })

})

describe('1: scenario 1 : User 1 create offer', async() => {

    let loginUser1
    before(async () => {

        loginUser1 = get('loginUser1')

    })

    it('200 ---- login user 1', (done) => {
        apiU1.post('/user/createOffer')
        .expect(200)
        .send({
            curGivenId  : "5f85b37801624217e5628235",
            curGivenVal : 10,
            curTakenId  : "5f85b38601624217e5628236",
            curTakenVal : 4,
            expDate     : "2020-11-22"
        })
        .end((err, res) => {
            if(err){
                done(err)
            }
            set('offerId', res.body.data.offerId)
            expect(res.body).to.have.property('data')
            done()
        })
    })

})

describe('1: scenario 1 : User 2 login', async() => {

    it('200 ---- login user 2', (done) => {
        apiU2.post('/auth/login')
        .expect(200)
        .send({
            username:user2Username,
            password:user2Password
        })
        .end((err, res) => {
            if(err){
                done(err)
            }
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('userId')
            expect(res.body.data.userId).to.be.equal(user2UserId)
            console.log('1: session is : ', res.headers['set-cookie'])
            set('loginUser2', 1)
            done()
        })
    })


})

describe('1: scenario 1 : User 1 accept offer', async() => {

    let loginUser2
    let offerId
    before(async () => {

        loginUser2 = get('loginUser2')
        offerId = get('offerId')

    })


    it('200 --- accept offer by user 2', (done) => {

        apiU2.get('/user/acceptOffer'+ '?' + 'offerId=' + offerId )
            .expect(200)
            .end((err, res) => {
                console.log('offerId', offerId)
                console.log('res body :', res.body)
                if (err){
                    done(err)
                }
                expect(res.body).to.have.property('data')
                expect(res.body.data).to.be.equal(true)             
                done()
        })
    })

})

describe('1: scenario 1 : User 1 get Accepted Offers', async() => {

    let loginUser1
    let offerId
    before(async () => {

        loginUser1 = get('loginUser1')
        offerId = get('offerId')

    })


    it('400 --- User 1 get Accepted Offers', (done) => {


        apiU1.get('/user/getUserAcceptedOffer')
            .expect(400)
            .end((err, res) => {
                if (err){
                    done(err)
                }          
                console.log('res.body -> ', res.body)
                expect(res.body.message).to.include('any')
                done()
        })
    })

})


// describe('1: scenario 1 : User 1', async () => {

//     it('200 --- login user 1', (done) => {
//         api.post('/auth/login')
//             .expect(200)
//             .send({
//                 username:user1Username,
//                 password:user1Password
//             })
//             .end((err, res) => {
//                 if (err) throw err
//                 expect(res.body).to.have.property('data')
//                 expect(res.body.data).to.have.property('userId')
//                 expect(res.body.data.userId).to.be.equal(user1UserId)
//                 console.log('1: session is : ', res.headers['set-cookie'])
//                 set('loginUser1', 34)
//                 done()
//             })
//     })


//     it('200 --- create offer by user 1', (done) => {
//         let temp
//         before(async () => {

//             loginUser1 = get('loginUser1')
    
//         })

//         api.post('/user/createOffer')
//             .expect(200)
//             .send({
//                 curGivenId  : "5f8313c6efb4720437033938",
//                 curGivenVal : 10,
//                 curTakenId  : "5f8313deefb4720437033939",
//                 curTakenVal : 4,
//                 expDate     : "2020-11-22"
                
//             })
//             .end((err, res) => {
//                 if (err) throw err
//                 console.log("m created offer : ", res.body.data.uuid)
//                 set('uuid', res.body.data.uuid)
//                 console.log('1: session is : ', res.headers['set-cookie'])
//                 done()
//             })
//     })

//     it('200 --- get user 1 Active Offers by user 1', (done) => {
//         let uuid
//         before(async () => {

//             uuid = get('uuid')
    
//         })

//         api.get('/user/getActiveOffers')
//             .expect(200)
//             .end((err, res) => {
//                 if (err) throw err
//                 expect(res.body.data.map((offer) => offer.uuid)).to.include(uuid)
//                 console.log('1: session is : ', res.headers['set-cookie'])
//                 done()
//             })
//     })

//     it('200 --- get users Active Offers by user 1', (done) => {
//         let uuid
//         before(async () => {

//             uuid = get('uuid')
    
//         })

//         api.get('/user/getUserActiveOffers')
//             .expect(200)
//             .end((err, res) => {
//                 if (err) throw err
//                 console.log('body : ',res.body.data)
//                 expect(res.body.data.map((offer) => offer.uuid)).to.include(uuid)
//                 console.log('1: session is : ', res.headers['set-cookie'])
//                 set('goToUser2', 34)
//                 done()
//             })
//     })

    



// })

// describe('2: scenario 1 : User 2', async () => {

//     it('200 --- login user 2', (done) => {
//         api.post('/auth/login')
//         .expect(200)
//         .send({
//             username:user2Username,
//             password:user2Password
//         })
//         .end((err, res) => {
//             if (err) throw err
//             expect(res.body).to.have.property('data')
//             expect(res.body.data).to.have.property('userId')
//             expect(res.body.data.userId).to.be.equal(user2UserId)
//             console.log('1: session is : ', res.headers['set-cookie'])
//             set('loginUser2', 34)
//             done()
//         })
//     })

//     it('200 --- accept offer by user 2', (done) => {
//         let uuid = get('uuid')
//         let loginUser1
//         let loginUser2
//         before(async () => {
//             loginUser1 = get('loginUser1')
//             loginUser2 = get('loginUser2')
//         })
//         console.log('loginUser1', loginUser1)
//         console.log('loginUser2', loginUser2)
//         api.get('/user/acceptOffer'+ '?' + 'uuid=' + uuid )
//             .expect(200)
//             .end((err, res) => {
//                 console.log('uuid', uuid)
//                 console.log('res body :', res.body)
//                 if (err){
//                     done(err)
//                 }
//                 expect(res.body).to.have.property('data')
//                 expect(res.body.data).to.be.equal(true)             
//                 done()
//         })
//     })

// })

