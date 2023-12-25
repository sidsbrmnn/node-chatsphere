import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import serveStatic from 'serve-static';
import { Server as SocketIOServer } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason, promise);
  process.exit(1);
});

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.disable('x-powered-by');
  app.use(compression());
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Chat app' });
});

app.all('*', (req, res) => {
  res.status(404).send('Not found');
});

io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });
});

const port = parseInt(process.env.PORT, 10) || 3000;
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
