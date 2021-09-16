"use strict";
exports.__esModule = true;
function successRes(res, message, data, metaData, statusCode) {
    if (statusCode === void 0) { statusCode = 200; }
    return res.status(statusCode).json({ success: true, message: message, data: data, metaData: metaData });
}
exports["default"] = successRes;
