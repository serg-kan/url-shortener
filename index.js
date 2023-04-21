const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();

const { getAll, createShortUrl, redirectToUrl } = require('./controller');
const port = 3000;

// establish Redis connection
const client = redis.createClient();
(async () => {
  await client.connect();
})();

// configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public' ));



app.get('/', (req, res) => {
  getAll(req, res, client);
});

app.get('/:shortUrl', (req, res) => {
  redirectToUrl(req, res, client);
});

app.post('/', (req, res) => {
   createShortUrl(req,res,client);
});

// Listeners
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

client.on('connect', function() {
  console.log('Connected!');
});

client.on('error', function(err) {
  console.log(err);
});
  
