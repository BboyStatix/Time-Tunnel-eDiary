const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const app = express()
const User = require('./models/user')
//for use in production. serve the build folder for files optimized
//for production created by npm run build in client directory
//const path = require('path')
//app.use(express.static(path.join(__dirname, 'client/build')))

//connect to database
mongoose.connect('mongodb://localhost/test')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Connected to database")
})

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/auth/login', (req, res) => {
  User.findOne(({ username: req.body.username, password: req.body.password }), (err, user) => {
    if (user) res.json({success: true})
  })
})

app.listen(3001, () => {
  console.log('App listening on port 3001!')
})
