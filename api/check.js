// api/check.js
const { google } = require('googleapis');

module.exports = async (req, res) => {
  const storeId = req.query.storeId;
  if (!storeId) return res.status(400).send('Missing storeId');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'New!C2:C',
    });

    const values = response.data.values || [];
    const exists = values.flat().includes(storeId);

    res.status(200).send(exists ? 'EXISTS' : 'NOT_FOUND');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
