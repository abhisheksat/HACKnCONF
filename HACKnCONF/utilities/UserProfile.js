var userId, userConnectionsList;

//  Initialize a userProfile on login
var userProfile = function() {
  var userProfileModel = {
      userId: null,
      userConnectionsList: null
  };
  return userProfileModel;
};

var userProfileWId = function() {
  var userProfileModel = {
      _id: null,
      userId: null,
      userConnectionsList: null
  };
  return userProfileModel;
};

const setUserId = (uId) => {
  userId = uId;
};

const setUserConnectionList = (connList) => {
  userConnectionsList = connList;
};

const getUserId = () => {
  return userId;
};

const getUserConnectionList = () => {
  return userConnectionsList;
};

//  Add a selected connection RSVP to http session
const addConnection = (connectionRef, sessionRef) => {
  sessionRef.userProfile.userConnectionsList.push(connectionRef);
};

//  Check if a selected connection is already present in http session
const checkIfConnectionExists = (connId, sessionRef) => {
  var flag = false;
  for (var i = 0; i < sessionRef.userProfile.userConnectionsList.length; i++) {
    if (connId === sessionRef.userProfile.userConnectionsList[i].connectionID) {
      flag = true;
    }
  }
  return flag;
};

//  Update RSVP for a specific connection. Use connectionID and profile data in session
const updateRSVP = (connId, newRSVP, sessionRef) => {
  for (var i = 0; i < sessionRef.userProfile.userConnectionsList.length; i++) {
    if (connId === sessionRef.userProfile.userConnectionsList[i].connectionID) {
      sessionRef.userProfile.userConnectionsList[i].going = newRSVP;
      return true;
    }
  }
  return false;
};

//  Delete RSVP for a specific connection. Connection should exist in session before delete attempt
const deleteRSVP = (connId, sessionRef) => {
  for (var i = 0; i < sessionRef.userProfile.userConnectionsList.length; i++) {
    if (connId === sessionRef.userProfile.userConnectionsList[i].connectionID) {
      sessionRef.userProfile.userConnectionsList.splice(i, 1);
      return true;
    }
  }
  return false;
};

//  Get list of savedConnections from the userProfile
const getUserConnections = (sessionRef) => {
    var userConnections = new Array();
    for (var i = 0; i < sessionRef.userProfile.userConnectionsList.length; i++) {
        var userConnectionModel = require('./../models/userConnection');
        userConnectionModel = userConnectionModel.savedConnection(sessionRef.userProfile.userConnectionsList[i].connectionID,
            sessionRef.userProfile.userConnectionsList[i].connectionName,
            sessionRef.userProfile.userConnectionsList[i].connectionTopic,
            sessionRef.userProfile.userConnectionsList[i].going);

        userConnections.push(userConnectionModel);
    }

    return userConnections;
};

exports.setUserId = setUserId;
exports.setUserConnectionList = setUserConnectionList;

exports.getUserId = getUserId;
exports.getUserConnectionList = getUserConnectionList;

exports.addConnection = addConnection;
exports.updateRSVP = updateRSVP;
exports.deleteRSVP = deleteRSVP;
exports.checkIfConnectionExists = checkIfConnectionExists;
exports.getUserConnections = getUserConnections;

module.exports.userProfile = userProfile;
module.exports.userProfileWId = userProfileWId;
