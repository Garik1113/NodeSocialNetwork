const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const listWrapper = document.getElementById('list-wrapper');
const friendRequestList = document.getElementById('friendRequestList');
const friendsPageWrapper = document.querySelector('.friends-page-wrapper');
const notiсeBtn = document.getElementById('notificationBtn');
const statusWrapper = document.querySelector('.status-wrapper');
const messageWrapper = document.querySelector('.message-wrapper');

//Modal images CONFIG

const modal = document.getElementById('myModal');
const modalImg = document.getElementById('img01');

const closeSpan = document.querySelectorAll('.closeSpan')[0];
closeSpan.onclick = function () {
  modal.style.display = 'none';
};

searchInput.addEventListener('input', async e => {
  listWrapper.innerHTML = '';
  e.preventDefault();
  let value = searchInput.value;
  let findedUsers;
  await axios({
      method: 'post',
      url: '/SearchUser',
      data: {
        value
      }
    })
    .then(res => {
      findedUsers = res.data.findedUsers;

      findedUsers.forEach(e => {
        let li = document.createElement('li');
        const aFriendLink = document.createElement('a');
        aFriendLink.innerHTML = e.name + ' ' + e.surname;
        aFriendLink.classList.add('friend-link');
        aFriendLink.href = `/getFriendPage/${e.name}/${e.surname}/${e.ID}`;
        li.classList.add('finded-list-item');
        li.append(aFriendLink);
        listWrapper.append(li);

        if (e.status === 'Send request') {
          let sendReqBtn = document.createElement('button');
          sendReqBtn.innerHTML = 'Send request';
          sendReqBtn.className = 'send_request';
          sendReqBtn.classList.add('btn-small-success');
          sendReqBtn.setAttribute('data-id', e.ID);
          li.appendChild(sendReqBtn);
        } else if (e.status === 'Request sended') {
          let cancelReqBtn = document.createElement('button');
          cancelReqBtn.innerHTML = 'Cancel';
          cancelReqBtn.className = 'cancel_request';
          cancelReqBtn.classList.add('btn-small-warning');
          cancelReqBtn.setAttribute('data-id', e.ID);
          li.appendChild(cancelReqBtn);
        } else if (e.status === 'Friend') {
          let removeFriendBtn = document.createElement('button');
          removeFriendBtn.innerHTML = 'Remove';
          removeFriendBtn.className = 'remove_friend';
          removeFriendBtn.classList.add('btn-small-warning');
          removeFriendBtn.setAttribute('data-id', e.ID);
          li.appendChild(removeFriendBtn);
        } else if (e.status === 'Has Sended request') {
          let acceptReqBtn = document.createElement('button');
          acceptReqBtn.innerHTML = 'Accept';
          acceptReqBtn.className = 'accept_request';
          acceptReqBtn.classList.add('btn-small-success');
          acceptReqBtn.setAttribute('data-id', e.ID);
          li.append(acceptReqBtn);
          let deslineReqBtn = document.createElement('button');
          deslineReqBtn.innerHTML = 'Desline';
          deslineReqBtn.className = 'desline_request';
          deslineReqBtn.classList.add('btn-small-warning');
          deslineReqBtn.setAttribute('data-id', e.ID);
          li.append(deslineReqBtn);
        }
      });

      function sendRequestFunction() {
        let user_two_id = this.getAttribute('data-id');
        axios({
          method: 'post',
          url: '/sendRequest',
          data: {
            user_two_id
          }
        });
        let cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.className = 'cancel_requst';
        cancelBtn.classList.add('btn-small-warning');
        cancelBtn.setAttribute('data-id', user_two_id);
        cancelBtn.addEventListener('click', cancelRequestFunction);
        this.parentElement.appendChild(cancelBtn);
        this.remove();
      }

      function cancelRequestFunction() {
        let user_two_id = this.getAttribute('data-id');
        axios({
          method: 'post',
          url: '/removeRequest',
          data: {
            user_two_id
          }
        });
        let sendReqBtn = document.createElement('button');
        sendReqBtn.innerHTML = 'Send Request';
        sendReqBtn.className = 'send_request';
        sendReqBtn.classList.add('btn-small-success');
        sendReqBtn.setAttribute('data-id', user_two_id);
        sendReqBtn.addEventListener('click', sendRequestFunction);
        this.parentElement.appendChild(sendReqBtn);
        this.remove();
      }

      function removeFriend() {
        let userId = this.getAttribute('data-id');
        axios({
          method: 'post',
          url: '/removeFriend',
          data: {
            userId
          }
        });
        let sendReqBtn = document.createElement('button');
        sendReqBtn.innerHTML = 'Send Request';
        sendReqBtn.className = 'send_request';
        sendReqBtn.classList.add('btn-small-success');
        sendReqBtn.setAttribute('data-id', userId);
        sendReqBtn.addEventListener('click', sendRequestFunction);
        this.parentElement.appendChild(sendReqBtn);
        this.remove();
      }

      function acceptRequest() {
        let user_two_id = this.getAttribute('data-id');
        axios({
          method: 'post',
          url: '/acceptFriendRequest',
          data: {
            user_two_id
          }
        });
        let removeFriendBtn = document.createElement('button');
        removeFriendBtn.innerHTML = 'Remove';
        removeFriendBtn.className = 'remove_friend';
        removeFriendBtn.classList.add('btn-small-warning');
        removeFriendBtn.setAttribute('data-id', user_two_id);
        removeFriendBtn.addEventListener('click', removeFriend);
        this.parentElement.appendChild(removeFriendBtn);
        this.parentElement.children[2].remove();
        this.remove();
      }

      function deslineRequest() {
        let user_two_id = this.getAttribute('data-id');
        axios({
          method: 'post',
          url: '/deslineFriendRequest',
          data: {
            user_two_id
          }
        });
        let sendReqBtn = document.createElement('button');
        sendReqBtn.innerHTML = 'Send Request';
        sendReqBtn.className = 'send_request';
        sendReqBtn.classList.add('btn-small-success');
        sendReqBtn.setAttribute('data-id', user_two_id);
        sendReqBtn.addEventListener('click', sendRequestFunction);
        this.parentElement.appendChild(sendReqBtn);
        this.parentElement.children[1].remove();
        this.remove();
      }

      let send_request_btns = document.querySelectorAll('.send_request');

      for (let i = 0; i < send_request_btns.length; i++) {
        send_request_btns[i].addEventListener('click', sendRequestFunction);
      }

      let cansel_request_btns = document.querySelectorAll('.cancel_request');

      for (let i = 0; i < cansel_request_btns.length; i++) {
        cansel_request_btns[i].addEventListener('click', cancelRequestFunction);
      }

      let remove_friend_btns = document.querySelectorAll('.remove_friend');
      for (let i = 0; i < remove_friend_btns.length; i++) {
        remove_friend_btns[i].addEventListener('click', removeFriend);
      }

      let accept_request_btns = document.querySelectorAll('.accept_request');
      for (let i = 0; i < accept_request_btns.length; i++) {
        accept_request_btns[i].addEventListener('click', acceptRequest);
      }

      let desline_request_btns = document.querySelectorAll('.desline_request');
      for (let i = 0; i < desline_request_btns.length; i++) {
        desline_request_btns[i].addEventListener('click', deslineRequest);
      }
    })

    .catch(e => console.log(e));
});

