import * as redis from '../api/redis'
const fetch = require('node-fetch');


export const addDollarPrice = () => {
    fetch("https://api.tgju.online/v1/data/sana/json")
    .then(res => res.json())
    .then( json => {
        const price = Number(json['sana']['data'][16]['p'])
        redis.hashset("dollarPrice", price)
        .then((added) => {
            console.log("price of dollar added to redis" , added)
        })
        .catch((err) => {
            console.log("error is ", err)
        })  
    })
    .catch((err) => {
        console.log("error is", err )
    })
}