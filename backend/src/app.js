const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const outlookRouter = require('./routes/outlook');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: 'trace'
});

// Setup routes
app.use('/auth/outlook', outlookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = client;
