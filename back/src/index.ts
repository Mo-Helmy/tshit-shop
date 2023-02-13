import express from 'express';
import apiRoute from './routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  '/api/assets/final-products',
  express.static(path.join(__dirname, '../assets/final-products'))
);

app.use(
  cors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    origin: '*',
  })
);

app.use('/api', apiRoute);

app.use('/', (req, res) => {
  res.send('backend started');
});

app.listen(port, () => console.log('server started at http://localhost:8080'));
