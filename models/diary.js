const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const diarySchema = new Schema({
  description: {type: String, default: ''},
  eventType: {type: String, default: ''}
},
{
  discriminatorKey: 'type'
})

const Diary = Entry.discriminator('Diary', diarySchema)
module.exports = Diary
