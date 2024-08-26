const express = require('express')
const cors = require('cors');
const app = express()
const router = require('./rootRouter')
const port = process.env.PORT || 3000
app.use(cors());

app.use(express.json())
app.use('/.netlify/functions/app', router)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})