document.querySelector('.container').addEventListener('click', () => {
  listWrapper.innerHTML = null;
  searchInput.value = '';
  friendRequestList.classList.remove('friendRequestList');
  friendRequestList.innerHTML = null;
});

//get Images
const photosBtn = document.getElementById('photos-btn');
const photosListGroup = document.querySelector('.photos-list-group');
const imagesWrapper = document.querySelector('.images-wrapper');
photosBtn.addEventListener('click', e => {
  changeForm.classList.add('close');
  friendsPageWrapper.innerHTML = '';
  statusWrapper.innerHTML = '';
  statusWrapper.classList.add('close');
  messageWrapper.classList.add('close');
  imagesWrapper.classList.remove('close');
  e.preventDefault();
  const config = {
    method: 'post',
    url: '/photos'
  };
  if (!photosListGroup.innerHTML) {
    axios(config)
      .then(r => {
        const photoPaths = r.data.photosPath;
        photoPaths.forEach(e => {
          const li = document.createElement('li');
          li.classList.add('image-list-item');
          photosListGroup.append(li);

          const small = document.createElement('small');
          li.append(small);
          small.classList.add('inform-about-updates');

          const img = document.createElement('img');
          img.setAttribute('src', e.image_path);
          img.classList.add('reg-image');
          img.classList.contains;
          li.append(img);

          const modal = document.getElementById('myModal');
          const modalImg = document.getElementById('img01');
          img.onclick = function () {
            modal.style.display = 'block';
            modalImg.src = this.src;
          };

          const closeSpan = document.querySelectorAll('.closeSpan')[0];
          closeSpan.onclick = function () {
            modal.style.display = 'none';
          };

          const deleteBtn = document.createElement('button');
          deleteBtn.classList.add('btn');
          deleteBtn.classList.add('btn-danger');
          deleteBtn.style.margin = '1rem';
          deleteBtn.innerHTML = 'Delete';
          li.append(deleteBtn);
          deleteBtn.addEventListener('click', i => {
            deleteBtn.parentNode.remove();
            i.preventDefault();
            axios({
                method: 'post',
                url: '/deleteImage',
                data: {
                  imagePath: e.image_path
                }
              })
              .then(res => (small.innerHTML = res.data))
              .catch(e => console.log(e));
          });

          const selectBtn = document.createElement('button');
          selectBtn.classList.add('btn');
          selectBtn.classList.add('btn-success');
          selectBtn.innerHTML = 'Set as Profile Pic';
          selectBtn.addEventListener('click', l => {
            document
              .querySelector('.profile-image')
              .setAttribute('src', e.image_path);
            l.preventDefault();
            axios({
                method: 'post',
                url: '/SetAsProfilePic',
                data: {
                  imagePath: e.image_path
                }
              })
              .then(res => {
                document
                  .querySelectorAll('.inform-about-updates')
                  .forEach(e => (e.innerHTML = ''))(
                    (small.innerHTML = res.data)
                  );
              })

              .catch(e => console.log(e));
          });
          li.append(selectBtn);
        });
      })
      .catch(e => console.log(e));
  }
});

