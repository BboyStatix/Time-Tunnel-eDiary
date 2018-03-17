const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Entry = require('./entry')

const audioSchema = new Schema({
  artist: { type: String },
  album: { type: String },
  usChartDate: { type: String },
  usPeakPosition: { type: String },
  usPeakNumOfWeeks: { type: String},
  ukChartDate: { type: String },
  ukPeakPosition: { type: String },
  ukPeakNumOfWeeks: { type: String },
  information: { type: String }
},
{
  discriminatorKey: 'type'
})

const Audio = Entry.discriminator('Audio', audioSchema)
module.exports = Audio
