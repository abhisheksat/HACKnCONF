var mongoose = require('mongoose');
var Userprofile = require('./../utilities/Userprofile.model');
var Connection = require('./../models/Connection.model');

var conns = require('../utilities/newConnectionDB');

//  Get user profiles from the DB for given userId
const getUserProfiles = (userId) => {

  return Userprofile.find({})
  .exec()
  .then((userProfile) => {

    for (var i = 0; i < userProfile.length; i++) {
      if (userId == userProfile[i].userId) {

        var UserProfileModel = require('./../utilities/UserProfile');
        UserProfileModel = UserProfileModel.userProfile();
        UserProfileModel.userId = userProfile[i].userId;
        UserProfileModel.userConnectionsList = userProfile[i].userConnectionsList;
        return UserProfileModel;
      }
    }
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
};

//  Check if a conenction exists for given userId profile
const checkIfConnectionExists = (connId, userId) => {

  return Userprofile.find({userId: userId})
  .exec()
  .then((userProfile) => {

    var requiredProfile = userProfile[0];
    for (var i = 0; i < requiredProfile.userConnectionsList.length; i++) {
      if (connId === requiredProfile.userConnectionsList[i].connectionID) {
        return true;
      }
    }
    return false;
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
};

//  Update the RSVP value for the given connection in a given userId profile
const updateRSVP = (connId, newRSVP, userId, callback) => {

  if (newRSVP == 'No') {
    Connection.find({connectionID: connId})
      .exec()
      .then((res) => {

        if (res[0].connectionID == connId && res[0].createdBy == userId) {
          Connection.findOneAndUpdate({connectionID: connId}, {$set:{status: "inactive"}})
          .exec()
          .then((res) => {
            console.log("Updated Connection : " + res);
          });
        }
      });
  } else {
    Connection.findOneAndUpdate({connectionID: connId}, {$set:{status: "active"}})
    .exec()
    .then((res) => {
      console.log("Updated Connection : " + res);
    });
  }

  Userprofile.findOneAndUpdate({userId: userId, "userConnectionsList.connectionID": connId}, {"userConnectionsList.$.going" : newRSVP})
  .exec()
  .then((prof) => {
    callback();
  })
  .catch((err) => {
    console.log("Error : " + err);
    callback();
  });
};

//  Delete from the userProfile is requested by the guest
const deleteConnection = (connId, userId, callback) => {

  Userprofile.find({userId: userId})
  .exec()
  .then((res) => {

    var UserProfileModel = require('./../utilities/UserProfile');
    UserProfileModel = UserProfileModel.userProfileWId();
    UserProfileModel._id = res[0]._id;
    UserProfileModel.userId = res[0].userId;
    UserProfileModel.userConnectionsList = res[0].userConnectionsList;

    for (var i = 0; i < UserProfileModel.userConnectionsList.length; i++) {
      if (connId === UserProfileModel.userConnectionsList[i].connectionID) {
        Userprofile.findOne({_id: UserProfileModel._id}, function(err, result) {
          for (var j = 0; j < result.userConnectionsList.length; j++) {
            if (connId === result.userConnectionsList[j].connectionID) {
              result.userConnectionsList[j].remove();
              result.save();
            }
          }
          callback();
        });
      }
    }
  });
};

//  Add new connection to the profile with the given RSVP response
const addNew = (connId, newRSVP, userId, callback) => {

  var result = conns.getAllConnections();
  result.then(function (data) {
    for (var i = 0; i < data.length; i++) {
      if (connId === data[i].connectionID) {
        var userConnection = require('../models/userConnection');
        userConnection = userConnection.savedConnection(
          data[i].connectionID,
          data[i].connectionName,
          data[i].connectionTopic,
          newRSVP);
          break;
        }
      }

      Userprofile.find({userId: userId})
      .exec()
      .then((res) => {

        var UserProfileModel = require('./../utilities/UserProfile');
        UserProfileModel = UserProfileModel.userProfileWId();
        UserProfileModel._id = res[0]._id;
        UserProfileModel.userId = res[0].userId;
        UserProfileModel.userConnectionsList = res[0].userConnectionsList;

        Userprofile.findOneAndUpdate({_id: UserProfileModel._id}, {$push: {"userConnectionsList":{
          "connectionID": userConnection.connectionID,
          "connectionName": userConnection.connectionName,
          "connectionTopic": userConnection.connectionTopic,
          "going": userConnection.going
        }}})
        .exec()
        .then((res) => {
          callback();
        })
        .catch((err) => {
          console.log("Error : " + err);
        });
      });
    });
  };

//  Add a new connection to the main userConnectionsList
//  Add this with RSVP Yes to the profile of the user who created it
const addNewConnection = (newConnection, userId, callback) => {

  var start = newConnection.startDate + " | " + newConnection.startTime + " EST";
  var end = newConnection.endDate + " | " + newConnection.endTime + " EST";
  var connection = new Connection({
    _id: mongoose.Types.ObjectId(),
    connectionID: newConnection.connectionID,
    connectionName: newConnection.connectionName,
    connectionTopic: newConnection.connectionTopic,
    details: newConnection.details,
    startDate: start,
    endDate: end,
    location: newConnection.location,
    hostedby: newConnection.hostedby,
    photoUrl: newConnection.photoUrl,
    createdBy: userId,
    status: 'active'
  });

  connection.save(function(err, result) {
    if (err) {
      console.log("Error : " + err);
    } else {
      addNew(newConnection.connectionID, 'Yes', userId, callback);
    }
  });
};

//  Check if a user Profile is available
const checkIfProfileExists = (userId) => {
  return Userprofile.find({userId: userId})
  .exec()
  .then((userProfile) => {

    if (userProfile.length > 0) {
      console.log("Profile exists");
      return true;
    } else {
      console.log("Profile does not exists");
      return false;
    }
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
};

//  Create a user profile when a user logs in for the first time
const createUserProfile = (userId) => {
  var userProfile = new Userprofile({
    userId: userId,
    userConnectionsList: new Array()
  });
  userProfile.save(function (err, result) {
    if (err) {
      console.log("Error : " + err);
    } else {
      console.log("Created Profile : " + JSON.stringify(result));
    }
  })
};

  exports.getUserProfiles = getUserProfiles;
  exports.checkIfConnectionExists = checkIfConnectionExists;
  exports.updateRSVP = updateRSVP;
  exports.deleteConnection = deleteConnection;
  exports.addNew = addNew;
  exports.addNewConnection = addNewConnection;
  exports.checkIfProfileExists = checkIfProfileExists;
  exports.createUserProfile = createUserProfile;
