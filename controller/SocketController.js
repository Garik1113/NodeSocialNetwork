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
      socket.join(data.my_id)
      socket.emit('get_messages', { messages, friend });
    });

    socket.on('new_message', async new_massage => {
      const friend_id = await function (){
        return new Promise((resolve,reject) => {
         connection.query(
          `INSERT INTO messages(user_one_id, user_two_id, message, date_time) VALUES(${new_massage.my_id}, ${new_massage.friend_id}, '${new_massage.message}', ${Date(Date.now())})`,
            (err, msg) => {
              if (err) throw err;
                resolve(msg.insertId)
            }
          ); 
        })
      }()
      
      const message = await function (){
        return new Promise((resolve,reject) => {
          connection.query(`SELECT * FROM messages JOIN users ON user_one_id = ID WHERE messages.message_id = ${friend_id}`, (err, data) => {
            if(err) throw err
            resolve(data)
          })
        })
      }()
     

      socket.emit('get_new_message', {
        newMessage: message,
      });
      socket.broadcast
        .to(new_massage.friend_id)
        .emit('get_new_message', {
          newMessage: message
        });
    });
  };
}

module.exports = new SocketController();
