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
const uuid = require('uuid/v4')
const { Product } = require('../db/products')
const { connected } = require('process')
const api = supertest(process.env.TEST_API_URL,
    // {
    // before: function (req) {
    //     req.set('authorization', true);
    //   }
    // }
)
const apiUser2 = supertest(process.env.TEST_API_URL)
const apiAdmin = supertest(process.env.TEST_API_URL)
const randomNum = parseInt(Math.random() * 100000000000000)
const firstProduct = "5f047cd3b26623ce5db531d2"
const firstQuantity = 2
const secondProduct = "5f018769dc81e2a82da1a1d0"
const secondQuantity = 2
const myUserId = '5f017f6db6757b9512e53896'
const paymentMethod = "Cash"
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

describe('1: get a session', async () => {
    it('200', (done) => {
        api.get('/service/getSession')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log('1: session is : ', res.headers['set-cookie'])
                set('cookie', res.headers['set-cookie'])
                done()
            })
    })
})

describe('2: get user basket', async () => {
    let cookie
    before(async () => {
        cookie = get('cookie')
    })
    it('200', (done) => {
        api.get('/service/getUserBasket')
            .expect(200)
            .set('Cookie', cookie)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.be.equal('There is no card!')
                //    expect(res.body.data).to.have.property('sessionId')
                done()
            })
    })

})
describe('3: add to session basket', async () => {
    let cookie
    before(async () => {
        cookie = get('cookie')
        //console.log('add to basket with the first cookie', cookie)
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({})
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                done()
            })
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({ productId: 3123123 })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("محصول")

                done()
            })
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({ productId: randomNum })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("محصول")

                done()
            })
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({ productId: randomNum.toString() })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("شناسه")

                done()
            })
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({ productId: new mongodb.ObjectID })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("تعداد")

                done()
            })
    })
    it('422', (done) => {
        api.post('/service/addToBasket')
            .expect(422)
            .set('Cookie', cookie)
            .send({
                productId: new mongodb.ObjectID,
                quantity: "fasdf"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("تعداد")

                done()
            })
    })
    it('400', (done) => {
        api.post('/service/addToBasket')
            .expect(400)
            .set('Cookie', cookie)
            .send({
                productId: new mongodb.ObjectID,
                quantity: randomNum
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("وجود")

                done()
            })
    })
    it('400', (done) => {
        api.post('/service/addToBasket')
            .expect(400)
            .set('Cookie', cookie)
            .send({
                productId: "5f047cd3b26623ce5db531d2",
                quantity: randomNum
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.metaData).to.have.property('message')
                expect(res.body.metaData.message).to.contain("موجود")

                done()
            })
    })
    it(`add ${firstProduct} with the quantity of ${firstQuantity}`, (done) => {
        api.post('/service/addToBasket')
            .expect(200)
            .set('Cookie', cookie)
            .send({
                productId: firstProduct,
                quantity: firstQuantity
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                let temp = cookie[0].toString().replace("sessionId=", '');
                let  subCookieSessionId = temp.substring(temp.indexOf(";")-1,temp.indexOf(";"))
                expect(res.body.data).to.have.property('sessionId')
                expect(res.body.data.sessionId.substring(res.body.data.sessionId.length-1, res.body.data.sessionId.length)).to.be.equal(subCookieSessionId)
                expect(res.body.data).to.have.property('items')
                expect(res.body.data.items).to.be.an('array')

                expect(res.body.data.items.map((item) => item.product)).to.include(firstProduct)
                expect(res.body.data.items.map((item) => item.quantity)).to.include(firstQuantity)
                done()
            })
    })

})

describe('4 : login user and merge with previous session', async () => {
    let cookie
    let basketSessionId
    before(async () => {
        cookie = get('cookie')
        basketSessionId = get('basketSessionId')
        //  console.log("test 's cookie is", cookie)
    })

    it('200', (done) => {
        api.post('/auth/login')
            .expect(200)
            //.set('Cookie', cookie)
            .send({ email: myEmail, password: myPassword })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('userId')
                expect(res.body.data.userId).to.be.equal(myUserId)

                done()
            })
    })

    // it('422', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(422)

    //     .send({ productId : 3123123 })
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("محصول")

    //         done()
    //     })
    // })
})

describe('5 : logout user to invalidate previous cookie', async () => {
   

    it('200', (done) => {
        api.get('/auth/logout')
            .expect(200)
            //.set('Cookie', cookie)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                done()
            })

    })
})
describe('6 : retreive a new Session', async () => {
    it('200', (done) => {
        api.get('/service/getSession')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.headers['set-cookie'])
                set('cookie2', res.headers['set-cookie'])
                done()
            })
    })
})

