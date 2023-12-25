const socket = io();

const form = document.querySelector('form');
const message = document.getElementById('message');
const messages = document.getElementById('messages');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('chat message', message.value);
  message.value = '';
});

socket.on('chat message', (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});
