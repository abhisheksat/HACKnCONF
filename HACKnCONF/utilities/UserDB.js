var crypto = require('crypto');

var User = require('./../models/User.model');

var sha512 = function(password, salt) {  
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var passwordHash = hash.digest('hex');
  return passwordHash;
};

function saltHashPassword(userpassword, saltValue) {
  var salt = saltValue;
  var passwordData = sha512(userpassword, salt);
  return passwordData;
}

//  Get Users
const getConnections = () => {
  
  return User.find({})
  .exec()
  .then((users) => {
    return users;
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
};

//  Get a user for adding to session, using provided credentials. UserId
const getUserForSession = (identifier, password) => {
  
  return User.find({$or:[{userId: identifier}, {emailAddress: identifier}]})
  .exec()
  .then(function (user) {

    if (user[0]) {
      
      var passwordData = saltHashPassword(password, user[0].salt);
      
      if (passwordData === user[0].password) {
        
        if (user.length > 0) {
          
          var loginUser = user[0];
          
          var userModel = require('./../models/user');
          
          userModel = userModel.user(loginUser.userId, loginUser.firstName, loginUser.lastName, loginUser.emailAddress, loginUser.addressLine1, loginUser.addressLine2, loginUser.city, loginUser.state, loginUser.zipcode, loginUser.country);
          
          return userModel;
        }

      } else {
        return null;
      }
    } else {
      return null;
    }
  });
};

exports.getConnections = getConnections;
exports.getUserForSession = getUserForSession;
