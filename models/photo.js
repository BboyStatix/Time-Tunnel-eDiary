const mongoose = require('mongoose')
const Schema = mongoose.Schema

const photoSchema = new Schema({
  userID: { type: String, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true }
},
{
  timestamps: { createdAt: 'created_at' }
})

const Photo = mongoose.model('photo', photoSchema)
module.exports = Photo