describe(`7 : add ${secondProduct} with the quantity of ${secondQuantity} with new session`, async () => {
    let cookie2
    before(async () => {
        cookie2 = get('cookie2')
        console.log('secondCookie is ', cookie2)
    })
    it('200', (done) => {
        api.post('/service/addToBasket')
            .expect(200)
            .set('Cookie', cookie2)
            .send({
                productId: secondProduct,
                quantity: secondQuantity
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                let temp = cookie2[0].toString().replace("sessionId=", '');
                let  subCookieSessionId = temp.substring(temp.indexOf(";")-2,temp.indexOf(";"))
                 expect(res.body).to.have.property('data')
                 expect(res.body.data).to.be.an.st
                expect(res.body.data).to.have.property('items')
                expect(res.body.data.items).to.be.an('array')
                expect(res.body.data.items.map((item) => item.product)).to.include(secondProduct)
                expect(res.body.data.items.map((item) => item.quantity)).to.include(secondQuantity)
                done()
            })
    })
})

describe('8 : login user for the second time therefor merge basket ', async () => {
   
    it('login', (done) => {
        api.post('/auth/login')
            .expect(200)
            // .set('Cookie', cookie2)
            .send({ email: "yousof.kakhki@gmail.com", password: "تخسثحاتت" })
            .end((err, res) => {

                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('userId')
                expect(res.body.data.userId).to.be.equal(myUserId)

                done()
            })
    })
})
describe('9 : addding order for merged product ', async () => {
    let cookie2
    before(async () => {
        cookie2 = get('cookie2')
        //  console.log("test 's cookie is", cookie)
    })

    // it('sending another json', (done) => {
    //     api.post('/user/addOrder')
    //         .expect(422)
    //         .set('Cookie', cookie2)
    //         .send({ email: "yousof.kakhki@gmail.com", password: "تخسثحاتت" })
    //         .end((err, res) => {

    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body.data).to.have.property('userId')
    //             expect(res.body.data.userId).to.be.equal(myUserId)

    //             done()
    //         })
    // })
    // it('not sending anything', (done) => {
    //     api.post('/user/addOrder')
    //         .expect(422)
    //         .set('Cookie', cookie2)
    //         .send()
    //         .end((err, res) => {

    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body.data).to.have.property('userId')
    //             expect(res.body.data.userId).to.be.equal(myUserId)

    //             done()
    //         })
    // })
    // it('not even a send function', (done) => {
    //     api.post('/user/addOrder')
    //         .expect(422)
    //         .set('Cookie', cookie2)
    //         .end((err, res) => {

    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body.data).to.have.property('userId')
    //             expect(res.body.data.userId).to.be.equal(myUserId)

    //             done()
    //         })
    // })
    // it('incomplete send json with invalid type for the first property', (done) => {
    //     api.post('/user/addOrder')
    //         .expect(422)
    //         .set('Cookie', cookie2)
    //         .send ({paymentMethod : 'fasdfasdf'})
    //         .end((err, res) => {

    //             if (err) {
    //                 done(err)
    //             }
    //             expect(res.body.data).to.have.property('userId')
    //             expect(res.body.data.userId).to.be.equal(myUserId)

    //             done()
    //         })
    // })
    it('sending a valid json consisting of addressId and PaymentMethod', (done) => {
        api.post('/user/addOrder')
            .expect(200)
            .set('Cookie', cookie2)
            .send({ paymentMethod: paymentMethod, addressId: addressId })
            .end((err, res) => {
                
                if (err) {
                    done(err)
                }

               // expect(res.body.data).to.have.property('authority')
                expect(res.body.data).to.have.property('order')
                set('order', res.body.data.order)
             //   set('authority', res.body.data.authority)
                done()

            })
    })
})
// beforeEach(done => setTimeout(done, 20000));
describe('10 : checking user order by calling get order on previous order ', async () => {
    let cookie2
    let order
    before(async () => {
        cookie2 = get('cookie2')
        order = get('order')

    })
    it(`getting user order for  `, (done) => {
        api.get(`/user/getUserOrder?orderIdOp=${order}`)
            .expect(200)
            .set('Cookie', cookie2)
            .end((err, res) => {

                if (err) {
                    done(err)
                }

                expect(res.body.data).is.exist()

                done()

            })
    })
})



