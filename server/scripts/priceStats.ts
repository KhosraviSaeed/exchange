import * as moment from 'moment-timezone'
import { logger } from "../api/logger"
import { DailyPriceStat } from "../db/dailyPriceStats"
import { GlobalHourlyPrice } from "../db/globalHourlyPrice"
import { GlobalWeeklyPrice } from "../db/globalWeeklyPrice"
import { GlobalDailyPrice } from "../db/globalDailyPrice"
import { GlobalYearlyPrice } from "../db/globalYearlyPrice"
import { GlobalMonthlyPrice } from "../db/globalMontlyPrice"
import { ContinuesPriceStat } from "../db/continuesPriceStats"
import { nextTick } from 'process'
import { promise } from 'bcrypt/promises'
import { Currencies } from '../db/currencies'

import * as redis from '../api/redis'
import { timeEnd } from 'console'
import * as mongoose from 'mongoose'
import { check } from 'express-validator'

const fetch = require('node-fetch');


export const continuesStatsOfOrders = () => {
    let currencyHashMap = new Map();

    const currencyFetcher =()=>{ return  Currencies.find().then( (currency)=>{
     //   console.log("in currency",currency)

         if(currency&& currency.length>0){
            return currency.map((curr)=>{
         //       console.log("pushed " , curr.ab_name)
                return currencyHashMap.set(curr.ab_name,curr._id)
             })
          
         }
      }).catch((err)=>{

       // console.log("in currency catch" ,err)
      })
    }
    Promise.all([currencyFetcher()]).then(()=>{
        //console.log("map is ", currencyHashMap)
        let currenciesString = ""
        //Map.prototype.keys(currencyHashMap)
        const currencyIterator = ()=>{ 
          Array.from( currencyHashMap.keys()).map((element,index)=>{
        //    console.log("element is ", index)
            currenciesString += element
            if(index+1 !=currencyHashMap.size){
                currenciesString+=","
            }
            
          //  console.log("iterating currencString", currenciesString)
            

         })
     
        }
        Promise.all([currencyIterator()]).then(()=>{
         //   console.log("currencies String is ", currenciesString)
            fetch('https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&interval=7d,30d,1d,1h,365d&ids='+currenciesString)
            .then(res => res.json())
            .then( json => {
                json.map(async(element) => {
                    const currentPrice = element["price"];
                
                  //  console.log("currentprice is", currentPrice)
                  const lastHourPrice = Number( element["price"])-Number(element["1h"]["price_change"]) 
                  const yesterDayPrice = Number( element["price"])-Number(element["1d"]["price_change"])
                  const lastWeekPrice = Number( element["price"])-Number(element["7d"]["price_change"]) 
                  const lastMonthPrice = Number( element["price"])-Number(element["30d"]["price_change"]) 
                  const lastYearPrice = Number( element["price"])-Number(element["365d"]["price_change"]) 
                  const lastHourVolume =  Number(element["1h"]["volume"])
                  const yesterDayVolume =  Number(element["1d"]["volume"])
                  const lastWeekVolume =  Number(element["7d"]["volume"])
                  const lastMonthVolume =  Number(element["30d"]["volume"])
                  const lastYearVolume =  Number(element["365d"]["volume"])
                  const elementName =  element["symbol"]
                  const currentTimeInGreenwich = moment().tz('Etc/Greenwich')
                  const currentTimelastHour = moment().tz('Etc/Greenwich').subtract({hour: 1})
                  const currentTimeYesterday =moment().tz('Etc/Greenwich').subtract({day: 1})
                  const currentTimeLastWeekNumber =moment().tz('Etc/Greenwich').subtract({week : 1}).week()

             //     console.log("last week numberrrrrrrrrrrrrrrrrr " , currentTimeLastWeekNumber)
                  const currentTimeLastMonth =moment().tz('Etc/Greenwich').subtract({day: 30})
                  const currentTimeLastYear =moment().tz('Etc/Greenwich').subtract({day : 365})
                  
                  const yesterDayStartTime = moment().tz('Etc/Greenwich').subtract({day: 1}).format("YYYY-MM-DD")
                  const todayStartTime = moment().tz('Etc/Greenwich').format("YYYY-MM-DD")
                  const lastWeekStartTime = moment().tz('Etc/Greenwich').subtract({week: 1}).startOf('week').format("YYYY-MM-DD")
                  const lastWeekEndTime = moment().tz('Etc/Greenwich').subtract({week: 1}).endOf('week').format("YYYY-MM-DD")
                  const lastMonthStartTime = moment().tz('Etc/Greenwich').subtract({day: 30}).startOf('month').format("YYYY-MM-DD")
                  const lastMonthEndTime = moment().tz('Etc/Greenwich').subtract({day: 30}).endOf('month').format("YYYY-MM-DD")
                  const lastYearStartTime = moment().tz('Etc/Greenwich').subtract({day: 365}).startOf('year').format("YYYY-MM-DD")
                  const lastYearEndTime = moment().tz('Etc/Greenwich').subtract({day: 365}).endOf('year').format("YYYY-MM-DD")
                 // const lastHourStartTime = moment().tz('Etc/Greenwich').subtract({day: 1}).format("YYYY-MM-DD")
                 // console.log("currentTimeLastMonth", currentTimeLastMonth)
                  let currentTimeMinute = currentTimeInGreenwich.minute()
                  let hourlyGlobalPrice;
                  let dailyGlobalPrice;
                  let weeklyGlobalPrice;
                  let monthlyGlobalPrice;
                  let yearlyGlobalPrice;
                  const session = await mongoose.startSession()








                          
                  redis.hashGetAll(elementName+'-g').then((rObject: any)=>{
                    if(rObject&&rObject.current){
             //       console.log("rObject is", rObject)
                    let newMin = rObject.min
                    let newMax = rObject.max
                    
                    if(currentPrice<newMin){
                        newMin = currentPrice

                    }
                    if(currentPrice>newMax){
                        newMax = currentPrice
                    }
                    redis.hashHMset(elementName+'-g',{
                        current : currentPrice ,
                        min: newMin,
                        max : newMax,
                        yesterDayPrice
                    }).then(()=>{
                        
                    //    console.log("element is ", element)
                      //  const yesterDayPriceChange = Number(element["1d"]["price_change"])  
                    })
                    }
                    else {
          //          console.log("in elseeeeeeeeeeeeeeeeeee")
                    redis.hashHMset(elementName+'-g',{
                        current : currentPrice ,
                        min: currentPrice,
                        max : currentPrice,
                         yesterDayPrice
                    }).then(()=>{
                        
                    //    console.log("element is ", element)
                      //  const yesterDayPriceChange = Number(element["1d"]["price_change"])  
                    })
                }
                }).catch((err)=>{
                   // console.log("in catch error",err)                        
                })
            
                
                  
                const dbWeekly = ()  => {
                    //console.log("in db daily method")
                    
                    return redis.hashget(elementName+"-g"+"-w").then((thatWeek)=>{
                      // console.log("trollo ",new Date(hourString))
                        if(thatWeek&&Number(thatWeek) === Number(moment().tz('Etc/Greenwich').subtract({ week : 1}).week())){
                   //         console.log("exisst",thatWeek)
                    //        console.log("exist")
                        }
                        else {
                           // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                          
                            let minWeek ;
                            let maxWeek ;
                            const minCalculatorForLastWeek = ()=>{
          //                      console.log(" lastWeekStartTime :: ",   lastWeekStartTime)
          //                      console.log(" lastWeekEndTime :: ",   lastWeekEndTime)
                                   return GlobalDailyPrice.find({
                                       timeStamp :   { $gte: lastWeekStartTime, $lte: lastWeekEndTime }
                                   }).then((sevenValues)=>{
                //                            console.log("result of 7 objects for weekly", sevenValues)
                                           return sevenValues.map((element)=>{
                                            
                                            if(element.price.min<minWeek||!minWeek){

                                                minWeek = element.price.min
               //                                 console.log("minWeek is",minWeek)
                                            }
                                            if(element.price.max>maxWeek||!maxWeek){

                                               
                                                maxWeek = element.price.max
                //                                console.log("maxWeek is",maxWeek)
                                            }

                                           })


                                   })

                            }
                           return Promise.all([minCalculatorForLastWeek()]).then(()=>{

                                
                                        const weeklyDbData = {
                                            timeStamp  : moment().tz('Etc/Greenwich').subtract({week : 1}).format(),
                                            price : {price : lastWeekPrice,
                                            min :minWeek ,
                                            max : maxWeek
                                            },
                                            volume : lastWeekVolume,
                                            currencyId : currencyHashMap.get(elementName)
                                        }
                                    
                                    weeklyGlobalPrice = weeklyDbData
                //                   console.log("setted weekly in db",weeklyGlobalPrice)  
                                   
                                    return weeklyGlobalPrice
                                
                            }).catch((err)=>{

                            })
                           
                        
                        }}).catch((err)=>{

                            console.log(err)
                        })
                            
                        
                    }
                     const dbMonthly = ()  => {
                    //console.log("in db daily method")
                    
                    return redis.hashget(elementName+"-g"+"-m").then((thatmonth)=>{
                      // console.log("trollo ",new Date(hourString))
                        if(thatmonth&&Number(thatmonth) === Number(moment().tz('Etc/Greenwich').subtract({ day : 30}).month()+1)){
                //            console.log("exisst",thatmonth)
                    //        console.log("exist")
                        }
                        else {
                           // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                          
                            let minMonth ;
                            let maxMonth ;
                            const minCalculatorForLastMonth= ()=>{
               //                 console.log(" lastMonthStartTime :: ",   lastMonthStartTime)
               //                 console.log(" lastMonthEndTime :: ",   lastMonthEndTime)
                                   return GlobalDailyPrice.find({
                                       timeStamp :   { $gte: lastMonthStartTime, $lte: lastMonthEndTime }
                                   }).then((thirtyValues)=>{
                  //                          console.log("result of 30 objects for monthly", thirtyValues)
                                           return thirtyValues.map((element)=>{
                                            
                                            if(element.price.min<minMonth||!minMonth){

                                                minMonth = element.price.min
                     //                           console.log("minMonth is",minMonth)
                                            }
                                            if(element.price.max>maxMonth||!maxMonth){

                                                maxMonth = element.price.max
               //                                 console.log("maxMonth is",maxMonth)
                                            }

                                           })


                                   })

                            }
                           return Promise.all([minCalculatorForLastMonth()]).then(()=>{

                                
                                        const monthlyDbData = {
                                            timeStamp  : moment().tz('Etc/Greenwich').subtract({day : 30}).format(),
                                            price : {price : lastMonthPrice,
                                            min :minMonth ,
                                            max : maxMonth
                                            },
                                            volume : lastMonthVolume,
                                            currencyId : currencyHashMap.get(elementName)
                                        }
                                    
                                        monthlyGlobalPrice = monthlyDbData
                 //                       console.log("setted monthly in db",monthlyGlobalPrice)  
                                   
                                        return monthlyGlobalPrice
                                
                            }).catch((err)=>{

                            })
                           
                        
                        }}).catch((err)=>{

                            console.log(err)
                        })
                            
                        
                    }
                    const dbYearly = () => {
                        //console.log("in db daily method")
                        
                        return redis.hashget(elementName+"-g"+"-y").then((thatYear)=>{
                          // console.log("trollo ",new Date(hourString))
                            if(thatYear&&Number(thatYear) === Number(moment().tz('Etc/Greenwich').subtract({ day : 365}).year())){
               //                 console.log("exisst",thatYear)
                        //        console.log("exist")
                            }
                            else {
                               // console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                              
                                let minYear ;
                                let maxYear ;
                                const minCalculatorForLastYear= ()=>{
                 //                   console.log(" lastYearStartTime :: ",   lastYearStartTime)
                 //                   console.log(" lastYearEndTime :: ",   lastYearEndTime)
                                       return GlobalMonthlyPrice.find({
                                           timeStamp :   { $gte: lastYearStartTime, $lte: lastYearEndTime }
                                       }).then((thirtyValues)=>{
                       //                         console.log("result of 12 objects for yearly", thirtyValues)
                                               return thirtyValues.map((element)=>{
                                                
                                                if(element.price.min<minYear||!minYear){
    
                                                    minYear = element.price.min
                           //                         console.log("minYear is",minYear)
                                                }
                                                if(element.price.max>maxYear||!maxYear){
    
                                                    maxYear = element.price.max
                         //                           console.log("maxYearis",maxYear)
                                                }
    
                                               })
    
    
                                       })
    
                                }
                               return Promise.all([minCalculatorForLastYear()]).then(()=>{
    
                                    
                                            const yearlyDbData = {
                                                timeStamp  : moment().tz('Etc/Greenwich').subtract({day : 30}).format(),
                                                price : {price : lastYearPrice,
                                                min :minYear ,
                                                max : maxYear
                                                },
                                                volume : lastYearVolume,
                                                currencyId : currencyHashMap.get(elementName)
                                            }
                                        
                                            yearlyGlobalPrice = yearlyDbData
                      //                      console.log("setted yearly in db",yearlyGlobalPrice)  
                                       
                                            return yearlyGlobalPrice
                                    
                                }).catch((err)=>{
    
                                })
                               
                            
                            }}).catch((err)=>{
    
                      //          console.log(err)
                            })
                                
                            
                        }
                const dbDaily = ()  => {
                    //console.log("in db daily method")
                    
                    return redis.hashget(elementName+"-g"+"-d").then((thatDay)=>{
                      // console.log("trollo ",new Date(hourString))
                        if(thatDay&&Number(thatDay) === Number(currentTimeYesterday.date())){
               //             console.log("exisst",thatDay)
                    //        console.log("exist")
                        }
                        else {
               //             console.log("must be yesterday with greenwich date",currentTimeInGreenwich.subtract({day : 1}).format())
                          
                            let minDay ;
                            let maxDay ;
                            const minCalculatorForYesterDay = ()=>{
                                   return GlobalHourlyPrice.find({
                                       timeStamp :   { $gte: yesterDayStartTime, $lt: todayStartTime }
                                   }).then((twentyfourPrices)=>{
                     //                       console.log("prices", twentyfourPrices)
                                           return twentyfourPrices.map((element)=>{
                                            
                                            if(element.price.min<minDay||!minDay){

                                                minDay = element.price.min
                   //                             console.log("minDay is",minDay)
                                            }
                                            if(element.price.max>maxDay||!maxDay){

                                               
                                                maxDay = element.price.max
                        //                        console.log("maxDay is",maxDay)
                                            }

                                           })


                                   })

                            }
                           return Promise.all([minCalculatorForYesterDay()]).then(()=>{

                                
                                        const dailyDbData = {
                                            timeStamp  : currentTimeYesterday.format(),
                                            price : {price : yesterDayPrice,
                                            min :minDay ,
                                            max : maxDay
                                            },
                                            volume : yesterDayVolume,
                                            currencyId : currencyHashMap.get(elementName)
                                        }
                                    
                                    dailyGlobalPrice = dailyDbData
                          //         console.log("setted daily in db",dailyGlobalPrice)  
                                   
                                    return dailyGlobalPrice
                                
                            }).catch((err)=>{

                            })
                           
                        
                        }}).catch((err)=>{

                            console.log(err)
                        })
                            
                        
                    }
            
                const dbHourly = ()  => {
                  //      console.log("in db hourly method")
                        return redis.hashget(elementName+"-g"+"-h").then((thatHour)=>{
                 //          console.log("that hour is " ,thatHour)
                 //          console.log("currentTime last hour is " ,currentTimelastHour.hour())
                            if(thatHour&&Number(thatHour) === Number(currentTimelastHour.hour())){
              //                 return console.log("exisst",thatHour)
                        //        console.log("exist")
                            }
                            else {
                              return  redis.hashGetAll(elementName+'-g').then((rObject: any)=>{
                                    if(rObject&&rObject.current){
                             //       console.log("rObject is", rObject)
                                    let hourlyMin = Number(rObject.min)
                                    let hourlyMax = Number(rObject.max)
                                      
          //                      console.log("must be last hour with greenwich date",currentTimeInGreenwich.subtract({hours : 1}).format())
                                const hourlyDbData = {
                                    timeStamp  : currentTimelastHour.format(),
                                    price : {
                                        price: lastHourPrice,
                                        min : hourlyMin ,
                                        max : hourlyMax
                                    } ,
                                    volume : lastHourVolume,
                                    currencyId : currencyHashMap.get(elementName)
                                }
                              hourlyGlobalPrice =  hourlyDbData
            //                  console.log("setted hourly in db",hourlyGlobalPrice)  
                              
                              return hourlyGlobalPrice}
                            else {
          //                      console.log("object is not righ",rObject)
                                

                            }})
                            }}).catch((err)=>{

                                console.log(err)
                            })
                                
                            
                        }
                        
            
                        
                                    return Promise.all([dbHourly(),dbDaily(),dbWeekly(),dbMonthly(),dbYearly()]).then(()=>{
                                        session.withTransaction(async ()=>{ 
                                           // console.log("hourrrrrrly" , hourlyGlobalPrice)
                                            if(hourlyGlobalPrice)
                                            await GlobalHourlyPrice.create([hourlyGlobalPrice],{session})
                      //                      console.log("in here")
                                            if(weeklyGlobalPrice)
                                            {
                     //                           console.log("let 's create weekly",weeklyGlobalPrice)
                                            await GlobalWeeklyPrice.create([weeklyGlobalPrice],{session})
                                            }
                                            if(dailyGlobalPrice)
                                            {
                              //                 console.log("let 's create daily",dailyGlobalPrice)
                                            await GlobalDailyPrice.create([dailyGlobalPrice],{session})
                                            }
                                            if(monthlyGlobalPrice)
                                            {
                          //                      console.log("let 's create monthly",monthlyGlobalPrice)
                                            await GlobalMonthlyPrice.create([monthlyGlobalPrice],{session})
                                            }
                                            if(yearlyGlobalPrice)
                                            {
                         //                       console.log("let 's create yearly",yearlyGlobalPrice)
                                            await GlobalYearlyPrice.create([yearlyGlobalPrice],{session})
                                            }
                                            //await d.create([hourlyGlobalPrice],{session})
         
                                     }).then(()=>{
                                        redis.hashset(elementName+"-g"+"-h",currentTimelastHour.hour()).then(()=>{
                                            
                                        })
                                        redis.hashset(elementName+"-g"+"-d",currentTimeYesterday.date()).then(()=>{
                                            
                                        })
                                        redis.hashset(elementName+"-g"+"-w",currentTimeLastWeekNumber).then(()=>{
                                            
                                        })
                                        redis.hashset(elementName+"-g"+"-m",currentTimeLastMonth.month()+1).then(()=>{
                                            
                                        })
                                        redis.hashset(elementName+"-g"+"-y",currentTimeLastYear.year()).then(()=>{
                                            
                                        })
                                      
                                            
                                     }).catch((err)=>{
                                         console.log(err)

                                     })
                                    

                                    })
                            
                        
                 

                
         
                        

  
         


                    })})})})}



    // redis.hashset("globalLastHour",currentTimeHour -1).then(()=>{
    //     const hourlyDbData = {
    //         timeStamp  : hourString.toString(),
    //         price ,
    //         volume,
    //         currencyId : currencyHashMap.get(element["symbol"])
    //     }
    // console.log("hourlyDbData",hourlyDbData)
    
    // const hourGlobalHourlyPrice = new GlobalHourlyPrice( hourlyDbData)
    // console.log("hour global is " , hourGlobalHourlyPrice)
    //  hourGlobalHourlyPrice.save().then(()=>{


    //     "successfully saved price"
    // }).catch((err)=>{

    //     console.log(err)
    // })
    // }).catch((err)=>{

    //     console.log("error in setting last hour data in redis")

    // })





         // redis.hashset(currency.ab_name+ "-h-"+"current",currentPrice)
         // if()
         // if(await redis.hashget(currency.ab_name+ "-h-"+"min")>currentPrice)
         // redis.hashset(currency.ab_name+ "-h-"+"min",currentPrice)


         // if(await redis.hashget(currency.ab_name+ "-h-"+"max"+"-")<currentPrice)
         // redis.hashset(currency.ab_name+ "-h-"+"max",currentPrice)

        //  const continuesChildObjectBody = {
        //          currencyId : currency._id,
        //          price :  currentPrice 
                 
        //  }
        //  console.log("pushed",continuesChildObjectBody)

        //  currenciesArr.push(continuesChildObjectBody)
        //  return currenciesArr
        // }

//     })


// })
//  Promise.all(arr).then(()=>{
//      console.log("in promise", currenciesArr)
//      const dailyPrice = new ContinuesPriceStat({
//          name : HourlyString,
//          currencyPriceHistory : currenciesArr


//      })
//      dailyPrice.save().then(()=>{

//              console.log("successfully saved",dailyPrice)

//      }).catch((err)=>{

//              console.log("could not save" , err)

//      })
 

//     //const instant = moment().tz('Iran').subtract(1, 'days')
//     console.log("in price method")
//     // ContinuesPriceStat.findOne({ name: HourlyString })
//     //     .then((result) => {
            
//                 fetch('https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC,ETH,TRX&interval=1m,30d,1d,1h')
//                 .then(res => res.json())
//                 .then( json => {
                          

//                         })
                         

                      

//                 })
                
            

//             // ContinuesPriceStat.findOne({ name: yesterdayString })
//             // .then((result) => {
               
//             // })
          
// } 
            // })}
   
