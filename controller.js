const { generateShortUrl } = require('./helpers');

const getUrl = (req, res, client) => {
  console.log(req.body);
  console.log('hello');

  client.set('short', req.body.url);
  res.send('Hello World');
}

const createShortUrl = async (req, res, client) => {

  console.log('initial url', req.body.url);
  try { 
    const urlDb = await client.get(req.body.url);
    console.log('url', urlDb);

    if (urlDb !== null) {
      res.redirect('/');
    
    } else {

      const shortUrl = generateShortUrl(req.body.url, 8);
      console.log('shortUrl', shortUrl);

      client.set(req.body.url, shortUrl);
      res.redirect('/');
    }
  } catch (err) { 
    res.status(500).send({ error: err });
  }
}
  

module.exports = {
  getUrl,
  createShortUrl
};