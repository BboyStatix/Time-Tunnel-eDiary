const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express()
const User = require('./models/user')
const Diary = require('./models/diary')
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
app.use(bodyParser.urlencoded({
  extended: false
}))

app.post('/auth/login', (req, res) => {
  User.findOne(({
    username: req.body.username
  }), (err, user) => {
    if (err) throw err
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found'
      })
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        })
      } else {
        jwt.sign({
          user: user
        }, 'secret', (err, token) => {
          res.json({
            success: true,
            message: 'Successful Authentication!',
            token: token
          })
        })
      }
    }
  })
})

app.post('/auth/verify', (req, res) => {
  jwt.verify(req.body.jwt, 'secret', (err, decoded) => {
    if (err) {
      res.json({
        success: false
      })
    } else {
      res.json({
        success: true
      })
    }
  })
})

app.post('/upload/diary', upload.single('file'), (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id
  console.log(userID)
  console.log(req.file)
  console.log(req.body)
})

app.listen(3001, () => {
  console.log('App listening on port 3001!')
})
