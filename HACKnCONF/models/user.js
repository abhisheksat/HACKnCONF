//  Network Based Application Development - ITIS 5166
//  @Author - Abhishek Satpute | MS CS | Spring 2020
//  File: models/user.js
//      This file defines model for user

var userId, firstName, lastName, emailAddress, addressLine1, addressLine2, city, state, zipcode, country;

var user = function (userId, firstName, lastName, emailAddress, addressLine1, addressLine2, city, state, zipcode, country) {
    var userModel = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        zipcode: zipcode,
        country: country
    };
    return userModel;
};

const setUserId = (uId) => {
  userId = uId;
};

const setFirstName = (fname) => {
  firstName = fname;
};

const setLastName = (lname) => {
  lastName = lname;
};

const setEmailAddress = (email) => {
  emailAddress = email;
};

const setAddressLine1 = (addr1) => {
  addressLine1 = addr1;
};

const setAddressLine2 = (addr2) => {
  addressLine2 = addr2;
};

const setCity = (ct) => {
  city = ct;
};

const setState = (st) => {
  state = st;
};

const setZipCode = (zip) => {
  zipcode = zip;
};

const setCountry = (cntry) => {
  country = cntry;
};

const getUserId = () => {
  return userId;
};

const getPassword = () => {
  return password;
};

const getSalt = () => {
  return salt;
};

const getFirstName = () => {
  return firstName;
};

const getLastName = () => {
  return lastName;
};

const getEmailAddress = () => {
  return emailAddress;
};

const getAddressLine1 = () => {
  return addressLine1;
};

const getAddressLine2 = () => {
  return addressLine2;
};

const getCity = () => {
  return city;
};

const getState = () => {
  return state;
};

const getZipCode = () => {
  return zipcode;
};

const getCountry = () => {
  return country;
};

exports.setUserId = setUserId;
exports.setFirstName = setFirstName;
exports.setLastName = setLastName;
exports.setEmailAddress = setEmailAddress;
exports.setAddressLine1 = setAddressLine1;
exports.setAddressLine2 = setAddressLine2;
exports.setCity = setCity;
exports.setState = setState;
exports.setZipCode = setZipCode;
exports.setCountry = setCountry;

exports.getUserId = getUserId;
exports.getFirstName = getFirstName;
exports.getLastName = getLastName;
exports.getEmailAddress = getEmailAddress;
exports.getAddressLine1 = getAddressLine1;
exports.getAddressLine2 = getAddressLine2;
exports.getCity = getCity;
exports.getState = getState;
exports.getZipCode = getZipCode;
exports.getCountry = getCountry;

module.exports.user = user;
