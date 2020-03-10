const Controller = require('./Controller');

class SocketController extends Controller {
  async geter() {
    const connection = this.connection;
    const users = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users`, (err, data) => {
          if (err) throw err;
          resolve(data);
        });
      });
    })();

    console.log(users);
  }
}

const Socket = new SocketController();
Socket.geter();