describe('11 : loggin admin ', async () => {
    it('should return 200.', (done) => {
        apiAdmin.post('/admin/login')
            // .set('Authorization', `Bearer ${testUtils.get(jwtKey)}`)
            .send({ email: adminUsername, password: adminPassword })
            .expect(200)

            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(res.body.data.userId).to.equal(adminObjectId)
                done()
            })
    })
})
describe('12 : editting order by admin ', async () => {
    //let cookie2
    let order
    before(async () => {
        //    cookie2 = get('cookie2')
        order = get('order')

    })
    it('editing order', (done) => {
        apiAdmin.post('/admin/editOrder')
            .expect(200)
            .send({
                orderOrderId: order,
                "delivery" : {
                    "status" : "Received"

                },
                "orderAddress": {
                    "phone" : "lkasdjfaljk"
                },
                "orderItems": [
                    firstEditOrderItem,
                    secondEditOrderItem
                ]

            })
            // .set('Cookie', cookie2)
            .end((err, res) => {

                if (err) {
                    done(err)
                }

                expect(res.body.data).have.property('status')
                expect(res.body.data.status).to.be.equal('Edited')
                // expect(res.body.data.address.block).equal('123123123312312312312asdfaksdfklasdjflajsdf3')
                // expect(res.body.data.items).to.be.an('array')
                // expect(res.body.data.items[0].quantity).to.be.equal(secondEditOrderItem.quantity)
                // expect(res.body.data.items[1].quantity).to.be.equal(firstEditOrderItem.quantity)
                // //expect(res.body.data.order.orderStatus.status).equal('Edited')
                done()

            })
    })
})


describe('13 : getting the third session to test basket', async () => {
    it('200', (done) => {
        api.get('/service/getSession')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                console.log(res.headers['set-cookie'])
                set('cookie3', res.headers['set-cookie'])
                done()
            })
    })
})
describe('14 : login user  ', async () => {


    it('login', (done) => {
        api.post('/auth/login')
            .expect(200)
            //.set('Cookie', cookie2)
            .send({ email: "yousof.kakhki@gmail.com", password: "تخسثحاتت" })
            .end((err, res) => {

                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('userId')
                expect(res.body.data.userId).to.be.equal(myUserId)

                done()
            })
    })
})
describe('15 : add to userBasket for the second time', async () => {

    let cookie3
    before(async () => {
        cookie3 = get('cookie3')

    })
    it('200', (done) => {
        api.post('/service/addToBasket')
            .expect(200)
          //  .set('Cookie', cookie3)
            .send({
                productId: secondProduct,
                quantity: secondQuantity
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('items')
                expect(res.body.data.items).to.be.an('array')
                expect(res.body.data.items.map((item) => item.product)).to.include(secondProduct)
                expect(res.body.data.items.map((item) => item.quantity)).to.include(secondQuantity)
                done()
            })
    })
})
// describe('16 : loggin admin in', async () => {

//     it('should return 200.', (done) => {
//         apiAdmin.post('/admin/login')
//             // .set('Authorization', `Bearer ${testUtils.get(jwtKey)}`)
//             .send({ email: adminUsername, password: adminPassword })
//             .expect(200)
//             //.set('Cookie', cookie2)
//             .end((err, res) => {
//                 if (err) {
//                     return done(err)
//                 }
//                 expect(res.body.data.userId).to.equal(adminObjectId)
//                 done()
//             })
//     })
// })
// describe('17 : editting product by admin', async () => {

//     it('changing price', (done) => {
//         apiAdmin.post('/admin/editProducts')
//             // .set('Authorization', `Bearer ${testUtils.get(jwtKey)}`)
//             .send({
//                 "_id": "5f018769dc81e2a82da1a1d0",
//                 "name": "test"
//             })
//             // .set('Cookie', cookie2)
//             .expect(200)
//             .end((err, res) => {
//                 if (err) {
//                     return done(err)
//                 }
//                 expect(res.body).to.have.property('success')
//                 done()
//             })
//     })
// })
describe('18 : login user ', async () => {
 
    it('login', (done) => {
        api.post('/auth/login')
            .expect(200)

            .send({ email: "yousof.kakhki@gmail.com", password: "تخسثحاتت" })
            .end((err, res) => {

                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('userId')
                expect(res.body.data.userId).to.be.equal(myUserId)

                done()
            })
    })
})
// describe('19 : add order ', async () => {

