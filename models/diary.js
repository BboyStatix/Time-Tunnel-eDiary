const mongoose = require('mongoose')
const Schema = mongoose.Schema

const diarySchema = new Schema({
  userID: { type: String, required: true, unique: true },
  data: { type: String, required: true }
})

const Diary = mongoose.model('diary', diarySchema)
module.exports = Diary
