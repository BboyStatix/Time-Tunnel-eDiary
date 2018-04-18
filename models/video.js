const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const videoSchema = new Schema({
  description: { type: String, default: '' },
  channel: { type: String, default: '' },
  duration: { type: String, default: '' }
},
{
  discriminatorKey: 'type'
})

const Video = Entry.discriminator('Video', videoSchema)
module.exports = Video
