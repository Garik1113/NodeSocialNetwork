const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const listWrapper = document.getElementById('list-wrapper');
const friendRequestList = document.getElementById('friendRequestList');
const friendsPageWrapper = document.querySelector('.friends-page-wrapper');
const notiсeBtn = document.getElementById('notificationBtn');
const statusWrapper = document.querySelector('.status-wrapper');

//Searching users

searchInput.addEventListener('input', async e => {
  listWrapper.innerHTML = '';
  e.preventDefault();
  let value = searchInput.value;
  let findedUsers;
  await axios({
    method: 'post',
    url: '/SearchUser',
    data: { value }
  })
    .then(res => {
      findedUsers = res.data.findedUsers;
      findedUsers.forEach(e => {
        let li = document.createElement('li');
        li.classList.add('finded-list-item');
        li.innerHTML = e.name + ' ' + e.surname;
        listWrapper.append(li);
        if (e.status === 'Has Sended request') {
          let acceptBtn = document.createElement('button');
          acceptBtn.classList.add('btn');
          acceptBtn.classList.add('btn-primary');
          acceptBtn.classList.add('btn-sm');
          acceptBtn.innerHTML = 'Accept';
          li.append(acceptBtn);
          let deslineBtn = document.createElement('button');

          deslineBtn.classList.add('btn');
          deslineBtn.classList.add('btn-secondary');
          deslineBtn.classList.add('btn-sm');
          deslineBtn.innerHTML = 'Desline';

          li.append(deslineBtn);
          acceptBtn.addEventListener(
            'click',
            AcceptRequest.bind(this, e, deslineBtn, acceptBtn)
          );
          deslineBtn.addEventListener(
            'click',
            DeslineRequest.bind(this, e, acceptBtn, deslineBtn)
          );
        } else if (e.status === 'Request sended') {
          const small = document.createElement('small');
          small.innerHTML = 'Sended';
          small.style.color = '#000000';
          small.style.fontSize = '16px';
          li.append(small);
        } else if (e.status === 'Send request') {
          const sendRequestBtn = document.createElement('button');
          sendRequestBtn.classList.add('btn');
          sendRequestBtn.classList.add('btn-primary');
          sendRequestBtn.classList.add('btn-sm');
          sendRequestBtn.innerHTML = 'Send request';
          li.append(sendRequestBtn);
          sendRequestBtn.addEventListener('click', l => {
            sendRequestBtn.innerHTML = 'Sended';
            sendRequestBtn.disabled = true;
            l.preventDefault();
            axios({
              method: 'post',
              url: '/sendRequest',
              data: { user_two_id: e.ID }
            });
          });
        } else if (e.status === 'Friend') {
          const small = document.createElement('small');
          small.innerHTML = 'Friend';
          small.style.color = '#000000';
          li.append(small);
        }
      });
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
          li.append(img);
          img.addEventListener('click', e => {
            e.target.classList.add('getFullImage');
          });
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
              data: { imagePath: e.image_path }
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
              data: { imagePath: e.image_path }
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
    const user = { name, surname, age };
    nameError.innerHTML = '';
    surnameError.innerHTML = '';
    ageError.innerHTML = '';
    axios({
      method: 'post',
      url: '/saveChanges',
      data: { user }
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
  }).then(res => {
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

        acceptBtn.addEventListener(
          'click',
          AcceptRequest.bind(this, e, deslineBtn, acceptBtn)
        );

        deslineBtn.addEventListener(
          'click',
          DeslineRequest.bind(this, e, acceptBtn, deslineBtn)
        );
      });
    }
  });
});

//friend request functions
function DeslineRequest(e, btn1, btn2) {
  if (btn1) {
    btn1.classList.add('close');
  }
  if (btn2) {
    btn2.innerHTML = 'Deslined';
    btn2.disabled = true;
  }

  axios({
    method: 'post',
    url: '/deslineFriendRequest',
    data: { userId: e.ID }
  });
}
function AcceptRequest(e, btn1, btn2) {
  if (btn1) {
    btn1.classList.add('close');
  }
  if (btn2) {
    btn2.innerHTML = 'Accepted';
    btn2.disabled = true;
  }
  axios({
    method: 'post',
    url: '/acceptFriendRequest',
    data: { userId: e.ID }
  });
}

//Get friends list
const friendsBtn = document.getElementById('friends-btn');

friendsBtn.addEventListener('click', e => {
  friendsPageWrapper.innerHTML = '';
  imagesWrapper.classList.add('close');
  changeForm.classList.add('close');
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
          data: { userId: k.ID }
        });
      });
    });
  });
});

// Share status
const statusInput = document.querySelector('.status-input');
const statusBtn = document.querySelector('.status-btn');

statusBtn.addEventListener('click', e => {
  e.preventDefault();
  axios({
    method: 'post',
    url: '/shareStatus',
    data: { status: statusInput.value }
  });
  statusInput.value = '';
});

//See notifications and statuss when window is loaded
const newsBtn = document.getElementById('news-btn');
const commentListWrapper = document.querySelector('.comment-list-wrapper');
newsBtn.addEventListener('click', getFriendStatuss);
window.onload = () => {
  statusWrapper.innerHTML = '';
  axios({
    method: 'post',
    url: '/checkFriendRequests'
  }).then(res => {
    let num = res.data.friendRequestsInform.length;
    if (num > 0) {
      notiсeBtn.innerHTML = num + ' ' + 'Notifications';
    }
  });
  getFriendStatuss();
};

