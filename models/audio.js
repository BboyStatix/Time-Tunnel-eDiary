const mongoose = require('mongoose')
const Schema = mongoose.Schema

const audioSchema = new Schema({
  userID: { type: String, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true },
  artist: { type: String }
},
{
  timestamps: { createdAt: 'created_at' }
})

const Audio = mongoose.model('audio', audioSchema)
module.exports = Audio
