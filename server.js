const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');
const path = require('path');
const { authUrl, saveToken } = require('./src/GoogleOauth');
const ejs = require('ejs');

const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.static('public'));

  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

  server.get('/api', (req, res) => {
    res.json({ ok: true });
  });

  server.get('/liff', (req, res) => {
    console.log('liff');
    const filename = path.join(__dirname + `/src/liff/settings.html`);
    authUrl().then(url => {
      ejs.renderFile(filename, { url }, {}, function(err, str) {
        // str => Rendered HTML string
        res.send(str);
      });
    });
    return;
  });

  server.all('/webhooks/line', (req, res) => {
    return handle(req, res);
  });

  server.all('/googleRedirect', async (req, res) => {
    const filename = path.join(__dirname + `/src/page/googleRedirect.html`);
    const code = req.query.code;
    await saveToken(code);
    ejs.renderFile(filename, {}, {}, function(err, str) {
      res.send(str);
    });
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