function getFriendStatuss() {
  statusWrapper.innerHTML = '';
  friendsPageWrapper.innerHTML = '';
  imagesWrapper.classList.add('close');
  changeForm.classList.add('close');
  statusWrapper.classList.remove('close');
  statusWrapper.innerHTML = '';
  axios({
    method: 'post',
    url: '/getFriendStatus'
  }).then(res => {
    const statuses = res.data.friendStatuss;
    statuses.forEach(s => {
      const div = document.createElement('div');
      div.classList.add('alert');
      div.classList.add('alert-info');
      statusWrapper.append(div);
      const h3 = document.createElement('h3');
      div.append(h3);
      h3.innerHTML = s.status;
      h3.style.cursor = 'pointer';
      const a = document.createElement('a');
      div.append(a);
      a.innerHTML = s.name + ' ' + s.surname;
      a.href = `/getFriendPage/${s.name}/${s.surname}/${s.ID}`;
      const ul = document.createElement('ul');
      ul.classList.add('list-group');
      div.append(ul);
      const input = document.createElement('input');
      div.append(input);
      const commentBtn = document.createElement('button');
      commentBtn.innerHTML = 'ADD';
      div.append(commentBtn);
      commentBtn.addEventListener('click', e => {
        axios({
          method: 'post',
          url: '/addComment',
          data: {
            comment: input.value,
            status_id: s.status_id
          }
        });
        input.value = '';
      });
      h3.addEventListener('click', e => {
        ul.innerHTML
          ? (ul.innerHTML = '')
          : axios({
              method: 'post',
              url: '/getComents',
              data: { status_id: s.status_id }
            }).then(res => {
              const comments = res.data.comments;
              comments.forEach(c => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                ul.append(li);
                const h4 = document.createElement('h4');
                li.append(h4);
                h4.innerHTML = c.name + ' ' + c.surname;
                const p = document.createElement('p');
                li.append(p);
                p.innerHTML = c.comment;
              });
            });
      });
    });
  });
}

// function getFriendStatuss() {
//   imagesWrapper.classList.add('close');
//   statusWrapper.innerHTML = '';
//   statusWrapper.classList.remove('close');
//   changeForm.classList.add('close');
//   friendsPageWrapper.innerHTML = '';
//   commentListWrapper.innerHTML = '';
//   axios({
//     method: 'post',
//     url: '/getFriendStatus'
//   }).then(res => {
//     const statuss = res.data.friendStatuss.filter(s => s !== null);
//     if (statuss.length === 0) {
//       const p = document.createElement('p');
//       statusWrapper.append(p);
//       p.innerHTML = 'No statuses yet';
//     }
//     statuss.forEach(e => {
//       let friendStatus = e.status;
//       let friendComments = e.comments;
//       const div = document.createElement('div');
//       div.classList.add('alert');
//       div.classList.add('alert-info');
//       div.classList.add('status-div');
//       statusWrapper.append(div);
//       div.innerHTML = friendStatus.status;
//       const a = document.createElement('a');
//       a.href = a.href = `/getFriendPage/${friendStatus.name}/${friendStatus.surname}/${friendStatus.ID}`;
//       a.innerHTML = friendStatus.name + ' ' + friendStatus.surname;
//       const ul = document.createElement('ul');
//       div.append(ul);
//       friendComments.forEach(c => {
//         const li = document.createElement('li');
//         ul.append(li);
//         li.innerHTML = c.comment;
//       });
//       div.append(a);
//       const form = document.createElement('form');
//       div.append(form);
//       const commentInput = document.createElement('input');
//       form.append(commentInput);
//       const comentBtn = document.createElement('button');
//       form.append(comentBtn);
//       comentBtn.classList.add('btn');
//       comentBtn.classList.add('btn-sm');
//       comentBtn.classList.add('btn-primary');
//       comentBtn.innerHTML = 'Add';
//       comentBtn.addEventListener('click', e => {
//         e.preventDefault();
//         axios({
//           method: 'post',
//           url: '/addComent',
//           data: {
//             comment: commentInput.value,
//             status_id: friendStatus.status_id
//           }
//         });
//         location.reload(true);
//         commentInput.value = '';
//       });
//       const btn = document.createElement('button');
//       btn.classList.add('btn');
//       btn.classList.add('btn-sm');
//       btn.classList.add('btn-primary');
//       btn.innerHTML = 'Like';
//       div.append(btn);
//     });
//   });
// }

// const messageForm = document.getElementById('send-container')
// const messageContainer = document.getElementById('message-container')
// const messageInput = document.getElementById('message-input')
// const socket = io('http://localhost:3000')

// //socket chat

// socket.on("chat-message", data => {
//     appendMessage(data)
// })
// messageForm.addEventListener('submit', e => {
//     e.preventDefault()
//     const message = messageInput.value
//     socket.emit('send-chat-message', message)
//     appendMessage(message)
//     messageInput.value = ''

// })

// function appendMessage(message){
//     const messageElement = document.createElement('div')
//     messageElement.innerText = message
//     messageContainer.append(messageElement)
//   }
