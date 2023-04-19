const { generateShortUrl } = require('./helpers');

const getAll = async (req, res, client) => {
  try {
    const keys = await client.keys('*');
    const valuesPromises = keys.map(k => client.get(k));
    const values = await Promise.all(valuesPromises);

    const data = [];

    for (let i = 0; i < keys.length; i++) {
      data.push({ 
        key: keys[i],
        value: values[i]
      });
    }

    console.log('data', data);
    res.render('index', { data });

  } catch (err) {
    res.send(`error: ${err}`);
  }
};

const redirectToUrl = (req, res, client) => {
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
  getAll,
  redirectToUrl,
  createShortUrl
};