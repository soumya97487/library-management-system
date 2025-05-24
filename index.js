const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()

const app = express()

app.use(express.json())

connectDB()

app.use('/api/authors', require('./routes/authors'))
// app.use('/api/books', require('./routes/books'))
// app.use('/api/categories', require('./routes/categories'))
// app.use('/api/borrowers', require('./routes/borrowers'))
// app.use('/api/loans', require('./routes/loans'))

const PORT = process.env.PORT

app.listen(PORT, ()=>console.log(`server is runninmg on port ${PORT}`))