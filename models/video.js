const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = new Schema({
  userID: { type: String, required: true },
  filename: { type: String, required: true },
  name: { type: String, required: true }
},
{
  timestamps: { createdAt: 'created_at' }
})

const Video = mongoose.model('video', videoSchema)
module.exports = Video
