import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { createServer } from 'http';

import { router } from './api';

const app = express();

const server = createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

app.get('/', (req, res) => res.redirect('/api'));

app.use('/api', router);

const { PORT = 5000 } = process.env;

server.listen({ port: PORT }, () => {
  process.stdout.write(`🚀 Server ready at http://localhost:${PORT}/api\n`);
});
