const Database = require('../model');
const connection = Database.connection;


class SocketController {
    constructor(socket) {
        this.socket = socket
    }
}
