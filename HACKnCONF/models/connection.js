//  Network Based Application Development - ITIS 5166
//  @Author - Abhishek Satpute | MS CS | Spring 2020
//  File: models/connection.js
//      This file defines model for connection

var _id, connectionID, connectionName, connectionTopic, details, startDate, endDate, location, hostedby, photoUrl, createdBy, status;

var connection = function(_id, connectionID, connectionName, connectionTopic, details, startDate, endDate, location, hostedby, photoUrl, createdBy, status) {
    var connectionModel = {
        _id: _id,
        connectionID : connectionID,
        connectionName : connectionName,
        connectionTopic : connectionTopic,
        details : details,
        startDate : startDate,
        endDate : endDate,
        location : location,
        hostedby : hostedby,
        photoUrl : photoUrl,
        createdBy: createdBy,
        status: status
    };
    return connectionModel;
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

const setConnectionDetails = (connDetails) => {
  details = connDetails;
};

const setConnectionStartDate = (connStartDate) => {
  startDate = connStartDate;
};

const setConnectionEndDate = (connEndDate) => {
  endDate = connEndDate;
};

const setConnectionLocation = (connLocation) => {
  location = connLocation;
};

const setConnectionHostedBy = (connHostedBy) => {
  hostedby = connHostedBy;
};

const setConnectionPhotoUrl = (connPhotoUrl) => {
  photoUrl = connPhotoUrl;
};

const setCreatedBy = (connCreatedBy) => {
  createdBy = connCreatedBy;
};

const setStatus = (connStatus) => {
  status = connStatus;
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

const getConnectionDetails = () => {
  return details;
};

const getConnectionStartDate = () => {
  return startDate;
};

const getConnectionEndDate = () => {
  return endDate;
};

const getConnectionLocation = () => {
  return location;
};

const getConnectionHostedBy = () => {
  return hostedby;
};

const getConnectionPhotoUrl = () => {
  return photoUrl;
};

const getCreatedBy = () => {
  return createdBy;
};

const getStatus = () => {
  return status;
};

exports.setConnectionID = setConnectionID;
exports.setConnectionName = setConnectionName;
exports.setConnectionTopic = setConnectionTopic;
exports.setConnectionDetails = setConnectionDetails
exports.setConnectionStartDate = setConnectionStartDate;
exports.setConnectionEndDate = setConnectionEndDate;
exports.setConnectionLocation = setConnectionLocation;
exports.setConnectionHostedBy = setConnectionHostedBy;
exports.setConnectionPhotoUrl = setConnectionPhotoUrl;
exports.setCreatedBy = setCreatedBy;
exports.setStatus = setStatus;

exports.getConnectionID = getConnectionID;
exports.getConnectionName = getConnectionName;
exports.getConnectionTopic = getConnectionTopic;
exports.getConnectionDetails = getConnectionDetails;
exports.getConnectionStartDate = getConnectionStartDate;
exports.getConnectionEndDate = getConnectionEndDate;
exports.getConnectionLocation = getConnectionLocation;
exports.getConnectionHostedBy = getConnectionHostedBy;
exports.getConnectionPhotoUrl = getConnectionPhotoUrl;
exports.getCreatedBy = getCreatedBy;
exports.getStatus = getStatus;

module.exports.connection = connection;
