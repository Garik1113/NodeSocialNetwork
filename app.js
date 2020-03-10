const {
  SignupValidationRules,
  signupValidate
} = require('./validators/signupValidator');
const {
  loginValidationRules,
  loginValidate
} = require('./validators/loginValidator');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const ClassController = require('./controller/Controller');
const Controller = new ClassController();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  session({
    secret: '123',
    resave: false,
    saveUninitialized: true
  })
);

app.get('/', Controller.getHomePage);
app.get('/signup', Controller.getSignupPage);
app.get('/login', Controller.getLoginPage);
app.get('/profile', Controller.getProfilePage);
app.get('/getFriendPage/:name/:surname/:friendId', Controller.getFriendPage);
app.get('*', Controller.getInvalidPage);
app.post('/uploadProfilePhoto', Controller.uploadProfilePhoto);
app.post(
  '/createUser',
  SignupValidationRules(),
  signupValidate,
  Controller.setUser
);
app.post(
  '/tryLogin',
  loginValidationRules(),
  loginValidate,
  Controller.tryLogin
);

app.post('/photos', Controller.getPhotosPage);
app.post('/getUserInform', Controller.getUserInform);
app.post('/saveChanges', Controller.saveChanges);
app.post('/uploadRegImage', Controller.uploadRegImage);
app.post('/deleteImage', Controller.deleteImage);
app.post('/SetAsProfilePic', Controller.selectProfileImage);
app.post('/SearchUser', Controller.searchUser);
app.post('/sendRequest', Controller.sendRequest);
app.post('/removeRequest', Controller.removeRequest);
app.post('/checkFriendRequests', Controller.checkFriendRequests);
app.post('/acceptFriendRequest', Controller.acceptFriendRequest);
app.post('/deslineFriendRequest', Controller.deslineFriendRequest);
app.post('/getFriendList', Controller.getFriendList);
app.post('/removeFriend', Controller.removeFriend);
app.post('/shareStatus', Controller.shareStatus);
app.post('/getFriendStatus', Controller.getFriendStatus);
app.post('/addComment', Controller.addComment);
app.post('/getComents', Controller.getComments);
app.post('/removeStatus', Controller.removeStatus);
app.post('/likeStatus', Controller.likeStatus);
app.post('/getLikedUsers', Controller.getLikedUsers);
app.post('/removeComment', Controller.removeComment);
app.post('/shareHistoryImage', Controller.shareHistoryImage);

// app.listen(PORT);

// chat socket io

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  // socke.join
  socket.on('new_message', data => {
    console.log('Client says', data);

    // socket.broadcast.to('um').emit('namak')
  });
});

http.listen(PORT);
