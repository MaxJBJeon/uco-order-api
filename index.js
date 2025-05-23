const express = require('express');
const { google } = require('googleapis');
const app = express();
const PORT = process.env.PORT || 3000;

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'New';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

app.get('/check', async (req, res) => {
  const storeId = req.query.storeId;
  if (!storeId) {
    return res.status(400).send('Missing storeId');
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!C2:C`, // C열만 조회
    });

    const rows = result.data.values || [];
    const exists = rows.flat().includes(storeId);

    res.send(exists ? 'EXISTS' : 'NOT_FOUND');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('UCO Order API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
