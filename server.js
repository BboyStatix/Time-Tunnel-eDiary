const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const mm = require('musicmetadata')
const async = require('async')
const ffmpeg = require('fluent-ffmpeg')

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
const upload = multer({ storage: storage })
const textract = require('textract')
const Parser = require('./Parser')
const sizeOf = require('image-size')

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
mongoose.connect('localhost/test')
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

app.post('/upload/file', upload.array('files'), (req, res) => {
  const token = req.body.jwt
  const userID = jwt.decode(token, 'secret').user._id

  async.each(req.files, (file, callback) => {
    const nameExtensionArr = file.originalname.split('.')
    const name = nameExtensionArr[0]
    const extension = nameExtensionArr[1]
    const filename = file.filename
    const filePath = file.path

    if(file.originalname.match(/\.(txt)$/)){
      const description = fs.readFileSync(filePath,'utf8')
      const diary = new Diary({userID: userID, filename: filename, name: name, fileType: extension, description: description})
      diary.save((err) => {
        if(err){
          return callback(err)
        }
        else{
          callback()
        }
      })
    }
    else if(file.originalname.match(/\.(pdf)$/)){
      const diary = new Diary({userID: userID, filename: filename, name: name, fileType: extension})
      diary.save((err) => {
        if(err){
          return callback(err)
        }
        else{
          callback()
        }
      })
    }
    else if(file.originalname.match(/\.(doc|docx)$/)){
      textract.fromFileWithPath(filePath, {preserveLineBreaks: true}, (err, text) => {
        const myParser = new Parser
        const dataArray = myParser.parseDocString(text)
        if(dataArray.length !== 0) {
          var diaryArray = []
          var idx = 0
          for(var i=0; i < dataArray.length/4; i++){
            const date = new Date(dataArray[idx] + '-' + dataArray[idx+1].slice(0, 2) + '-' + dataArray[idx+1].slice(2, 4))
            const description = dataArray[idx+2]
            const eventType = dataArray[idx+3]
            diaryArray.push({userID: userID, filename: filename, name: name+i, fileType: extension, description: description, created_at: date, eventType: eventType})
            idx += 4
          }
          Diary.insertMany(diaryArray, (err) => {
            if(err){
              return callback(err)
            }
            else{
              callback('reload')
            }
          })
        }
        else {
          const diary = new Diary({userID: userID, filename: filename, name: name, fileType: extension, description: text})
          diary.save((err) => {
            if(err){
              return callback(err)
            }
            else{
              callback()
            }
          })
        }
      })
    }
    else if(file.originalname.match(/\.(wtv)$/)){
      ffmpeg.ffprobe(filePath,(err, metadata) => {
        if(err) {
          callback(err)
        }
        else {
          const description = metadata.format.tags['WM/SubTitleDescription']
          const wtvParser = new Parser
          const wtvHash = wtvParser.parseWtvString(file.originalname)

          if (Object.keys(wtvHash).length !== 0){
            video = new Video(Object.assign({userID: userID, filename: filename, description: description}, wtvHash))
            video.save((err) => {
              if(err){
                return callback(err)
              }
              else{
                callback()
              }
            })
          }
          else {
            video = new Video({ userID: userID, filename: filename, name: name, fileType: extension, description: description })
            video.save((err) => {
              if(err){
                return callback(err)
              }
              else{
                callback()
              }
            })
          }
        }
      })
    }
    else if(file.originalname.match(/\.(flv|mp4|webm)$/)){
      const videoParser = new Parser
      const videoHash = videoParser.parseVideoString(file.originalname)

      if(Object.keys(videoHash).length !== 0) {
        video = new Video(Object.assign({userID: userID, filename: filename}, videoHash))
        video.save((err) => {
          if(err) {
            return callback(err)
          }
          else {
            callback('reload')
          }
        })
      }
      else {
        video = new Video({userID: userID, filename: filename, name: name, fileType: extension})
        video.save((err) => {
          if(err) {
            return callback(err)
          }
          else {
            callback()
          }
        })
      }
    }
    else if(file.originalname.match(/\.(jpg|jpeg|png|gif|bmp)$/)){
      const dimensions = sizeOf(filePath)
      const resolution = dimensions.width + 'x' + dimensions.height
      const photoParser = new Parser
      const photoHash = photoParser.parsePhotoString(file.originalname)

      if (Object.keys(photoHash).length !== 0) {
        photo = new Photo(Object.assign({
          userID: userID,
          filename: filename,
          resolution: resolution
        }, photoHash))
        photo.save(function (err) {
          if(err){
            return callback(err)
          }
          else{
            callback('reload')
          }
        })
      }
      else {
        photo = new Photo({ userID: userID, name: name, filename: filename, resolution: resolution, fileType: extension})
        photo.save(function (err) {
          if(err){
            return callback(err)
          }
          else{
            callback()
          }
        })
      }
    }
    else if(file.originalname.match(/\.(mp3|wav|ogg|aac)$/)){
      const audioParser = new Parser
      const audioHash = audioParser.parseAudioString(file.originalname)

      if (Object.keys(audioHash).length !== 0){
        audio = new Audio(Object.assign({userID: userID, filename: filename}, audioHash))
        audio.save((err) => {
          if(err){
            return callback(err)
          }
          else{
            callback()
          }
        })
      }
      else {
        mm(fs.createReadStream(filePath), (err, metadata) => {
          audio = new Audio({userID: userID, filename: filename, name: name, fileType: extension, artist: metadata.artist[0], album: metadata.album[0]})
          audio.save((err) => {
            if(err){
              return callback(err)
            }
            else{
              callback()
            }
          })
        })
      }
    }
    else {
      entry = new Entry({userID: userID, name: name, fileType: extension, filename: filename})
      entry.save((err) => {
        if(err){
          return callback(err)
        }
        else{
          callback()
        }
      })
    }
  }, err => {
    if(err){
      if(err === 'reload') {
        res.json({success: true, reload: true})
      }
      else {
        res.json({success: false, error: 'Some files could not be uploaded due to non-unique filenames'})
      }
    }
    else{
      res.json({success: true, reload: false})
    }
  })
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

app.delete('/delete/file', (req, res) => {
  const filePath = path.join(__dirname, '/uploads/' + req.body.filename)
  const objectID = req.body.objectID
  const filename = req.body.filename
  const userID = jwt.decode(req.body.jwt, 'secret').user._id

  Entry.remove({userID: userID, _id: objectID, filename: filename}, (err) => {
    if(err){
      res.json({ status: 500, error: err })
    }
    else{
      Entry.find({userID: userID, filename: filename}, (error, entries) => {
        if(error) {
          res.json({ status: 500, error: error })
        }
        else {
          if(entries.length === 0) {
            fs.unlink(filePath, (deleteError) => {
              if(deleteError){
                res.json({ status: 500, error: deleteError })
              }
              else {
                res.json({ status: 200 })
              }
            })
          }
          else {
            res.json({ status: 200 })
          }
        }
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
  const type = req.body.type
  const query = (type === undefined || type === 'All') ? Entry.find({userID: userID}) : Entry.find({userID: userID, type: type})

  query.sort('created_at').exec((err, entries) => {
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

  Diary.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, eventType: true, description: true}, (err, entries) => {
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

  Photo.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, {name: true, filename: true, location: true, occasion: true, _id: false}, (err, entries) => {
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

  Audio.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}}, (err, entries) => {
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

  Video.find({userID: userID, created_at: { $gte: dateObject, $lt: nextDay}},
    {name: true, actor: true, description: true, channel: true, duration: true, filename: true, _id: false}, (err, entries) => {
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
