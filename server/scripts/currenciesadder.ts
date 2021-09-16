import * as redis from '../api/redis'
import { Currencies } from '../db/currencies'


export const curreniesAdder = ()=>{
    Currencies.find()
    .then((currs) => {
        const currsMap = currs.map((cur) => {
            let curInfo = {
                currencyName :cur.name,
                ab_name: cur.ab_name ,
                per_name: cur.per_name,
                icon: cur.icon,
                quantity: cur.quantity
            }            
            let curInfo2 = {
                currencyName :cur.name,
                ab_name: cur.ab_name ,
                per_name: cur.per_name,
                icon: cur.icon,
                quantity: cur.quantity,
                id : cur._id.toString()
            }            
            return redis.hashHMset(cur.name.toString(), curInfo2).then(()=>{
                return redis.hashHMset(cur._id.toString(), curInfo)      
             })   
            .then((added) => {
                console.log("added to redis successfully", added)
            })
            .catch((err)=>{
                console.log("the error is =>",err)
            })
        })
        Promise.all(currsMap)
        .catch((err) => {
            console.log(err)
        })
    })
    .catch((err)=>{
        console.log(err)
    })
}

