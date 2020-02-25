const mySql = require('mysql');

class Database {
  constructor() {
    this.connection = mySql.createConnection({
      host: 'localhost',
      password: '',
      user: 'root',
      database: 'nodesocialnetwork'
    });
  }
}

module.exports = new Database();
