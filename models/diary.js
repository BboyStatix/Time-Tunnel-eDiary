const mongoose = require('mongoose')
const Schema = mongoose.Schema

const diarySchema = new Schema({
  userID: { type: String, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true }
},
{
  timestamps: { createdAt: 'created_at' }
})

const Diary = mongoose.model('diary', diarySchema)
module.exports = Diary
