const Controller = require('./Controller');

class SocketController extends Controller {
  constructor(){
    super()
    console.log( this.connection.query)

  }
  connect=(socket)=>{
    const connection = this.connection;
    console.log(connection)
    // socket.join()
    socket.on('get_friend_messages', (data) => {
          connection.query(`SELECT * FROM messages WHERE (user_one_id = ${data.my_id} AND user_two_id = ${data.friend_id}) OR (user_one_id = ${data.friend_id} AND user_two_id = ${data.my_id})`, (err, data) => {
            if(err) throw err
            console.log(data)
          })
        })
  //   socket.on('new_message', data => {
  //       console.log(data)
  //       socket.emit('newmessageclient',data.message)
        
  //     // socket.broadcast.emit('newmessageclient',data.message)
  //     // socket.broadcast.to(data.friend_id).emit('newmessageclient',data.message)
  // });
}
}

module.exports = new SocketController()
