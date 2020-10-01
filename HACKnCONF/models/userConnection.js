//  Network Based Application Development - ITIS 5166
//  @Author - Abhishek Satpute | MS CS | Spring 2020
//  File: models/userConnection.js
//        This file defines model for userConnection. This is populated and saved in UserProfile userConnectionsList

var connectionID, connectionName, connectionTopic, going;

var savedConnection = function(connectionID, connectionName, connectionTopic, going) {
    var savedConnectionModel = {
        connectionID : connectionID,
        connectionName : connectionName,
        connectionTopic : connectionTopic,
        going : going
    };
    return savedConnectionModel;
};

const setConnectionID = (connID) => {
  connectionID = connID;
};

const setConnectionName = (connName) => {
  connectionName = connName;
};

const setConnectionTopic = (connTopic) => {
    connectionTopic = connTopic;
};

const setConnectionGoing = (goin) => {
    going = goin;
};

const getConnectionID = () => {
  return connectionID;
};

const getConnectionName = () => {
    return connectionName;
};

const getConnectionTopic = () => {
    return connectionTopic;
};

const getConnectionGoing = () => {
    return going;
};

exports.setConnectionID = setConnectionID;
exports.setConnectionName = setConnectionName;
exports.setConnectionTopic = setConnectionTopic;
exports.setConnectionGoing = setConnectionGoing;

exports.getConnectionID = getConnectionID;
exports.getConnectionName = getConnectionName;
exports.getConnectionTopic = getConnectionTopic;
exports.getConnectionGoing = getConnectionGoing;

module.exports.savedConnection = savedConnection;
