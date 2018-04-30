const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entrySchema = new Schema({
  userID: { type: String, required: true },
  filename: { type: String, required: true },
  name: { type: String, required: true },
  fileType: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
},
{
  discriminatorKey: 'type'
})

entrySchema.index({ userID: 1, name: 1, fileType: 1 }, { unique: true });

const Entry = mongoose.model('entry', entrySchema)
module.exports = Entry
