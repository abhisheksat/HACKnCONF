'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserconnectionSchema = new Schema({

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
  going: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Userconnection', UserconnectionSchema);
