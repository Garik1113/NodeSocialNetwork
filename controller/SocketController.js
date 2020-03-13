const Controller = require('./Controller');

class SocketController extends Controller {
  constructor() {
    super();
  }
  connect = socket => {
    const connection = this.connection;
    // socket.join()
    socket.on('get_friend_messages', async data => {
      const messages = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM messages WHERE (user_one_id = ${data.my_id} AND user_two_id = ${data.friend_id}) OR (user_one_id = ${data.friend_id} AND user_two_id = ${data.my_id})`,
            (err, msg) => {
              if (err) throw err;
              resolve(msg);
            }
          );
        });
      })();
      const friend = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE ID = ${data.friend_id}`,
            (err, dat) => {
              if (err) throw err;
              resolve(dat);
            }
          );
        });
      })();

      socket.emit('get_messages', { messages, friend });
    });

    socket.on('new_message', async new_massage => {
      connection.query(
        `INSERT INTO messages(user_one_id, user_two_id, message) VALUES(${new_massage.my_id}, ${new_massage.friend_id}, '${new_massage.message}')`,
        (err, dataa) => {
          if (err) throw err;
        }
      );

      const friend = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE ID = ${new_massage.friend_id}`,
            (err, dataa) => {
              if (err) throw err;
              resolve(dataa);
            }
          );
        });
      })();
      socket.emit('get_new_message', {
        newMessage: new_massage,
        friend: friend[0]
      });
      socket.broadcast.emit('get_new_message', {
        newMessage: new_massage,
        friend: friend[0]
      });
      // socket.broadcast
      //   .to(data.friend_id)
      //   .emit('newmessageclient', data.message);
    });
  };
}

module.exports = new SocketController();
