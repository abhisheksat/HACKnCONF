'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({

  _id: {
    type: Schema.ObjectId,
    required: true
  },
  connectionID: {
    type: String,
    required: true
  },
  connectionName: {
    type: String,
    required: true
  },
  connectionTopic: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  hostedby: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Connection', ConnectionSchema);
