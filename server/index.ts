import * as express from 'express';
const app = express();

import * as session from 'express-session';
import * as MongoStore from 'connect-mongo';
const MongoStoreSession = MongoStore(session)
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as useragent from 'express-useragent';
import * as dotenv from 'dotenv';
const config = dotenv.config();
import {continuesStatsOfOrders} from './scripts/priceStats'
import { curreniesAdder} from './scripts/currenciesadder'
import * as localPriceScript from './scripts/localPriceScript'

import {addDollarPrice } from './scripts/dollarToRial'
import errorHandler from './middlewares/errorHandler'
import { logger, LoggerStream } from './api/logger';
import * as csurf from 'csurf';
import * as cors from 'cors';
import * as spawn from 'child_process'
import * as cron from 'node-cron'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => {
    logger.error(err)
  })
const mongooseDB = mongoose.connection
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

//  const path = require('path')
//  app.use(express.static(path.join(__dirname, 'static')))

import * as morgan from 'morgan'
app.use(morgan(':remote-addr ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":referrer" ":user-agent" ', { stream: new LoggerStream() }))//, { "stream": loggerStream() })

app.use(bodyParser.json())
// app.use(bodyParser.raw({ type: 'application/octet-stream' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());


app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost'] }))
app.use(useragent.express())
app.use(helmet())
app.set('trust proxy', true)
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
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  //sess.cookie.secure = true // serve secure cookies
}
import * as http from 'http'
const server = http.createServer(app)
import { startIo, getonlineLoginUsers } from './api/socket'
var sio = startIo(server)
const onlineLoginUsers = getonlineLoginUsers()

//import { rateLimiterMiddleware } from './middlewares/preventBruteForce'

// import * as sharedsession from 'express-socket.io-session'
var sharedsession = require("express-socket.io-session");
var sessionMiddleware = session(sess)
app.use(sessionMiddleware)
onlineLoginUsers.use(sharedsession(sessionMiddleware, { autoSave: true }))
// onlineLoginUsers.use(function(socket, next){
//   sessionMiddleware(socket.client.request, socket.client.request.res, next);
// });

import { serviceRoutes } from './routes/service'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { adminRoutes } from './routes/admin'
import { walletRoutes } from './routes/wallet'
import { ticketRoutes } from './routes/tickets';
app.use('/service', serviceRoutes)
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/tickets', ticketRoutes)
app.use('/wallet', walletRoutes)

//localHourlySetPrice()
//dailyStatsOfOrders()

let dbBackupTask = cron.schedule('59 23 * * *', () => {
  let backupProcessTrudesk = spawn.spawn('mongodump', [
      '--db=trudesk',
      '--archive=./trudeskDB',
      '--gzip'
    ]);
    let backupProcessExchange = spawn.spawn('mongodump', [
      '--db=exchange',
      '--archive=./exchangeDB',
      '--gzip'
    ]);
    backupProcessTrudesk.on('exit', (code, signal) => {
      if(code) 
          console.log('Backup process exited with code ', code);
      else if (signal)
          console.error('Backup process was killed with singal ', signal);
      else 
          console.log('Successfully backedup the database')
  });
  backupProcessExchange.on('exit', (code, signal) => {
    if(code) 
        console.log('Backup process exited with code ', code);
    else if (signal)
        console.error('Backup process was killed with singal ', signal);
    else 
        console.log('Successfully backedup the database')
  });
},null);


 const restoreProcess =  spawn.spawn('mongorestore',[ 'trudesk/trudesk']);
  

  restoreProcess.on('exit', (code, signal) => {
      if(code) 
          console.log('Backup process exited with code ', code);
      else if (signal)
          console.error('Backup process was killed with singal ', signal);
      else 
          console.log('Successfully backedup the database')
  });
  

curreniesAdder()
continuesStatsOfOrders()


addDollarPrice()

// continuesStatsOfOrders()

//  setInterval(continuesStatsOfOrders, 1000*60*1);



// app.use(rateLimiterMiddleware)
app.use(csurf())
app.use(errorHandler)
/**
 * Start Express server.
 */


localPriceScript.localHourlySetPrice()
localPriceScript.localDailySetPrice()
localPriceScript.localWeeklySetPrice()
localPriceScript.localMonthlySetPrice()
localPriceScript.localYearlySetPrice()

const port = 3001
const myServer = server.listen(port, () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        port,
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});



export default myServer;