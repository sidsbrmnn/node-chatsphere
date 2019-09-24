require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Chat app' });
});

io.on('connection', socket => {
  socket.on('chat message', message => {
    io.emit('chat message', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.info('Listening on port', PORT);
});
