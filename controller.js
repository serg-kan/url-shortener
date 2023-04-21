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

const redirectToUrl = async (req, res, client) => {
  try {
    const originalUrl = await client.get(req.params.shortUrl);

    res.redirect(originalUrl);
  } catch (err) {
    res.send(`error: ${err}`);
  }
}

const createShortUrl = async (req, res, client) => {
  try { 
    const urlDb = await client.get(req.body.url);

    if (urlDb !== null) {
      res.redirect('/');
    } else {
      const shortUrl = generateShortUrl(req.body.url, 8);

      client.set(shortUrl, req.body.url);
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