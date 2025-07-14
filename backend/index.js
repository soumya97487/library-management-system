// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/books', require('./routes/books'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/borrowers', require('./routes/borrowers'));
app.use('/api/rentals', require('./routes/rentals'));


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
}

module.exports = app;
