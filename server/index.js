"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var session = require("express-session");
var MongoStore = require("connect-mongo");
var MongoStoreSession = MongoStore(session);
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var mongoose = require("mongoose");
var useragent = require("express-useragent");
var dotenv = require("dotenv");
var config = dotenv.config();
var priceStats_1 = require("./scripts/priceStats");
var currenciesadder_1 = require("./scripts/currenciesadder");
var localPriceScript = require("./scripts/localPriceScript");
var dollarToRial_1 = require("./scripts/dollarToRial");
var errorHandler_1 = require("./middlewares/errorHandler");
var logger_1 = require("./api/logger");
var csurf = require("csurf");
var cors = require("cors");
var spawn = require("child_process");
var cron = require("node-cron");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })["catch"](function (err) {
    logger_1.logger.error(err);
});
var mongooseDB = mongoose.connection;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
//  const path = require('path')
//  app.use(express.static(path.join(__dirname, 'static')))
var morgan = require("morgan");
app.use(morgan(':remote-addr ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":referrer" ":user-agent" ', { stream: new logger_1.LoggerStream() })); //, { "stream": loggerStream() })
app.use(bodyParser.json());
// app.use(bodyParser.raw({ type: 'application/octet-stream' }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost'] }));
app.use(useragent.express());
app.use(helmet());
app.set('trust proxy', true);
var sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    proxy: true,
    saveUninitialized: true,
    rolling: true,
    SameSite: true,
    name: 'sessionId',
    cookie: {
        // secure: true,
        httpOnly: true,
        // domain:,
        path: '/',
        maxAge: 6000000
    },
    store: new MongoStoreSession({ mongooseConnection: mongooseDB })
};
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    //sess.cookie.secure = true // serve secure cookies
}
var http = require("http");
var server = http.createServer(app);
var socket_1 = require("./api/socket");
var sio = socket_1.startIo(server);
var onlineLoginUsers = socket_1.getonlineLoginUsers();
//import { rateLimiterMiddleware } from './middlewares/preventBruteForce'
// import * as sharedsession from 'express-socket.io-session'
var sharedsession = require("express-socket.io-session");
var sessionMiddleware = session(sess);
app.use(sessionMiddleware);
onlineLoginUsers.use(sharedsession(sessionMiddleware, { autoSave: true }));
// onlineLoginUsers.use(function(socket, next){
//   sessionMiddleware(socket.client.request, socket.client.request.res, next);
// });
var service_1 = require("./routes/service");
var user_1 = require("./routes/user");
var auth_1 = require("./routes/auth");
var admin_1 = require("./routes/admin");
var wallet_1 = require("./routes/wallet");
var tickets_1 = require("./routes/tickets");
app.use('/service', service_1.serviceRoutes);
app.use('/user', user_1.userRoutes);
app.use('/auth', auth_1.authRoutes);
app.use('/admin', admin_1.adminRoutes);
app.use('/tickets', tickets_1.ticketRoutes);
app.use('/wallet', wallet_1.walletRoutes);
//localHourlySetPrice()
//dailyStatsOfOrders()
var dbBackupTask = cron.schedule('59 23 * * *', function () {
    var backupProcessTrudesk = spawn.spawn('mongodump', [
        '--db=trudesk',
        '--archive=./trudeskDB',
        '--gzip'
    ]);
    var backupProcessExchange = spawn.spawn('mongodump', [
        '--db=exchange',
        '--archive=./exchangeDB',
        '--gzip'
    ]);
    backupProcessTrudesk.on('exit', function (code, signal) {
        if (code)
            console.log('Backup process exited with code ', code);
        else if (signal)
            console.error('Backup process was killed with singal ', signal);
        else
            console.log('Successfully backedup the database');
    });
    backupProcessExchange.on('exit', function (code, signal) {
        if (code)
            console.log('Backup process exited with code ', code);
        else if (signal)
            console.error('Backup process was killed with singal ', signal);
        else
            console.log('Successfully backedup the database');
    });
}, null);
var restoreProcess = spawn.spawn('mongorestore', ['trudesk/trudesk']);
restoreProcess.on('exit', function (code, signal) {
    if (code)
        console.log('Backup process exited with code ', code);
    else if (signal)
        console.error('Backup process was killed with singal ', signal);
    else
        console.log('Successfully backedup the database');
});
currenciesadder_1.curreniesAdder();
priceStats_1.continuesStatsOfOrders();
dollarToRial_1.addDollarPrice();
// continuesStatsOfOrders()
//  setInterval(continuesStatsOfOrders, 1000*60*1);
// app.use(rateLimiterMiddleware)
app.use(csurf());
app.use(errorHandler_1["default"]);
/**
 * Start Express server.
 */
localPriceScript.localHourlySetPrice();
localPriceScript.localDailySetPrice();
localPriceScript.localWeeklySetPrice();
localPriceScript.localMonthlySetPrice();
localPriceScript.localYearlySetPrice();
var port = 3001;
var myServer = server.listen(port, function () {
    console.log("  App is running at http://localhost:%d in %s mode", port, app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
exports["default"] = myServer;
