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
      const findedUsers = await (function() {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT * FROM users WHERE name LIKE '${name}%' LIMIT 5 `,
            (err, data) => {
              if (err) throw err;
              resolve(data);
            }
          );
        });
      })();
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
}
module.exports = new Controller();
