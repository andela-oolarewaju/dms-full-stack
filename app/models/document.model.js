// get dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Document', documentSchema);
