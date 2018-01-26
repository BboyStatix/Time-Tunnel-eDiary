const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entrySchema = new Schema({
  userID: { type: String, required: true },
  filename: { type: String, required: true },
  name: { type: String, required: true }
},
{
  timestamps: { createdAt: 'created_at' },
  discriminatorKey: 'type'
})

const Entry = mongoose.model('entry', entrySchema)
module.exports = Entry
