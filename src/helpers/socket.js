import { SOCKET } from '../configs/constants-config'

import openSocket from 'socket.io-client';


 
export const initiateSocket = () => {
    var socket = openSocket(SOCKET)
    return socket
}

export const subscribe = (socket, event) => {
    console.log('in subscribe: ')
    console.log('SOCKET: ', SOCKET)
    console.log(socket)
    socket.on(event, (msg) => {
        console.log("recieved from new offer socket");
        console.log(msg)
    });
}
