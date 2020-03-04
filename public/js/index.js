const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const listWrapper = document.getElementById('list-wrapper');
const friendRequestList = document.getElementById('friendRequestList');
const friendsPageWrapper = document.querySelector('.friends-page-wrapper');
const notiсeBtn = document.getElementById('notificationBtn');
const statusWrapper = document.querySelector('.status-wrapper');
const messageWrapper = document.querySelector('.message-wrapper');

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

       console.log(findedUsers)
      findedUsers.forEach(e => {
      //   // console.log(e.status);
        let li = document.createElement('li');
        const aFriendLink = document.createElement('a');
        aFriendLink.innerHTML = e.name + ' ' + e.surname;
        aFriendLink.classList.add('friend-link');
        aFriendLink.href = `/getFriendPage/${e.name}/${e.surname}/${e.ID}`;
        li.classList.add('finded-list-item');
        li.append(aFriendLink);
        listWrapper.append(li);
         
        if(e.status=='Send request'){
          let acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = 'Send request';
            acceptBtn.className='send_request'
            // acceptBtn.className+='send_request'
            acceptBtn.setAttribute('data-id',e.ID)
            li.appendChild(acceptBtn)
        }
        else if(e.status=='Request sended'){
          let acceptBtn = document.createElement('button');
            acceptBtn.innerHTML = 'cansel';
            acceptBtn.className='cansel'
            // acceptBtn.className+='send_request'
           
            li.appendChild(acceptBtn)
        }

      //   while (true) {
      //     if (e.status === 'Has Sended request') {
      //       let acceptBtn = document.createElement('button');
      //       acceptBtn.classList.add('btn-small-success');
      //       acceptBtn.innerHTML = 'Accept';
      //       li.append(acceptBtn);

      //       let deslineBtn = document.createElement('button');
      //       deslineBtn.classList.add('btn-small-warning');
      //       deslineBtn.innerHTML = 'Desline';
      //       li.append(deslineBtn);
      //       acceptBtn.addEventListener('click', k => {
      //         k.preventDefault();
      //         axios({
      //           method: 'post',
      //           url: '/acceptFriendRequest',
      //           data: { user_two_id: e.ID }
      //         });
      //         acceptBtn.remove();
      //         deslineBtn.remove();
      //         e.status = 'Friend';
      //       });
      //       deslineBtn.addEventListener('click', k => {
      //         k.preventDefault();
      //         axios({
      //           method: 'post',
      //           url: '/deslineFriendRequest',
      //           data: { user_two_id: e.ID }
      //         });
      //         deslineBtn.remove();
         
      //       });
      //       return;
      //     } else if (e.status === 'Request sended') {
      //       const removeBtn = document.createElement('button');
      //       removeBtn.innerHTML = 'Cancel';
      //       removeBtn.classList.add('btn-small-warning');
      //       li.append(removeBtn);
      //       removeBtn.addEventListener('click', k => {
      //         k.preventDefault();
      //         axios({
      //           method: 'post',
      //           url: '/removeRequest',
      //           data: { user_two_id: e.ID }
      //         });
      //         removeBtn.remove();
      //         e.status = 'Send request';
      //         return;
      //       });
      //       return;
      //     }
      //     if (e.status === 'Send request') {
      //       const sendRequestBtn = document.createElement('button');
      //       sendRequestBtn.classList.add('btn-small-success');
      //       sendRequestBtn.innerHTML = 'Send request';
      //       li.append(sendRequestBtn);
      //       sendRequestBtn.addEventListener('click', l => {
      //         sendRequestBtn.remove();
      //         l.preventDefault();
      //         axios({
      //           method: 'post',
      //           url: '/sendRequest',
      //           data: { user_two_id: e.ID }
      //         });
      //         sendRequestBtn.remove();
      //         const removeBtn = document.createElement('button');
      //         removeBtn.innerHTML = 'Cancel';
      //         removeBtn.classList.add('btn-small-warning');
      //         li.append(removeBtn);
      //         removeBtn.addEventListener('click', function(e){
      //           e.preventDefault();
      //           axios({
      //             method: 'post',
      //             url: '/removeRequest',
      //             data: { user_two_id: e.ID }
      //           });
              
      //           const sendRequestBtn = document.createElement('button');
      //           sendRequestBtn.classList.add('btn-small-success');
      //           sendRequestBtn.innerHTML = 'Send request';
             
      //      this.parentElement.appendChild(sendRequestBtn)
      //          removeBtn.remove();
      //         });
      //       });
      //       return;
      //     } else if (e.status === 'Friend') {
      //       const removeFriend = document.createElement('button');
      //       removeFriend.classList.add('btn-small-warning');
      //       removeFriend.innerHTML = 'Remove';
      //       li.append(removeFriend);
      //       removeFriend.addEventListener('click', k => {
      //         k.preventDefault();
      //         axios({
      //           method: 'post',
      //           url: '/removeFriend',
      //           data: { userId: e.ID }
      //         });
      //         removeFriend.remove();
      //         e.status = 'Send request';
      //       });
      //       return;
      //     }
      //   }
      });



      let send_request =document.querySelectorAll('.send_request')

      for(let i=0;i<send_request.length;i++){
        send_request[i].addEventListener('click',sendfunction)
      }

      let cansel =document.querySelectorAll('.cansel')

      for(let i=0;i<cansel.length;i++){
        cansel[i].addEventListener('click',canselfunc)
      }


   function sendfunction(){

    let user_two_id = this.getAttribute('data-id')
    console.log(user_two_id)
              axios({
               method: 'post',
               url: '/sendRequest',
               data: { user_two_id}
             })
              let acceptBtn = document.createElement('button');
              acceptBtn.innerHTML = 'cansel';
              acceptBtn.className='cansel'
              
              acceptBtn.addEventListener('click',canselfunc)
              this.parentElement.appendChild(acceptBtn)
              this.remove()
      
    
   }

      function canselfunc(){
        alert(2)
      }
    })
    .catch(e => console.log(e));


});

