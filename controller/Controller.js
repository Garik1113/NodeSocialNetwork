const Database = require('../model');
const passwordHash = require('password-hash');
const connection = Database.connection;
const fs = require('fs');
const multer = require('multer');
const path = require('path');

//Storage sittings for uploading images
const storage = multer.diskStorage({
  destination: 'public/uploads/images',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});
const storageForImages = multer.diskStorage({
  destination: 'public/uploads/regularImages',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage }).single('profilePhoto');
const uploadImage = multer({ storage: storageForImages }).single('image');

class Controller {
  getHomePage(req, res) {
    req.session.destroy();
    return res.render('index');
  }

  uploadProfilePhoto(req, res) {
    upload(req, res, err => {
      if (err) throw err;
      if (req.file) {
        connection.query(
          `UPDATE users SET profile_image = '/uploads/images/${req.file.filename}' WHERE ID = '${req.session.userId}'`,
          (err, data) => {
            if (err) throw err;
          }
        );
      }
      return res.redirect('/profile');
    });
  }

  uploadNewPhoto(req, res) {
    if (req.session.userId) {
      uploadImage(req, res, err => {
        if (err) throw err;
        if (req.file) {
          connection.query(
            `INSERT INTO images(image_path, user_id) VALUES('/uploads/regularImages/${req.file.filename}', '${req.session.userId}')`,
            (err, data) => {
              if (err) throw err;
            }
          );
        }
      });

      res.redirect('/profile');
    }
  }

