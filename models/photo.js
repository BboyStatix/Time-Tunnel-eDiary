const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const photoSchema = new Schema({
  resolution: {type: String, default: ''},
  location: {type: String, default: ''},
  occasion: {type: String, default: ''},
  tags: [{
    type: String
  }]
},
{
  discriminatorKey: 'type'
})

const Photo = Entry.discriminator('Photo', photoSchema)
module.exports = Photo
