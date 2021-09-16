'use strict'

const request = require('request-promise-native')
const { expect } = require('chai')
// const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User } = require('../db/user')
const { Currencies } = require('../db/currencies')
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/hyperfire", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

const testUtils = {}
const store = {}

const constants = {
  BASE_URL: process.env.TEST_API_URL
}

testUtils.constants = constants

testUtils.testTxSaved = (api, txKey, txName) => {
  it(`should return correct sent transaction(${txName}) info.`, (done) => {
    api.get(`/service/transactionInfo?id=${testUtils.get(txKey)}`, { json: true })
    // .set('Authorization', `Bearer ${testUtils.get(jwtKey)}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        // expect(res.body.data).to.be.an('array')
        expect(res.body.data.action).to.equal(txName)

        done()
      })
  })
}

testUtils.testTransaction = (api, txBody, key) => {
  it(`should submit transaction (${key}) and return 200.`, (done) => {
    api.post('/blockchain/transactions?wait')
    // .set('Authorization', `Bearer ${testUtils.get(jwtKey)}`)
    // 	.set('Content-Type', 'application/octet-stream')
      .send({ txn: Buffer.from(txBody).toString('base64') })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.body.data).to.have.property('txId')
        expect(res.body.success).to.equal(true)
        testUtils.set(key, res.body.data.txId)

        done()
      })
  })
}

testUtils.sendTransaction = async (body) => {
  const res = await request.post(`${constants.BASE_URL}/transactions`, {
    json: true,
    timeout: 7000,
    body
  })

  return res
}

testUtils.getUserVerificationToken = async (email) => {
  const u = await User.findOne({ email: email })
  if (u != null && u.emailVerificationString != null) {
    return u.emailVerificationString.name
  }
}
testUtils.deleteCurrenciesColllection = async () => {
    
 
      const session = await mongoose.startSession()


       session.withTransaction(async ()=>{
       await Currencies.db.dropCollection("currencies", function (err, result) {
          console.log("result is " , result)
        })



      }).then(async ()=>{
         
      }).catch((err)=>{

        console.log(err)
      }).finally(()=>{

        session.endSession()
      })
      
   
 }


 testUtils.closeDB = async () => {
  await mongoose.disconnect()
}

testUtils.login = async (user, pass) => {
  const res = await request.post(`${constants.BASE_HOST + constants.BASE_URL}/api/login`, {
    json: true,
    timeout: 7000,
    body: {
      grant_type: 'password',
      username: user,
      password: pass
    }
  })

  return res
}

testUtils.clone = (data) => {
  return JSON.parse(JSON.stringify(data))
}

testUtils.set = (key, value) => {
  store[key] = value
}

testUtils.get = (key) => {
  return store[key]
}

// testUtils.verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET)
// }

testUtils.testAuth = (method, api, urlKey, data) => {
  it('should return authentication failed', (done) => {
    api[method](testUtils.get(urlKey))
      .send(data)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.body).to.have.property('errors')
        expect(res.body.errors).to.be.an('array')
        expect(res.body.errors[0].code).to.equal('authentication_failed')
        expect(res.body.errors[0].message).to.not.equal(null)
        expect(res.body.errors[0].message).to.have.lengthOf.above(3)

        done()
      })
  })
}



testUtils.sleep = (milliseconds) =>{
  const start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

module.exports = testUtils
