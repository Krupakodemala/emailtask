const outlook = require('node-outlook');
const client = require('../app');
require('dotenv').config();

const syncEmails = async (user) => {
  const token = user.token;

  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

  outlook.mail.getMessages({
    token: token.access_token,
    folderId: 'inbox',
    odataParams: {
      '$select': 'Subject,ReceivedDateTime,From',
      '$orderby': 'ReceivedDateTime desc',
      '$top': 10
    }
  }, async (error, result) => {
    if (error) {
      console.error('getMessages error: ', error);
    } else if (result) {
      const emails = result.value;
      for (const email of emails) {
        await client.index({
          index: `emails-${user.id}`,
          body: email
        });
      }
    }
  });
};

module.exports = { syncEmails };
