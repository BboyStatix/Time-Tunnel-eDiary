const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const diarySchema = new Schema({
  description: {type: String},
  eventType: {type: String},
  eventDate: {type: String}
},
{
  discriminatorKey: 'type'
})

const Diary = Entry.discriminator('Diary', diarySchema)
module.exports = Diary
