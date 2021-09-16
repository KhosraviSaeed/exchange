"use strict";
exports.__esModule = true;
exports.isAdmin = exports.isAuthorized = void 0;
var myError_1 = require("../api/myError");
function isAuthorized(req, res, next) {
    if (!req.session.userId) {
        var error = new myError_1["default"]('unauthorized cookie', 401, 1, 'خطا رخ داد!', 'لطفا برای ادامه لاگین کنید!');
        next(error);
    }
    else {
        next();
    }
}
exports.isAuthorized = isAuthorized;
function isAdmin(req, res, next) {
    if (!req.session.adminId) {
        var error = new myError_1["default"]('unauthorized', 401, 3, 'خطا رخ داد!', 'شما اجازه دسترسی ندارید!');
        next(error);
    }
    else {
        next();
    }
}
exports.isAdmin = isAdmin;