//Get sittings page
const sittingsBtn = document.getElementById('sittings-btn');
const changeForm = document.getElementById('changeForm');
const nameInput = document.getElementById('nameInput');
const surnameInput = document.getElementById('surnameInput');
const ageInput = document.getElementById('ageInput');

sittingsBtn.addEventListener('click', async e => {
  e.preventDefault();
  changeForm.classList.remove('close');
  imagesWrapper.classList.add('close');
  messageWrapper.classList.add('close');
  friendsPageWrapper.innerHTML = '';
  statusWrapper.innerHTML = '';
  statusWrapper.classList.add('close');
  let userInform;

  await axios({
      method: 'post',
      url: '/getUserInform'
    })
    .then(res => {
      userInform = res.data.userInform[0];
      nameInput.value = userInform.name;
      surnameInput.value = userInform.surname;
      ageInput.value = userInform.age;
    })
    .catch(e => console.log(e));
});

//save changes
const saveChangesbtn = document.getElementById('saveChanges');
const informAboutChanges = document.getElementById('inform-about-changes');

saveChangesbtn.addEventListener('click', e => {
  e.preventDefault();
  const name = nameInput.value;
  const surname = surnameInput.value;
  const age = parseInt(ageInput.value);
  const nameError = document.getElementById('nameError');
  const surnameError = document.getElementById('surnameError');
  const ageError = document.getElementById('ageError');
  const errors = validationBeforeSave(name, surname, age);
  if (Object.keys(errors).length === 0) {
    const user = {
      name,
      surname,
      age
    };
    nameError.innerHTML = '';
    surnameError.innerHTML = '';
    ageError.innerHTML = '';
    axios({
      method: 'post',
      url: '/saveChanges',
      data: {
        user
      }
    }).then(res => {
      document.querySelector('.name-text-wrapper').children[0].innerHTML = name;
      document.querySelector(
        '.name-text-wrapper'
      ).children[1].innerHTML = surname;
      informAboutChanges.innerHTML = res.data;
    });
  } else {
    informAboutChanges.innerHTML = '';
    if (errors.name) {
      nameError.innerHTML = errors.name;
    }
    if (errors.surname) {
      surnameError.innerHTML = errors.surname;
    }
    if (errors.age) {
      ageError.innerHTML = errors.age;
    }
  }
});

//inform change input fields validation
function validationBeforeSave(name, surname, age) {
  let errors = {};
  if (name === '') {
    errors.name = `Name can't be empty string`;
  }
  if (surname === '') {
    errors.surname = `Surname can't be empty string`;
  }
  if (Number.isNaN(age)) {
    errors.age = 'Age must be numeric';
  }
  return errors;
}

