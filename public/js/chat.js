const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}
const socket = io({ auth: { name: username } });

const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');
const userUlElement = document.querySelector('#userList');

const renderMessage = (payload) => {
  const { userId, name, message } = payload;

  //Crear un div element
  const divElement = document.createElement('div');

  //Agregar la clase message
  divElement.classList.add('message');

  //Si el id no es el mio, agregar "incognit"
  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }

  //Agregar el name y el mensaje al div
  divElement.innerHTML = `
    <smal>${name}</smal>
    <p>${message}</p>
  `;

  //Agregar el div al chat
  chatElement.appendChild(divElement);

  //Scroll al final de los mensajes
  chatElement.scrollTop = chatElement.scrollHeight;
};

const renderUser = (users) => {
  userUlElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    userUlElement.appendChild(liElement);
  });
};

socket.on('on-message', renderMessage);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = input.value;
  input.value = '';

  socket.emit('send-message', message);
});

const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');

socket.on('connect', () => {
  lblStatusOnline.classList.remove('hidden');
  lblStatusOffline.classList.add('hidden');
});

socket.on('disconnect', () => {
  lblStatusOffline.classList.remove('hidden');
  lblStatusOnline.classList.add('hidden');
});

socket.on('on-client-changed', renderUser);
