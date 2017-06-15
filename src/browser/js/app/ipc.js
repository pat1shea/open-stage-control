var io = require('socket.io-client/dist/socket.io.slim.js')


var Ipc = class Ipc {

    constructor() {

        this.socket = io.connect('/')
        this.socket.compress(false)

    }


    send(event, data) {

        this.socket.emit(event, data)

    }

    on(name, fn) {


        this.socket.on(name, fn)

    }
}


var ipc = new Ipc()

module.exports = ipc