//get Notifications about friend requests
notiсeBtn.addEventListener('click', e => {
  friendRequestList.classList.remove('close');
  e.preventDefault();
  friendRequestList.innerHTML = '';
  axios({
      method: 'post',
      url: '/checkFriendRequests'
    })
    .then(res => {
      if (res.data.friendRequestsInform.length <= 0) {
        const h3 = document.createElement('h3');
        h3.innerHTML = 'No Notifications';
        friendRequestList.append(h3);
      }
      if (res.data.friendRequestsInform.length) {
        res.data.friendRequestsInform.forEach(e => {
          const li = document.createElement('li');
          li.classList.add('friendRequestList-item');
          friendRequestList.append(li);
          friendRequestList.classList.add('friendRequestList');
          const b = document.createElement('b');
          li.append(b);
          b.innerHTML = e.name + ' ' + e.surname;
          b.style.cursor = 'pointer';
          b.classList.add('name');
          const btnsWrapper = document.createElement('div');
          li.append(btnsWrapper);
          const acceptBtn = document.createElement('button');
          acceptBtn.classList.add('not-btn');
          acceptBtn.classList.add('green');
          acceptBtn.innerHTML = 'ACCEPT';
          const deslineBtn = document.createElement('button');
          deslineBtn.classList.add('not-btn');
          deslineBtn.innerHTML = 'DESLINE';
          btnsWrapper.append(deslineBtn);
          btnsWrapper.append(acceptBtn);
          btnsWrapper.style.display = 'flex';
          const hr = document.createElement('hr');
          friendRequestList.append(hr);
          acceptBtn.addEventListener('click', k => {
            k.preventDefault();
            axios({
              method: 'post',
              url: '/acceptFriendRequest',
              data: {
                user_two_id: e.ID
              }
            });
          });

          deslineBtn.addEventListener('click', k => {
            k.preventDefault();
            axios({
              method: 'post',
              url: '/deslineFriendRequest',
              data: {
                user_two_id: e.ID
              }
            });
          });
        });
      }
    })
    .catch(e => console.log(e));
});

//Get friends list
const friendsBtn = document.getElementById('friends-btn');

friendsBtn.addEventListener('click', e => {
  friendsPageWrapper.innerHTML = '';
  imagesWrapper.classList.add('close');
  changeForm.classList.add('close');
  messageWrapper.classList.add('close');
  statusWrapper.classList.add('close');
  statusWrapper.innerHTML = '';
  axios({
    method: 'post',
    url: '/getFriendList'
  }).then(res => {
    const friends = res.data.friends;
    friends.forEach(k => {
      const div = document.createElement('div');
      friendsPageWrapper.append(div);
      div.classList.add('friend');
      const img = document.createElement('img');
      div.append(img);
      img.src = k.profile_image;
      img.classList.add('friend-img');
      const form = document.createElement('form');
      div.append(form);
      form.method = 'POST';
      form.action = '/postFriendPage';
      const a = document.createElement('a');
      a.classList.add('friend-name');
      form.append(a);
      a.innerHTML = k.name + ' ' + k.surname;
      a.style.color = '#000000';
      a.href = `/getFriendPage/${k.name}/${k.surname}/${k.ID}`;
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = 'Remove Friend';
      removeBtn.classList.add('btn');
      removeBtn.classList.add('btn-danger');
      div.append(removeBtn);
      removeBtn.addEventListener('click', e => {
        removeBtn.parentNode.remove();
        e.preventDefault();
        axios({
          method: 'post',
          url: '/removeFriend',
          data: {
            userId: k.ID
          }
        });
      });
    });
  });
});

//See notifications and statuss when window is loaded
const newsBtn = document.getElementById('news-btn');
const commentListWrapper = document.querySelector('.comment-list-wrapper');
newsBtn.addEventListener('click', getFriendStatuses);
window.onload = () => {
  statusWrapper.innerHTML = '';

  function checkFriendRequests() {
    axios({
      method: 'post',
      url: '/checkFriendRequests'
    }).then(res => {
      let num = res.data.friendRequestsInform.length;
      if (num > 0) {
        notiсeBtn.innerHTML = num + ' ' + 'Notifications';
      } else if (num <= 0) {
        notiсeBtn.innerHTML = 'Notifications';
      }
    });
  }
  // checkFriendRequests()
  setInterval(checkFriendRequests, 1000);

  getFriendStatuses();
};

