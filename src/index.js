const { checkGoogleSheetLink, googleSheetsSync } = require('./actions');
const { chain } = require('bottender');

module.exports = async function App() {
  console.log('app');
  return chain([checkGoogleSheetLink, googleSheetsSync]);
};
