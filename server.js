const express = require('express')
const app = express()
//for use in production. serve the build folder for files optimized
//for production created by npm run build in client directory
//const path = require('path')
//app.use(express.static(path.join(__dirname, 'client/build')))

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log("We're connected")
})

app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})
