"use strict";
exports.__esModule = true;
exports.getCurrentPrice = exports.hashSetMembers = exports.hashHMset = exports.hashGetAll = exports.hashset = exports.hashget = exports.globalRedisClient = void 0;
var redis = require("redis");
var myError_1 = require("./myError");
exports.globalRedisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    enable_offline_queue: false
});
// globalRedisClient.auth(process.env.REDIS_PASS, (err) =>  {
//   if (err) console.log(err);
// })
exports.globalRedisClient.on('connect', function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Redis-server is connected');
    }
});
exports.globalRedisClient.on('error', function (err) {
    console.log('Error ' + err);
});
exports.hashget = function (tag) {
    return new Promise(function (resolve, reject) {
        exports.globalRedisClient.get(tag, function (err, reply) {
            if (err) {
                reject(err);
            }
            else {
                resolve(reply);
            }
        });
    });
};
exports.hashset = function (tag, val) {
    return new Promise(function (resolve, reject) {
        exports.globalRedisClient.set(tag, val, function (err, reply) {
            if (err) {
                reject(err);
            }
            else {
                resolve(reply);
            }
        });
    });
};
exports.hashGetAll = function (tag) {
    return new Promise(function (resolve, reject) {
        exports.globalRedisClient.hgetall(tag, function (err, reply) {
            if (err) {
                reject(err);
            }
            else {
                resolve(reply);
            }
        });
    });
};
exports.hashHMset = function (tag, val) {
    return new Promise(function (resolve, reject) {
        exports.globalRedisClient.hmset(tag, val, function (err, reply) {
            if (err) {
                reject(err);
            }
            else {
                resolve(reply);
            }
        });
    });
};
exports.hashSetMembers = function (tag) {
    return new Promise(function (resolve, reject) {
        exports.globalRedisClient.smembers(tag, function (err, reply) {
            if (err) {
                reject(err);
            }
            else {
                resolve(reply);
            }
        });
    });
};
function getCurrentPrice(currency) {
    //API for getting current currency price
    return exports.hashGetAll(currency.toString())
        .then(function (currencyInfo) {
        return exports.hashGetAll(currencyInfo.ab_name.toString() + "-g")
            .then(function (currencyInstantPrice) {
            if (currencyInstantPrice) {
                return exports.hashget("dollarPrice")
                    .then(function (rialPrice) {
                    if (rialPrice) {
                        return Number(currencyInstantPrice.current) * Number(rialPrice);
                    }
                    else {
                        var error = new myError_1["default"]('It is not possible to get price currently!', 400, 11, 'امکان قیمت گیری در حال حاضر وجود ندارد!', 'خطا رخ داد');
                        throw error;
                    }
                })["catch"](function (err) {
                    throw err;
                });
            }
            else {
                var error = new myError_1["default"]('It is not possible to get price currently!', 400, 11, 'امکان قیمت گیری در حال حاضر وجود ندارد!', 'خطا رخ داد');
                throw error;
            }
        })["catch"](function (err) {
            throw err;
        });
    })["catch"](function (err) {
        throw err;
    });
}
exports.getCurrentPrice = getCurrentPrice;
