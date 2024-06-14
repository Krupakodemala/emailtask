const express = require('express');
const router = express.Router();
const { AuthorizationCode } = require('simple-oauth2');

const oauth2 = new AuthorizationCode({
  client: {
    id: process.env.OUTLOOK_CLIENT_ID,
    secret: process.env.OUTLOOK_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: '/common/oauth2/v2.0/authorize',
    tokenPath: '/common/oauth2/v2.0/token',
  },
});

router.get('/login', (req, res) => {
  const authorizationUri = oauth2.authorizeURL({
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: 'openid profile offline_access user.read mail.read',
    state: 'random_string_here',
  });

  res.redirect(authorizationUri);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const options = {
    code,
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
  };

  try {
    const accessToken = await oauth2.getToken(options);
    console.log('The resulting token: ', accessToken.token);
    // Save the access token and continue
    res.send('Login successful');
  } catch (error) {
    console.error('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
});

router.get('/redirect', async (req, res) => {
    const { code } = req.query;
  
    const options = {
      code,
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    };
  
    try {
      const accessToken = await oauth2.getToken(options);
      console.log('The resulting token: ', accessToken.token);
      // Save the access token and continue
      res.send('Login successful');
    } catch (error) {
      console.error('Access Token Error', error.message);
      res.status(500).json('Authentication failed');
    }
  });

module.exports = router;
