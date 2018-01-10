const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const app = express()
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(wtv|flv|mp4|txt|mp3|jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Unsupported file format!'), false)
  }
  cb(null, true)
}
const upload = multer({ fileFilter: fileFilter, storage: storage})

const User = require('./models/user')
const Diary = require('./models/diary')
const Video = require('./models/video')
const Photo = require('./models/photo')
const Audio = require('./models/audio')

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

app.post('/upload/file', upload.single('file'), (req, res) => {

  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id
  const filename = req.file.originalname
  const path = req.file.path

  if(filename.match(/\.(txt)$/)){
    const diary = new Diary({userID: userID, path: path, name: filename})
    diary.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Diary successfully saved');
      }
    })
  }
  else if(filename.match(/\.(wtv|flv|mp4)$/)){
    const video = new Video({userID: userID, path: path, name: filename})
    video.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Video successfully saved');
      }
    })
  }
  else if(filename.match(/\.(jpg|jpeg|png|gif)$/)){
    const photo = new Photo({userID: userID, path: path, name: filename})
    photo.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Photo successfully saved');
      }
    })
  }
  else if(filename.match(/\.(mp3)$/)){
    const audio = new Audio({userID: userID, path: path, name: filename})
    audio.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Audio successfully saved');
      }
    })
  }
})

app.post('/diary/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Diary.find({userID: userID}, (err, entries) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else{
      res.json({
        status:200,
        entries: entries
      })
    }
  })
})

app.post('/photo/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Photo.find({userID: userID}, (err, entries) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else{
      res.json({
        status:200,
        entries: entries
      })
    }
  })
})

app.post('/audio/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Audio.find({userID: userID}, (err, entries) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else{
      res.json({
        status:200,
        entries: entries
      })
    }
  })
})

app.post('/video/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Video.find({userID: userID}, (err, entries) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else{
      res.json({
        status:200,
        entries: entries
      })
    }
  })
})

app.listen(3001, () => {
  console.log('App listening on port 3001!')
})