//     it('sending a valid json consisting of addressId and PaymentMethod and should fail', (done) => {
//         api.post('/user/addOrder')
//             .expect(400)
//             //  .set('Cookie', cookie3)
//             .send({ paymentMethod: paymentMethod, addressId: addressId })
//             .end((err, res) => {

//                 if (err) {
//                     done(err)
//                 }

//                 expect(res.body.metaData).have.property('message')
//                 done()

//             })
//     })
// })

describe('20 : GET userBasket to fix user s basket ' , async () => {

    it('200', (done) => {
        api.get('/service/getUserBasket')
            .expect(200)
            //.set('Cookie', cookie)
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                expect(res.body).to.have.property('message')
                //expect(res.body.message).to.be.equal('There is no card!')
                //    expect(res.body.data).to.have.property('sessionId')
                done()
            })
    })

})
describe('21 : adding order ', async () => {

    it('sending a valid json consisting of addressId and PaymentMethod and should fail', (done) => {
        api.post('/user/addOrder')
            .expect(200)
            //  .set('Cookie', cookie3)
            .send({ paymentMethod: paymentMethod, addressId: addressId })
            .end((err, res) => {

                if (err) {
                    done(err)
                }
                expect(res.body.data).to.have.property('authority')
                expect(res.body.data).to.have.property('order')
                set('order2', res.body.data.order)
                set('authority2', res.body.data.authority)
                done()
               
                

            })
    })
})
// describe('verify order ', async () => {
//     let cookie2
//     let authority
//     let orderId
//     let amount
//     before(async () => {
//         cookie2= get('cookie2')
//         authority = get('authority')
//         orderId = get('orderId')
//         amount = get('amount')
//       //  console.log("test 's cookie is", cookie)
//   describe('19 : add order ', async () => {

//     it('sending a valid json consisting of addressId and PaymentMethod and should fail', (done) => {
//         api.post('/user/addOrder')
//             .expect(400)
//             //  .set('Cookie', cookie3)
//             .send({ paymentMethod: paymentMethod, addressId: addressId })
//             .end((err, res) => {

//                 if (err) {
//                     done(err)
//                 }

//                 expect(res.body.metaData).have.property('message')
//                 done()

//             })
//     })
// })  })
// it('verify using saved amount pid authority', (done) => {
//     api.get(`/user/verifyOrder?Amount=${amount}&pid=${orderId}&Authority=${authority}&Status=OK`)
//         .expect(302)
//         .set('Cookie', cookie2)
//         .end((err, res) => {


//             if (err) {
//                 done(err)
//             }


//             done()

//         })
// })
// })
    // it('422', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(422)
    //     .set('Cookie', cookie)
    //     .send({ productId :randomNum })
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("محصول")

    //         done()
    //     })
    // })
    // it('422', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(422)
    //     .set('Cookie', cookie)
    //     .send({ productId :randomNum.toString() })
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("شناسه")

    //         done()
    //     })
    // })
    // it('422', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(422)
    //     .set('Cookie', cookie)
    //     .send({ productId :new mongodb.ObjectID })
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("تعداد")

    //         done()
    //     })
    // })
    // it('422', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(422)
    //     .set('Cookie', cookie)
    //     .send({ productId :new mongodb.ObjectID ,
    //     quantity : "fasdf"})
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("تعداد")

    //         done()
    //     })
    // })
    // it('400', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(400)
    //     .set('Cookie', cookie)
    //     .send({ productId :new mongodb.ObjectID ,
    //     quantity : randomNum})
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("پیدا")

    //         done()
    //     })
    // })
    // it('400', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(400)
    //     .set('Cookie', cookie)
    //     .send({ productId :"5f047cd3b26623ce5db531d2" ,
    //     quantity : randomNum})
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.metaData).to.have.property('message')
    //         expect(res.body.metaData.message).to.contain("موجود")

    //         done()
    //     })
    // })
    // it('200', (done) => {
    //     api.post('/service/addToBasket')
    //     .expect(200)
    //     .set('Cookie', cookie)
    //     .send({ productId : firstProduct ,
    //     quantity :firstQuantity})
    //     .end((err, res) => {
    //         if (err) {
    //             done(err)
    //         }
    //         expect(res.body.data).to.have.property('items')
    //         expect(res.body.data.items).to.be.an('array')
    //         expect(res.body.data.items.map((item) =>item.product)).to.include(firstProduct)
    //         expect(res.body.data.items.map((item) =>item.quantity)).to.include(firstQuantity)
    //         done()
    //     })
    // })

//})