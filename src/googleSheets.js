const fs = require('mz/fs');
const { google } = require('googleapis');
const { getAuth } = require('./googleOauth');

const sheetIdPath = 'sheetId.json';

async function readFile(path) {
  try {
    return await fs.readFile(path);
  } catch (error) {
    return null;
  }
}

async function getSheets() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

async function getOrCreateSheetId(sheets) {
  // get cache
  const sheetId = await readFile(sheetIdPath);
  if (sheetId) {
    return sheetId;
  }

  if (sheets == null) {
    return null;
  }

  // create sheet
  const sheet = await sheets.spreadsheets.create({
    resource: {
      properties: {
        title: 'google sheets bottender demo',
      },
    },
    fields: 'spreadsheetId',
  });
  const spreadsheetId = sheet.data.spreadsheetId;

  // save to cache
  await fs.writeFile(sheetIdPath, spreadsheetId);
  return spreadsheetId;
}

async function appendToSheet(row) {
  try {
    const sheets = await getSheets();
    const spreadsheetId = '' + (await getOrCreateSheetId(sheets));
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:A',
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: 'ROWS',
        values: [row],
      },
    });
  } catch (error) {
    console.log('append error:');
    console.log(error);
  }
}

module.exports = {
  appendToSheet,
};
