"use strict";
exports.__esModule = true;
exports.getonlineNotLoginUsers = exports.getonlineLoginUsers = exports.startIo = void 0;
// import * as scocketIo from 'socket.io'
var scocketIo = require('socket.io');
var redis = require("redis");
var client = redis.createClient();
var logger_1 = require("./logger");
var onlineLoginUsers = null;
var onlineNotLoginUsers = null;
var socketConnection = function socketConnection(socket) {
    logger_1.logger.info("Client connected [id=" + socket.id + "]");
};
var socketDisconnection = function socketDisconnection(socket) {
    logger_1.logger.info("Client gone [id=" + socket.id + "]");
};
exports.startIo = function (server) {
    var io = scocketIo(server, {
        serveClient: false,
        cors: {
            origin: '*'
        }
    });
    io.on('connection', socketConnection);
    io.on('disconnect', socketDisconnection);
    onlineLoginUsers = io.of('/onlineLoginUsers');
    onlineNotLoginUsers = io.of('/onlineNotLoginUsers');
    onlineLoginUsers.on('connection', function (socket) {
        logger_1.logger.info("Client connected [id=" + socket.id + "]");
        console.log('socket.handshake', socket.handshake.session);
        if (socket.handshake.session.userId) {
            client.sadd(socket.handshake.session.userId, socket.id, function (err, reply) {
                if (err)
                    logger_1.logger.warn(err);
            });
            logger_1.logger.info("A logged in client connected in :" + socket.id);
            socket.on('disconnect', function () {
                logger_1.logger.info("Client gone [id=" + socket.id + "]");
                client.srem(socket.handshake.session.userId, socket.id, function (err, reply) {
                    logger_1.logger.info("socket with id " + socket.id + " is closed!");
                });
            });
        }
    });
    return io;
};
exports.getonlineLoginUsers = function () {
    return onlineLoginUsers;
};
exports.getonlineNotLoginUsers = function () {
    return onlineNotLoginUsers;
};
