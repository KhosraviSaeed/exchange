"use strict";
exports.__esModule = true;
exports.LoggerStream = exports.logger = void 0;
var winston = require("winston");
var _a = winston.format, combine = _a.combine, timestamp = _a.timestamp, label = _a.label, prettyPrint = _a.prettyPrint, colorize = _a.colorize, json = _a.json, splat = _a.splat;
/// /////////////////////////////////////////////////////////////////////////////
/// ///////////////////////Winston Logger///////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
exports.logger = winston.createLogger({
    exitOnError: false,
    format: combine(timestamp(), prettyPrint(), colorize(), splat()),
    level: 'info',
    // format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ]
});
// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
exports.logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));
// }
// logger.stream = {
//   write: function (message: string, encoding: any) {
//     logger.info(message)
//   }
// }
var LoggerStream = /** @class */ (function () {
    function LoggerStream() {
    }
    LoggerStream.prototype.write = function (message) {
        exports.logger.info(message);
    };
    return LoggerStream;
}());
exports.LoggerStream = LoggerStream;
//module.exports = logger
