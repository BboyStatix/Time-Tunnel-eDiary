const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const mm = require('musicmetadata')
const app = express()

const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(wtv|flv|mp4|txt|docx|mp3|wav|jpg|jpeg|png|gif|bmp)$/)) {
      return cb(new Error('Unsupported file format!'), false)
  }
  cb(null, true)
}
const upload = multer({ fileFilter: fileFilter, storage: storage})
const textract = require('textract')
const Parser = require('./Parser')

const User = require('./models/user')
const Diary = require('./models/diary')
const Video = require('./models/video')
const Photo = require('./models/photo')
const Audio = require('./models/audio')
const Entry = require('./models/entry')

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
  const username = req.body.username
  const password = req.body.password
  User.findOne(({
    username: username
  }), (err, user) => {
    if (err) throw err
    if (!user) {
      if(password.length !== 0){
        const user = new User({username: username, password: password})
        user.save((err) => {
          if (err) {
            console.log(err)
          } else {
            jwt.sign({
              user: user
            }, 'secret', (err, token) => {
              res.json({
                success: true,
                message: 'Successful Registration!',
                token: token
              })
            })
          }
        })
      }
      else{
        res.json({
          success: false,
          message: 'Authentication failed. User not found'
        })
      }
    } else if (user) {
      if (user.password != password) {
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
  const name = req.file.originalname
  const filename = req.file.filename
  const filePath = req.file.path

  if(name.match(/\.(txt)$/)){
    const description = fs.readFileSync(filePath,'utf8')
    const diary = new Diary({userID: userID, filename: filename, name: name, description: description})
    diary.save((err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Diary successfully saved')
      }
    })
  }
  else if(name.match(/\.(docx)$/)){
    textract.fromFileWithPath(filePath, {preserveLineBreaks: true}, (err, text) => {
      const myParser = new Parser
      const dataArray = myParser.parseString(text)
      var diaryArray = []
      var idx = 0
      for(var i=0; i < dataArray.length/4; i++){
        const date = new Date(dataArray[idx] + '-' + dataArray[idx+1].slice(0, 2) + '-' + dataArray[idx+1].slice(2, 4))
        const description = dataArray[idx+2]
        const eventType = dataArray[idx+3]
        diaryArray.push({userID: userID,  filename: filename, name: name, description: description, created_at: date, eventType: eventType})
        idx += 4
      }
      Diary.insertMany(diaryArray, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Diaries successfully saved')
        }
      })
    })
  }
  else if(name.match(/\.(wtv|flv|mp4)$/)){
    const video = new Video({userID: userID, filename: filename, name: name})
    video.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Video successfully saved')
      }
    })
  }
  else if(name.match(/\.(jpg|jpeg|png|gif|bmp)$/)){
    const photo = new Photo({userID: userID, filename: filename, name: name})
    photo.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Photo successfully saved')
      }
    })
  }
  else if(name.match(/\.(mp3|wav)$/)){
    mm(fs.createReadStream(filePath), (err, metadata) => {
      const audio = new Audio({userID: userID, filename: filename, name: name, artist: metadata.artist[0]})
      audio.save((err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Audio successfully saved')
        }
      })
    })
  }
})

app.get('/download/file', (req, res) => {
  const filePath = path.join(__dirname, '/uploads/' + req.query.filename)
  jwt.verify(req.query.jwt, 'secret', (err, decoded) => {
    if (err){
      throw err
    }
    else{
      res.sendFile(filePath)
    }
  })
})

app.post('/diary/view', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id
  const objectID = req.body.objectID

  Diary.find({userID: userID, _id: objectID}, (err, diary) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else{
      res.json({
        status: 200,
        data: diary[0].description
      })
    }
  })
})

app.get('/photo/view', (req,res) => {
  const filePath = path.join(__dirname, '/uploads/' + req.query.filename)
  jwt.verify(req.query.jwt, 'secret', (err, decoded) => {
    if (err){
      throw err
    }
    else{
      res.sendFile(filePath)
    }
  })
})

app.get('/audio/view', (req,res) => {
  const filePath = path.join(__dirname, '/uploads/' + req.query.filename)
  jwt.verify(req.query.jwt, 'secret', (err, decoded) => {
    if (err){
      throw err
    }
    else{
      res.sendFile(filePath)
    }
  })
})

app.get('/video/view', (req,res) => {
  const filePath = path.join(__dirname, '/uploads/' + req.query.filename)
  jwt.verify(req.query.jwt, 'secret', (err, decoded) => {
    if (err){
      throw err
    }
    else{
      res.sendFile(filePath)
    }
  })
})

app.post('/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Entry.find({userID: userID}).sort('created_at').exec((err, entries) => {
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

app.post('/diary/entries', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  const dateString = req.body.date
  const dateParts = dateString.split("/")
  const dateObject = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  const nextDay = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  nextDay.setDate(nextDay.getDate() + 1)

  Diary.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, eventType: true, created_at: true}, (err, entries) => {
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

  const dateString = req.body.date
  const dateParts = dateString.split("/")
  const dateObject = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  const nextDay = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  nextDay.setDate(nextDay.getDate() + 1)

  Photo.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, filename: true, created_at: true, _id: false}, (err, entries) => {
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

  const dateString = req.body.date
  const dateParts = dateString.split("/")
  const dateObject = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  const nextDay = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  nextDay.setDate(nextDay.getDate() + 1)

  Audio.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, filename: true, artist: true, created_at: true, _id: false}, (err, entries) => {
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

  const dateString = req.body.date
  const dateParts = dateString.split("/")
  const dateObject = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  const nextDay = new Date(Date.UTC(dateParts[2], dateParts[1] - 1, dateParts[0]))
  nextDay.setDate(nextDay.getDate() + 1)

  Video.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, filename: true, created_at: true, _id: false}, (err, entries) => {
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

app.post('/entries/dates', (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  Entry.distinct('created_at', {userID: userID}, (err, dates) => {
    if(err) {
      res.json({
        status: 500,
        error: err
      })
    }
    else {
      dates.sort((a, b) => a - b)
      res.json({
        status: 200,
        dates: dates
      })
    }
  })
})

app.listen(3001, () => {
  console.log('App listening on port 3001!')
})
