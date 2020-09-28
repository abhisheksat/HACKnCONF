var Userconnection = require('./../models/Userconnection.model');
var Connection = require('./../models/Connection.model');

//  Get All Connections
const getAllConnections = () => {

  return Connection.find({})
    .exec()
    .then((connection) => {

      var returnData = new Array();
      for (var i = 0; i < connection.length; i++) {
        var connectionModel = require('../models/connection');
        connectionModel = connectionModel.connection(
          connection[i]._id,
          connection[i].connectionID,
          connection[i].connectionName,
          connection[i].connectionTopic,
          connection[i].details,
          connection[i].startDate,
          connection[i].endDate,
          connection[i].location,
          connection[i].hostedby,
          connection[i].photoUrl,
          connection[i].createdBy,
          connection[i].status);

        returnData.push(connectionModel);
      }

      return returnData;
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};

//  Get connection by connectionID
const getConnection = (connId) => {

  return Connection.find({connectionID: connId})
    .exec()
    .then((connection) => {

      var returnData = null;
      var connectionModel = require('../models/connection');
      connectionModel = connectionModel.connection(
        connection[0]._id,
        connection[0].connectionID,
        connection[0].connectionName,
        connection[0].connectionTopic,
        connection[0].details,
        connection[0].startDate,
        connection[0].endDate,
        connection[0].location,
        connection[0].hostedby,
        connection[0].photoUrl,
        connection[0].createdBy,
        connection[0].status);

      returnData = connectionModel;

      return returnData;
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};

//  Get all connections
const getConnections = () => {

  return Userconnection.find({})
    .exec()
    .then((userConnection) => {
      return userConnection;
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};

const getConnectionTopics = () => {

  return Connection.distinct('connectionTopic')
    .exec()
    .then((connectionTopics) => {
      console.log("Connection Topics are : " + connectionTopics);
      var returnConnections = new Array();
      for (var i = 0; i < connectionTopics.length; i++) {
        returnConnections.push(connectionTopics[i]);
      }
      return returnConnections;
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};

exports.getConnections = getConnections;
exports.getAllConnections = getAllConnections;
exports.getConnection = getConnection;
exports.getConnectionTopics = getConnectionTopics;
