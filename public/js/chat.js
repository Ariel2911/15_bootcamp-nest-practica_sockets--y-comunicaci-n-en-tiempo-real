const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}
const socket = io();

const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');

const renderMessage = (payload) => {
  const { userId, message } = payload;

  //Crear un div element
  const divElement = document.createElement('div');

  //Agregar la clase message
  divElement.classList.add('message');

  //Si el id no es el mio, agregar "incognit"
  if (userId !== socket.id) {
    divElement.classList.add('incognit');
  }

  //Agregar el mensaje al div
  divElement.innerHTML = message;

  //Agregar el div al chat
  chatElement.appendChild(divElement);
};

socket.on('on-message', renderMessage);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = input.value;
  input.value = '';

  socket.emit('send-message', message);
});