  async deleteImage(req, res) {
    const pathImage = './public' + req.body.imagePath;
    fs.unlink(pathImage, err => {
      if (err) throw err;
    });
    connection.query(
      `DELETE FROM images WHERE image_path = '${req.body.imagePath}' AND user_id = '${req.session.userId}'`,
      (err, data) => {
        if (err) throw err;
      }
    );
    res.send('deleted');
    const profileImage = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT profile_image FROM users WHERE ID = ${req.session.userId}`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();
    if (profileImage[0].profile_image === req.body.imagePath) {
      connection.query(
        `UPDATE users SET profile_image = '/uploads/images/avatar.png' WHERE ID = ${req.session.userId}`,
        (err, data) => {
          if (err) throw err;
        }
      );
    }
  }

  selectProfileImage(req, res) {
    if (req.body.imagePath) {
      connection.query(
        `UPDATE users SET profile_image = '${req.body.imagePath}' WHERE ID = '${req.session.userId}'`,
        (err, data) => {
          if (err) throw err;
        }
      );
      res.send('Selected as profile image');
    }

    return res.end();
  }

  async searchUser(req, res) {
    const name = req.body.value;
    if (name) {
      const findedUser = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE name LIKE '${name}%' AND ID != ${req.session.userId} LIMIT 5 `,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
let findedUsers=[]
// console.log(findedUser)
      findedUser.forEach(async (i)=>{
        let friend =   await (function() {
          return new Promise((resolve, reject) => {
            connection.query(
              `SELECT * FROM relationships WHERE (user_one_id=${i.ID} and user_two_id = ${req.session.userId}) or(user_one_id=${req.session.userId} and user_two_id = ${i.ID}) `,
              (err, data) => {
                if (err) throw err;
                resolve(data);
              }
            );
          });
        })();
        let request =   await (function() {
          return new Promise((resolve, reject) => {
            connection.query(
              `SELECT * FROM relationships WHERE (user_one_id=${i.ID} and user_two_id = ${req.session.userId}) or(user_one_id=${req.session.userId} and user_two_id = ${i.ID}) `,
              (err, data) => {
                if (err) throw err;
                resolve(data);
              }
            );
          });
        })();
    if(friend.length==0){
      i.status = 'enker chi'
    }

    if(request.length!=0){
      if(request[0].user_two_id==i.ID){
      i.status = 'es em uxarkel'

      }
      else{
      i.status = 'inqn e uxarkel'

      }
    }

    if(i.ID==req.session.userId){
      i.status = 'es em'

    }
 
    findedUsers.push(i)
    console.log(findedUsers)
      })
      res.send({ findedUsers });
    } else {
      res.send({ findedUsers: [] });
    }
  }

  async getProfilePage(req, res) {
    if (req.session.userId) {
      const user = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE ID = '${req.session.userId}'`,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
      res.render('profile', {
        user,
        findedUsers: ''
      });
    } else {
      req.session.destroy();
      return res.redirect('/');
    }
  }

  async getPhotosPage(req, res) {
    const photosPath = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM images WHERE user_id = '${req.session.userId}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();
    res.send({ photosPath });
  }

  async getUserInform(req, res) {
    const userInform = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM users WHERE ID = '${req.session.userId}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();

    res.send({ userInform });
  }

  async saveChanges(req, res) {
    const user = req.body.user;
    connection.query(
      `UPDATE users SET name = '${user.name}', surname = '${user.surname}', age = '${user.age}' WHERE ID = '${req.session.userId}'`,
      (err, data) => {
        if (err) throw err;
      }
    );

    return res.send('information changed succesfully');
  }

  async setUser(req, res) {
    const { name, surname, age, email, password } = req.body;
    const data = await (function() {
      return new Promise((res, rej) => {
        connection.query(
          `SELECT * FROM users WHERE email = '${email}'`,
          (err, data) => {
            if (err) throw err;
            res(data);
          }
        );
      });
    })();

    const signupUser = { name, surname, age, email };
    if (data.length) {
      return res.render('signup', {
        mailExistError: 'Mail is already exist',
        errors: '',
        user: signupUser
      });
    }

    const hashedPassword = passwordHash.generate(password);

    const addedUser = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `INSERT INTO users(name, surname, age, email, password)
                   VALUES('${name}', '${surname}', '${age}', '${email}', '${hashedPassword}')`,
          (err, data) => {
            if (err) throw err.message;
            resolve(data);
          }
        );
      });
    })();

    const insertId = await addedUser.insertId;

    req.session.userId = insertId;
    return res.redirect('/profile');
  }

  getSignupPage(req, res) {
    req.session.destroy();
    return res.render('signup', { errors: '', mailExistError: '', user: '' });
  }

  getLoginPage(req, res) {
    req.session.destroy();
    return res.render('login', {
      errors: '',
      mailExistError: '',
      userError: '',
      email: ''
    });
  }

  getInvalidPage(req, res) {
    res.render('invalidPage');
  }
  async tryLogin(req, res) {
    const { email, password } = req.body;
    let user = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM users WHERE email = '${email}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();

    if (user.length) {
      const hashedPassword = await user[0].password;
      if (passwordHash.verify(password, hashedPassword)) {
        req.session.userId = user[0].ID;
        return res.redirect('/profile');
      } else {
        return res.render('login', {
          errors: '',
          userError: 'Wrong password',
          mailExistError: '',
          email: req.body.email
        });
      }
    } else {
      res.render('login', {
        errors: '',
        mailExistError: 'account with this email does not exist',
        userError: '',
        email: ''
      });
    }
  }

  //about relationship status  0 - Pending, 1 - Accepting(friends), 2 - Deslined, 3 - Block

  async sendRequest(req, res) {
      connection.query(
        `INSERT INTO requests (user_one_id, user_two_id)
               VALUES(${req.session.userId}, ${req.body.user_two_id})`,
                (err, data) => {
              if (err) throw err;
        }
      );   
  }

  async checkFriendRequests(req, res) {
    const friendRequestsInform = await (function (){
        return new Promise((resolve, reject) => {
              connection.query(`SELECT * FROM users JOIN requests ON users.ID = requests.user_one_id WHERE user_two_id = ${req.session.userId}`, (err, data) => {
                  if(err) throw err
                  resolve(data)
              })
            })
        })()
    res.send({ friendRequestsInform });
    res.end();
  }

  acceptFriendRequest(req, res) {
     
        connection.query(`DELETE FROM requests WHERE user_one_id = ${req.body.userId} AND user_two_id = ${req.session.userId}`,
         (err,data) => {
           if(err) throw err
         })
     
    connection.query(`INSERT INTO relationships (user_one_id, user_two_id) VALUES (${req.body.userId}, ${req.session.userId})`, (err, data) => {
      if(err) throw err
    })
  }

  deslineFriendRequest(req, res) {
    connection.query(`DELETE FROM requests WHERE user_one_id = ${req.body.userId} AND user_two_id = ${req.session.userId}`, (err,data) => {
      if(err) throw err
    })
  }

  async getFriendList(req, res) {
    const friendLis = await function() {
      return new Promise((response, reject) => ({}));
    };
  }
}
module.exports = new Controller();