function getFriendStatuses() {
  statusWrapper.innerHTML = '';
  friendsPageWrapper.innerHTML = '';
  imagesWrapper.classList.add('close');
  changeForm.classList.add('close');
  messageWrapper.classList.add('close');
  statusWrapper.classList.remove('close');
  statusWrapper.innerHTML = '';
  axios({
    method: 'post',
    url: '/getFriendStatus'
  }).then(res => {
    const statuses = res.data.friendStatuses;
    const ID = statusWrapper.getAttribute('data-id');
    const userName = statusWrapper.getAttribute('data-name');
    const userSurname = statusWrapper.getAttribute('data-surname');
    statuses.forEach(s => {
      const div = document.createElement('div');
      div.classList.add('alert');
      div.classList.add('alert-info');
      div.classList.add('status-div');
      statusWrapper.append(div);

      if (s.ID == ID) {
        const span = document.createElement('span');
        span.innerHTML = '&times;';
        span.classList.add('removeSpan');
        div.append(span);

        span.addEventListener('click', () => {
          axios({
            method: 'post',
            url: '/removeStatus',
            data: {
              status_id: s.status_id
            }
          });
          span.parentElement.remove();
        });
      }

      const a = document.createElement('a');
      div.append(a);
      a.innerHTML = s.name + ' ' + s.surname;
      a.href = `/getFriendPage/${s.name}/${s.surname}/${s.ID}`;
      a.classList.add('status-writer');

      const p = document.createElement('p');
      div.append(p);
      p.innerHTML = s.status;
      p.classList.add('status-text');

      const img = document.createElement('img');
      div.append(img);
      img.src = s.status_image;
      img.classList.add('status-image');
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = s.status_image;
      });

      const like_comment_titles_div = document.createElement('div');
      like_comment_titles_div.classList.add('like_comment_titles_div');
      div.append(like_comment_titles_div);

      const countOfLikes = document.createElement('b');
      countOfLikes.innerHTML = s.count_of_likes + ' Likes';
      countOfLikes.style.cursor = 'pointer';
      like_comment_titles_div.append(countOfLikes);

      const ul = document.createElement('ul');
      ul.classList.add('comment-list-group');
      div.append(ul);
      const likedUsersUL = document.createElement('ul');
      div.append(likedUsersUL);
      likedUsersUL.classList.add('list-group');

      countOfLikes.addEventListener('click', () => {
        likedUsersUL.innerHTML = '';
        ul.innerHTML = '';
        axios({
          method: 'post',
          url: '/getLikedUsers',
          data: {
            status_id: s.status_id
          }
        }).then(res => {
          const likedUsers = res.data.likedUsers;
          if (likedUsers.length) {
            likedUsers.forEach(u => {
              const li = document.createElement('li');
              li.classList.add('liked-user-li');
              likedUsersUL.append(li);
              const likedUserA = document.createElement('a');
              li.append(likedUserA);
              likedUserA.innerHTML = u.name + ' ' + u.surname;
              likedUserA.href = `/getFriendPage/${u.name}/${u.surname}/${u.ID}`;
            });
          }
        });
      });

      const likeBtn = document.createElement('span');
      like_comment_titles_div.append(likeBtn);
      likeBtn.classList.add('fa');
      likeBtn.classList.add('fa-thumbs-o-up');

      const commentsTitle = document.createElement('h5');
      commentsTitle.innerHTML = 'Comments';
      commentsTitle.classList.add('comments-title');
      like_comment_titles_div.append(commentsTitle);

      s.likeStatus ?
        likeBtn.classList.add('unliked-btn') :
        likeBtn.classList.add('liked-btn');

      likeBtn.addEventListener('click', () => {
        if (likeBtn.classList.contains('unliked-btn')) {
          likeBtn.classList.remove('unliked-btn');
          likeBtn.classList.add('liked-btn');
          countOfLikes.innerHTML =
            parseInt(countOfLikes.innerHTML) - 1 + ' Likes';
        } else {
          likeBtn.classList.remove('liked-btn');
          likeBtn.classList.add('unliked-btn');
          countOfLikes.innerHTML =
            parseInt(countOfLikes.innerHTML) + 1 + ' Likes';
        }
        axios({
          method: 'post',
          url: '/likeStatus',
          data: {
            status_id: s.status_id
          }
        });
      });

      const commentWrapper = document.createElement('div');
      div.append(commentWrapper);
      commentWrapper.classList.add('comment-wrapper');
      const input = document.createElement('input');
      input.classList.add('comment-input');
      commentWrapper.append(input);

      const commentBtn = document.createElement('button');
      commentBtn.type = 'submit';
      commentBtn.classList.add('comment-btn');
      commentBtn.innerHTML = 'ADD';
      commentWrapper.append(commentBtn);

      commentBtn.addEventListener('click', e => {
        e.preventDefault();
        axios({
          method: 'post',
          url: '/addComment',
          data: {
            comment: input.value,
            status_id: s.status_id
          }
        });
        const commentLi = document.createElement('li');
        ul.append(commentLi);
        commentLi.classList.add('comment-list-item');

        const commentWriter = document.createElement('a');
        commentLi.append(commentWriter);
        commentWriter.innerHTML = userName + ' ' + userSurname;
        commentWriter.href = '/profile';
        commentWriter.classList.add('comment-writer');

        const commentText = document.createElement('p');
        commentLi.append(commentText);
        commentText.classList.add('comment-text');
        commentText.innerHTML = input.value;

        input.value = '';
      });

      commentsTitle.addEventListener('click', e => {
        likedUsersUL.innerHTML = '';
        ul.innerHTML ?
          (ul.innerHTML = '') :
          axios({
            method: 'post',
            url: '/getComents',
            data: {
              status_id: s.status_id
            }
          }).then(res => {
            const comments = res.data.comments;
            if (comments.length) {
              commentsTitle.innerHTML = comments.length + ' ' + 'Comments';
            }
            comments.forEach(c => {
              const li = document.createElement('li');
              li.classList.add('comment-list-item');
              ul.append(li);

              if (c.status_id == s.status_id && s.ID == ID) {
                const removeCommentBtn = document.createElement('button');
                removeCommentBtn.classList.add('removeCommentBtn');
                removeCommentBtn.innerHTML = 'X';
                li.append(removeCommentBtn);

                removeCommentBtn.addEventListener('click', function (e) {
                  e.preventDefault();
                  axios({
                    method: 'post',
                    url: '/removeComment',
                    data: {
                      comment_id: c.comment_id
                    }
                  }).then(() => {
                    this.parentElement.remove();
                  });
                });
              }
              const commentWriter = document.createElement('a');
              li.append(commentWriter);
              commentWriter.innerHTML = c.name + ' ' + c.surname;
              commentWriter.href = `/getFriendPage/${c.name}/${c.surname}/${c.ID}`;
              commentWriter.classList.add('comment-writer');

              const commentText = document.createElement('p');
              li.append(commentText);
              commentText.classList.add('comment-text');
              commentText.innerHTML = c.comment;
            });
          });
      });
    });
  });
}