// let send_request = document.querySelectorAll('.send_request')
// console.log()
// for(let i =0 ; i<send_request.length;i++){
//   send_request[i].addEventListener('click',function(){
//     alert()
//   })
// }

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
          img.onclick = function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
          };

          const closeSpan = document.querySelectorAll('.closeSpan')[0];
          closeSpan.onclick = function() {
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
  })
    .then(res => {
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
              data: { user_two_id: e.ID }
            });
          });

          deslineBtn.addEventListener('click', k => {
            k.preventDefault();
            axios({
              method: 'post',
              url: '/deslineFriendRequest',
              data: { user_two_id: e.ID }
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
          data: { userId: k.ID }
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
  function checkFriendRequests(){
    axios({
    method: 'post',
    url: '/checkFriendRequests'
  }).then(res => {
    let num = res.data.friendRequestsInform.length;
    console.log(num)
    if (num > 0) {
      notiсeBtn.innerHTML = num + ' ' + 'Notifications';
    }else if(num <= 0){
      notiсeBtn.innerHTML ='Notifications';
    }
  });
}
  // checkFriendRequests()
  setInterval(checkFriendRequests,1000)

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
    statuses.forEach(s => {
      const div = document.createElement('div');
      div.classList.add('alert');
      div.classList.add('alert-info');
      div.classList.add('status-div');
      statusWrapper.append(div);

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

      const ul = document.createElement('ul');
      ul.classList.add('comment-list-group');
      div.append(ul);

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
        commentWriter.innerHTML = 'ME';
        commentWriter.href = '/profile';
        commentWriter.classList.add('comment-writer');

        const commentText = document.createElement('p');
        commentLi.append(commentText);
        commentText.classList.add('comment-text');
        commentText.innerHTML = input.value;

        input.value = '';
      });
      p.addEventListener('click', e => {
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
                li.classList.add('comment-list-item');
                ul.append(li);
                const commentWriter = document.createElement('a');
                li.append(commentWriter);
                commentWriter.innerHTML = c.name + ' ' + c.surname;
                commentWriter.href = '/profile';
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

// const messageForm = document.getElementById('send-container')
// const messageContainer = document.getElementById('message-container')

const socket = io('http://localhost:3000');

const sendMessageBtn = document.querySelector('.sendMessageBtn');
const sendMessageInput = document.querySelector('.sendMessageText');
const messagesListGroup = document.querySelector('.messagel-list-group');
const messagesContentBtn = document.getElementById('messages-btn');
const MessageFriendsGroup = document.querySelector('.message-friends-group');

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
    });
  });
});

sendMessageBtn.addEventListener('click', e => {
  e.preventDefault();
  socket.emit('new_message', sendMessageInput.value);
});
