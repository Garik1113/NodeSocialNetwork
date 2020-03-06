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
const storageForStatuses = multer.diskStorage({
  destination: 'public/uploads/statusImages',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage }).single('profilePhoto');

const uploadStatusImage = multer({ storage: storageForStatuses }).single(
  'statusImage'
);

const uploadmyImage = multer({ storage: storageForImages }).single('myimage');

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

  uploadRegImage(req, res) {
    uploadmyImage(req, res, err => {
      if (err) throw err;
      if (req.file) {
        connection.query(
          `INSERT INTO images(image_path, user_id) VALUES('/uploads/regularImages/${req.file.filename}', '${req.session.userId}')`,
          (err, data) => {
            if (err) throw err;
          }
        );
      }
      res.redirect('/profile');
    });
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
      let findedUsers = [];
      const searchingUsers = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE(name LIKE '${name}%' or surname LIKE '${name}%') AND ID != ${req.session.userId} LIMIT 0,5 `,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
      await searchingUsers.map(async (i, e) => {
        let friend = await (function() {
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
        let request = await (function() {
          return new Promise((resolve, reject) => {
            connection.query(
              `SELECT * FROM requests WHERE (user_one_id=${i.ID} and user_two_id = ${req.session.userId}) or(user_one_id=${req.session.userId} and user_two_id = ${i.ID}) `,
              (err, data) => {
                if (err) throw err;
                resolve(data);
              }
            );
          });
        })();

        if (friend.length == 0) {
          i.status = 'Send request';
        }
        if (friend.length !== 0) {
          i.status = 'Friend';
        }
        if (request.length !== 0) {
          if (request[0].user_two_id == i.ID) {
            i.status = 'Request sended';
          } else {
            i.status = 'Has Sended request';
          }
        }
        if (i.ID == req.session.userId) {
          i.status = 'you';
        }
        findedUsers.push(i);

        if (e === searchingUsers.length - 1) {
          res.send({ findedUsers: findedUsers });
        }
      });
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

  // friend relationships

  async sendRequest(req, res) {
    connection.query(
      `INSERT INTO requests (user_one_id, user_two_id)
               VALUES(${req.session.userId}, ${req.body.user_two_id})`,
      (err, data) => {
        if (err) throw err;
      }
    );
  }

  removeRequest(req, res) {
    connection.query(
      `DELETE FROM requests WHERE user_one_id = '${req.session.userId}' AND user_two_id = '${req.body.user_two_id}'`,
      (err, data) => {
        if (err) throw err;
      }
    );
    res.send();
  }

  async checkFriendRequests(req, res) {
    const friendRequestsInform = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM users JOIN requests ON users.ID = requests.user_one_id WHERE user_two_id = ${req.session.userId}`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();
    res.send({ friendRequestsInform });
    res.end();
  }

  acceptFriendRequest(req, res) {
    connection.query(
      `DELETE FROM requests WHERE user_one_id = ${req.body.user_two_id} AND user_two_id = ${req.session.userId}`,
      (err, data) => {
        if (err) throw err;
      }
    );

    connection.query(
      `INSERT INTO relationships (user_one_id, user_two_id) VALUES (${req.body.user_two_id}, ${req.session.userId})`,
      (err, data) => {
        if (err) throw err;
      }
    );
  }

  deslineFriendRequest(req, res) {
    connection.query(
      `DELETE FROM requests WHERE user_one_id = ${req.body.user_two_id} AND user_two_id = ${req.session.userId}`,
      (err, data) => {
        if (err) throw err;
      }
    );
  }

  async getFriendList(req, res) {
    const friendList = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM relationships WHERE user_one_id = '${req.session.userId}' or user_two_id = '${req.session.userId}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();

    let ids = friendList.map(e => {
      let id = Object.values(e).filter(l => l !== req.session.userId)[0];
      return id;
    });

    let friends = [];
    ids.forEach(async e => {
      let user = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE ID = '${e}'`,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
      friends.push(user[0]);
      if (friends.length === ids.length) {
        res.send({ friends });
      }
    });
  }

  removeFriend(req, res) {
    connection.query(
      `DELETE FROM relationships WHERE(user_one_id = '${req.session.userId}' AND user_two_id = '${req.body.userId}')
         or (user_one_id = '${req.body.userId}' AND user_two_id = '${req.session.userId}') `,
      (err, data) => {
        if (err) throw err;
      }
    );
  }

  async getFriendPage(req, res) {
    const { name, surname, friendId } = req.params;
    if (friendId == req.session.userId) {
      return res.redirect('/profile');
    }
    if (req.session.userId) {
      const friend = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE ID= '${friendId}'`,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
      res.render('friendPage', { friend: friend[0] });
    } else {
      res.redirect('/*');
    }
  }

  shareStatus(req, res) {
    uploadStatusImage(req, res, err => {
      if (err) throw err;
      if (req.file || req.body.status) {
        connection.query(
          `INSERT INTO statuses(status, user_id, status_image) VALUES('${
            req.body.status
          }', '${req.session.userId}', '/uploads/statusImages/${
            req.file ? req.file.filename : 'statusImage.png'
          }')`,
          (err, data) => {
            if (err) throw err;
          }
        );
        res.redirect('/profile');
      }
    });
  }

  async getFriendStatus(req, res) {
    const friends = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM relationships WHERE user_one_id = '${req.session.userId}' OR user_two_id = '${req.session.userId}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();

    let friendsID = [...new Set(friends.map(e => Object.values(e)).flat())];

    if (!friendsID.length) {
      const statuses = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM statuses JOIN users ON users.ID = statuses.user_id WHERE user_id = '${req.session.userId}'`,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
      return res.send({ friendStatuses: statuses });
    }
    let friendStatuses = [];
    friendsID.map(async (e, k) => {
      const status = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM statuses JOIN users ON users.ID = statuses.user_id WHERE user_id = '${e}'`,
            (err, data) => {
              if (err) reject(err);
              resolve(data);
            }
          );
        });
      })();
      status.forEach(l => friendStatuses.push(l));
      if (k === friendsID.length - 1) {
        res.send({ friendStatuses });
      }
    });

    // console.log(friendStatuses);
    // friendStatuses.push(statuses[0]);
    // console.log(friendStatuses);
    // async function get() {
    //   await friendStatuses.push(statuses);
    // }

    //   return new Promise((resolve, reject) => {});
    //   console.log(friendStatuses);
    //   friendStatuses.push(status[0]);
    //   if (status[0]) {
    //     let status_id = status[0].status_id;
    //     const comments = await (function() {
    //       return new Promise((resolve, reject) => {
    //         connection.query(
    //           `SELECT * FROM comments JOIN users ON user_id = ID WHERE status_id = '${status_id}'`,
    //           (err, data) => {
    //             if (err) throw err;
    //             resolve(data);
    //           }
    //         );
    //       });
    //     })();
    //     friendStatuses.push({ status: status[0], comments });
    //   } else {
    //     friendStatuses.push(null);
    //   }
    //   if (friendStatuses.length === friendsID.length) {
    //     res.send({ friendStatuses });
    //   }
    // });
    // console.log(friendStatuses);
  }

  async getComments(req, res) {
    const comments = await (function() {
      return new Promise((resolve, reject) => {
        connection.query(
          `SELECT * FROM comments JOIN users ON user_id = ID WHERE status_id = '${req.body.status_id}'`,
          (err, data) => {
            if (err) throw err;
            resolve(data);
          }
        );
      });
    })();
    res.send({ comments });
  }
  addComment(req, res) {
    connection.query(
      `INSERT INTO comments (user_id, status_id, comment) VALUES('${req.session.userId}','${req.body.status_id}','${req.body.comment}')`,
      (err, data) => {
        if (err) throw err;
      }
    );
  }

  removeStatus(req, res) {
    connection.query(
      `DELETE FROM statuses WHERE status_id = '${req.body.status_id}'`,
      (err, data) => {
        if (err) throw err;
      }
    );
    res.send();
  }
}
module.exports = new Controller();
