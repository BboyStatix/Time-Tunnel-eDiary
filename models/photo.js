const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const photoSchema = new Schema({},
{
  discriminatorKey: 'type'
})

const Photo = Entry.discriminator('Photo', photoSchema)
module.exports = Photo
