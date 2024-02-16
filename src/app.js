const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

const conn = require('./db/connection')
conn()

const routes = require('./routes/router')

app.use('/', routes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
