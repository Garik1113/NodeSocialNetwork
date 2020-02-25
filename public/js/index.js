const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const listWrapper = document.getElementById('list-wrapper');

//Searching users
searchButton.addEventListener('click', async e => {
  listWrapper.innerHTML = '';

  e.preventDefault();
  let value = searchInput.value;
  let findedUsers;
  searchInput.value = '';
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
        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-secondary');
        btn.classList.add('btn-sm');
        btn.innerHTML = 'Send request';
        li.append(btn);
      });
    })
    .catch(e => console.log(e));
});
document.querySelector('.container').addEventListener('click', () => {
  listWrapper.innerHTML = '';
});

//get photos
const photosBtn = document.getElementById('photos-btn');
const photosListGroup = document.querySelector('.photos-list-group');
const photosWrapper = document.querySelector('.photos-wrapper');
photosBtn.addEventListener('click', e => {
  changeForm.classList.add('close');
  photosWrapper.classList.remove('close');
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
        // console.log(document.querySelectorAll('.reg-image'));
        // document.querySelectorAll('.reg-image').forEach(img => {
        //   img.addEventListener('click', () => {
        //     img.style.width = '400px';
        //   });
        // });
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
  photosWrapper.classList.add('close');
  let userInform;
  changeForm.classList.contains('close')
    ? changeForm.classList.remove('close')
    : changeForm.classList.add('close');
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
  const age = Number.parseInt(ageInput.value);
  const user = { name, surname, age };
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
});

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

// search

//   searchButton.addEventListener('click', (e) => {
//       console.log("E")
//       e.preventDefault()
//       const value = searchInput.value

//       axios({
//           method:'post',
//           url: '/search',
//           data: {value}
//       })
//   })
