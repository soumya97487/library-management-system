const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(`\n API Request Received`);
  console.log(` Full URL: ${fullUrl}`);
  console.log(` Base Path: ${req.protocol}://${req.get('host')}`);
  console.log(`Endpoint: ${req.originalUrl}`);
  console.log(`HTTP Method: ${req.method}`);
  next();
});


app.get('/api/info', (req, res) => {
  res.send('API called. Check the console for details.');
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/info`);
});
