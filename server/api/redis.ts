import * as redis from 'redis'
import myError from './myError'
export const globalRedisClient = redis.createClient({ 
  port: process.env.REDIS_PORT, 
  host: process.env.REDIS_HOST,
  enable_offline_queue: false 
})
// globalRedisClient.auth(process.env.REDIS_PASS, (err) =>  {
//   if (err) console.log(err);
// })
globalRedisClient.on('connect', function (err) {
  if(err) {
    console.log(err)
  } else {
    console.log('Redis-server is connected')
  }
})

globalRedisClient.on('error', function (err) {
  console.log('Error ' + err)
})

export const hashget = (tag) => { // It is corresponded to hashset
  return new Promise((resolve, reject) => {
    globalRedisClient.get(tag, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}

export const hashset = (tag, val) => { // value could be only a string
  return new Promise((resolve, reject) => {
    globalRedisClient.set(tag, val, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}

export const hashGetAll = (tag) => { // It is corresponded to hashHMset
  return new Promise((resolve, reject) => {
    globalRedisClient.hgetall(tag, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}

export const hashHMset = (tag, val) => { // value could be object!
  return new Promise((resolve, reject) => {
    globalRedisClient.hmset(tag, val, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}

export const hashSetMembers = (tag) => {
  return new Promise((resolve, reject) => {
    globalRedisClient.smembers(tag, (err, reply) => {
      if (err) {
        reject(err)
      } else {
        resolve(reply)
      }
    })
  })
}

export function getCurrentPrice(currency){
  //API for getting current currency price
  return hashGetAll(currency.toString())
  .then((currencyInfo: any) => {
      return hashGetAll(currencyInfo.ab_name.toString() + "-g")
      .then((currencyInstantPrice: any) => {
        if(currencyInstantPrice) {
          return hashget("dollarPrice")
          .then((rialPrice) => {
            if(rialPrice) {
              return Number(currencyInstantPrice.current) * Number(rialPrice)
            } else {
              const error = new myError(
                'It is not possible to get price currently!',
                400,
                11,
                'امکان قیمت گیری در حال حاضر وجود ندارد!',
                'خطا رخ داد'
              )
              throw error
            }
          })
          .catch((err) => {
            throw err
          })
        } else {
          const error = new myError(
            'It is not possible to get price currently!',
            400,
            11,
            'امکان قیمت گیری در حال حاضر وجود ندارد!',
            'خطا رخ داد'
            )
            throw error
        }  
      })
      .catch((err) => {
          throw err
      })
  })
  .catch((err) => {
      throw err
  })
}

