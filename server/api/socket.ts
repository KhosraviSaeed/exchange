// import * as scocketIo from 'socket.io'
const scocketIo = require('socket.io')
import * as redis from 'redis'
var client = redis.createClient()
import { logger } from './logger'

let onlineLoginUsers = null
let onlineNotLoginUsers = null

var socketConnection = function socketConnection (socket) {
  logger.info(`Client connected [id=${socket.id}]`)
}

var socketDisconnection = function socketDisconnection (socket) {
  logger.info(`Client gone [id=${socket.id}]`)
}
export const startIo = (server) => {
  const io = scocketIo(server, {
    serveClient: false,
    cors: {
      origin: '*',
    }
  })
  io.on('connection', socketConnection)
  io.on('disconnect', socketDisconnection)
  onlineLoginUsers = io.of('/onlineLoginUsers')
  onlineNotLoginUsers = io.of('/onlineNotLoginUsers')
  onlineLoginUsers.on('connection', function (socket) {
    logger.info(`Client connected [id=${socket.id}]`)
    console.log('socket.handshake', socket.handshake.session)
    if (socket.handshake.session.userId) {
      client.sadd(socket.handshake.session.userId, socket.id, (err, reply) => {
        if (err) logger.warn(err)
      })
      logger.info(`A logged in client connected in :${socket.id}`)
      socket.on('disconnect', () => {
        logger.info(`Client gone [id=${socket.id}]`)
        client.srem(socket.handshake.session.userId, socket.id, (err, reply) => {
          logger.info(`socket with id ${socket.id} is closed!`)
        })
      })
    }
  })
  return io
}

export const getonlineLoginUsers = () => {
  return onlineLoginUsers
}

export const getonlineNotLoginUsers = () => {
  return onlineNotLoginUsers
}


