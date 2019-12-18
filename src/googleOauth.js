const fs = require('mz/fs');
const { google } = require('googleapis');

const tokenPath = 'token.json';

async function readFile(path) {
  try {
    return await fs.readFile(path);
  } catch (error) {
    return null;
  }
}

let oAuth2ClientCache = null;
async function getOAuth2Client() {
  if (oAuth2ClientCache == null) {
    // Load client secrets from a local file.
    const content = await readFile('client_secret.json');
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    oAuth2ClientCache = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
  }
  return oAuth2ClientCache;
}

async function getToken() {
  // Check if we have previously stored a token.
  const token = await readFile(tokenPath);
  if (token == null) {
    return null;
  }
  return JSON.parse(token).tokens;
}

async function authUrl() {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const client = await getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

async function saveToken(code) {
  const client = await getOAuth2Client();
  const token = await client.getToken(code);
  await fs.writeFile(tokenPath, JSON.stringify(token));
  return token;
}

async function getAuth() {
  const token = await getToken();
  const oauth2client = await getOAuth2Client();
  oauth2client.setCredentials(token);
  return oauth2client;
}

module.exports = {
  authUrl,
  saveToken,
  getToken,
  getAuth,
};

// function listMajors(auth) {
//   const sheets = google.sheets({version: 'v4', auth});
//   sheets.spreadsheets.values.get({
//     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//     range: 'Class Data!A2:E',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const rows = res.data.values;
//     if (rows.length) {
//       console.log('Name, Major:');
//       // Print columns A and E, which correspond to indices 0 and 4.
//       rows.map((row) => {
//         console.log(`${row[0]}, ${row[4]}`);
//       });
//     } else {
//       console.log('No data found.');
//     }
//   });
// }
