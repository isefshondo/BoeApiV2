const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

const conn = require('./db/connection');
conn();

const routes = require('./routes/router');

app.use('/api', routes);

const HOST = '0.0.0.0';

app.listen(3000, HOST, () => {
  console.log(`BOE API is running at: http://${HOST}:3000`);
});
