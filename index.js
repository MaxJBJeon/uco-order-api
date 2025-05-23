const express = require('express');
const { google } = require('googleapis');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ UCO Order API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