//config profile image modal view
const profilePhotoWrapper = document.querySelector('.profilePhoto-wrapper');
profilePhotoWrapper.style.cursor = 'pointer';
profilePhotoWrapper.addEventListener('click', () => {
  modal.style.display = 'block';
  modalImg.src = document.querySelector('.profile-image').src;
});

// chat with socket io

const socket = io('http://localhost:3000');

const sendMessageBtn = document.querySelector('.sendMessageBtn');
const sendMessageInput = document.querySelector('.sendMessageText');
const messagesListGroup = document.querySelector('.messagel-list-group');
const messagesContentBtn = document.getElementById('messages-btn');
const MessageFriendsGroup = document.querySelector('.message-friends-group');

//Message friend id
let friend_id;
messagesContentBtn.addEventListener('click', e => {
  e.preventDefault();
  changeForm.classList.add('close');
  imagesWrapper.classList.add('close');
  friendsPageWrapper.innerHTML = '';
  statusWrapper.innerHTML = '';
  statusWrapper.classList.add('close');
  messageWrapper.classList.remove('close');
  MessageFriendsGroup.innerHTML = '';
  axios({
    method: 'post',
    url: '/getFriendList'
  }).then(res => {
    const friends = res.data.friends;
    friends.forEach(e => {
      const li = document.createElement('li');
      MessageFriendsGroup.append(li);
      li.classList.add('message-friends-list-item');
      li.innerHTML = e.name + ' ' + e.surname;
      li.addEventListener('click', () => {
        friend_id = e.ID
      })
    });
  });
});

sendMessageBtn.addEventListener('click', e => {
  e.preventDefault();
  socket.emit('new_message', {
    message: sendMessageInput.value,
    friend_id
  });
});