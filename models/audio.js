const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const audioSchema = new Schema({
  artist: { type: String }
},
{
  discriminatorKey: 'type'
})

const Audio = Entry.discriminator('Audio', audioSchema)
module.exports = Audio
