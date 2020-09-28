'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserconnectionSchema = new Schema({
  connectionID: String,
  connectionName: String,
  connectionTopic: String,
  going: String
}, {_id: true});

var UserprofileSchema = new Schema({

  userId: {
    type: String,
    required: true
  },
  userConnectionsList: {
    type: [UserconnectionSchema],
    required: true
  }

});

module.exports = mongoose.model('Userprofile', UserprofileSchema);
