//  Network Based Application Development - ITIS 5166
//  @Author - Abhishek Satpute | MS CS | Spring 2020
//  File: routes/controller.js
//      This file defines controller for routing and request handling

var express = require('express');
var router = express.Router();

var userdb = require('../utilities/UserDB');
var userProf = require('../utilities/UserProfileDB');
var conns = require('../utilities/newConnectionDB');
var profileDB = require('../utilities/UserProfileDB');

var bodyParser = require('body-parser');

var profile = require('../utilities/UserProfile');

var Connection = require('./../models/Connection.model');

var urlencodedParser = bodyParser.urlencoded({extended:true});
const {check, validationResult} = require('express-validator');

//  GET | '/' | display index page
router.get('/', function(request, response) {
  console.log("controller.js | / | display index page");
  response.render('index', { layout: false, test: request.session });
});

//  GET | '/index' | display index page
router.get('/index', function(request, response) {
  console.log("controller.js | /index | display index page");
  response.render('index', { layout: false, test: request.session });
});

//  GET | '/about' | display about page, login not required
router.get('/about', function(request, response) {
  console.log("controller.js | /about | display about page");
  response.render('about', { layout: false, test: request.session });
});

//  GET | '/contact' | display contact page, login not required
router.get('/contact', function(request, response) {
  console.log("controller.js | /contact | display contact page");
  response.render('contact', { layout: false, test: request.session });
});

//  GET | '/newConnection' | display newConnection page, login not required
router.get('/newConnection', function(request, response) {
  console.log("controller.js | /newConnection | display newConnection page");
  if (request.session.userData) {
    response.render('newConnection', { layout: false, test: request.session, errors: null, formDetails: null });
  } else {
    response.redirect('/login?redirectUrl=' + request.url);
  }
});

//  GET | '/login' | display login page when not loggedIn, else display savedConnections
router.get('/login', function(request, response) {
  console.log("controller.js | /login | display login page");
  //  When loggedIn, user should not see login page when attempted by typing URL pattern
  if (request.session.userData) {
    console.log("controller.js | /login | user already loggedIn, redirecting to savedConnections");
    response.redirect('/savedConnections');
  } else {
    var redirectUrl = request.query.redirectUrl;
    if (redirectUrl) {
      response.render('login', { layout: false, test: request.session, redirectUrl: redirectUrl, errorMsg: null, fieldErrors: null });
    } else {
      response.render('login', { layout: false, test: request.session, redirectUrl: null, errorMsg: null, fieldErrors: null });
    }
  }
});

//  GET | '/logout' | logout the user from the session. All user and profile data is destroyed
router.get('/logout', function(request, response) {
  console.log("controller.js | /logout | logout user from session, destroy userProfile data");
  request.session.destroy(function(err) {
    if(err) {
      response.negotiate(err);
    }
    response.redirect('/');
  });
});

//  GET | '/connections' | display connections page, does not require login
router.get('/connections', function(request, response) {
  console.log("controller.js | /connections | display connections page, connection data from db");
  var result = conns.getAllConnections();
  result.then(function (data) {
    var topicsResult = conns.getConnectionTopics();
    topicsResult.then(function (connectionTopics) {
      response.status(200).render('connections', { connections : data, layout: false, test: request.session, connectionTopics: connectionTopics});
    });
  });
});


//  GET | '/savedConnections' | display savedConnections, login required. Redirected to login if not loggedIn
router.get('/savedConnections', function(request, response) {
  
  console.log("controller.js | /savedConnections | display savedConnections page");
  
  if (request.session.userData) {
    
    console.log("controller.js | /savedConnections | user is loggedIn");
    
    var result = userProf.getUserProfiles(request.session.userData.userId);
    
    result.then(function (profiles) {
      
      if (profiles == null || profiles == undefined || profiles.length <= 0) {
        console.log("controller.js | /savedConnections | no savedConnections data in session to display");
        response.render('savedConnections', { savedConnectionsData : null, layout: false, test: request.session });
      } else {
        
        var data = new Array();
        for (var i = 0; i < profiles.userConnectionsList.length; i++) {
          var userConnectionModel = require('./../models/userConnection');
          userConnectionModel = userConnectionModel.savedConnection(
            profiles.userConnectionsList[i].connectionID,
            profiles.userConnectionsList[i].connectionName,
            profiles.userConnectionsList[i].connectionTopic,
            profiles.userConnectionsList[i].going);
            
            data.push(userConnectionModel);
          }
          
          var result = conns.getAllConnections();
          result.then(function (allConnections) {
            
            var createdConnections = new Array();
            var savedConnections = new Array();
            
            if (allConnections.length > 0) {
              for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < allConnections.length; j++) {
                  if (data[i].connectionID == allConnections[j].connectionID) {
                    if (allConnections[j].createdBy == request.session.userData.userId) {
                      var userConnectionModel = require('./../models/userConnection');
                      userConnectionModel = userConnectionModel.savedConnection(
                        data[i].connectionID,
                        data[i].connectionName,
                        data[i].connectionTopic,
                        data[i].going);
                        createdConnections.push(userConnectionModel);
                        console.log("Created : " + JSON.stringify(data[i]));
                      } else {
                        var userConnectionModel = require('./../models/userConnection');
                        userConnectionModel = userConnectionModel.savedConnection(
                          data[i].connectionID,
                          data[i].connectionName,
                          data[i].connectionTopic,
                          data[i].going);
                          savedConnections.push(userConnectionModel);
                          console.log("Saved : " + JSON.stringify(data[i]));
                        }
                      }
                    }
                  }
                }
                console.log("controller.js | /savedConnections | displaying savedConnections page with data from userProfile in session");
                response.render('savedConnections', { allConnections: allConnections, createdConnections: createdConnections, savedConnectionsData: savedConnections, layout: false, test: request.session });
              });
            }
          });
        } else {
          console.log("controller.js | /savedConnections | user login required, redirecting to /login");
          response.redirect('/login?redirectUrl='+request.url);
        }
      });
      
      //  GET | '/connection/:connId' | display a specific connection using connectionID, login not required
      router.get('/connection/:connId', function(request, response) {
        
        console.log("controller.js | /connection/"+request.params.connId+" | display connection with connId : "+request.params.connId);
        
        var result = conns.getConnection(request.params.connId);
        
        result.then(function (data) {
          if (data == null || data == undefined) {
            console.log("controller.js | /connection/"+request.params.connId+" | data not found for connId : "+request.params.connId);
            response.redirect('/connections');
          } else {
            console.log("controller.js | /connection/"+request.params.connId+" | data found for connId : "+request.params.connId);
            response.render('connection', { connection : data, layout: false, test: request.session });
          }
        });
      });
      
      
      //  POST | '/login' | Login the user, create userSession with hardcoded data
      router.post('/login', urlencodedParser, [
        check('email')
          .trim()
          .isAlphanumeric()
          .withMessage('UserId must be alphanumeric. ')
          .not()
          .isEmpty()
          .withMessage('UserId field cannot be left blank. ')
          .escape(),
        check('pwd')
          .trim()
          .not()
          .isEmpty()
          .withMessage('Password field cannot be left blank. ')
          .escape()
      ], function(request, response) {
        
        console.log("controller.js | /login | process user login attempt");
        
        const errors = validationResult(request);

        if ((request.body.email !== undefined)
        && (request.body.pwd !== undefined)
        && (request.body.email !== null)
        && (request.body.pwd !== null)
        && (request.body.email !== '')
        && (request.body.pwd !== '')) {
          
          console.log("controller.js | /login | user credentials received, creating a dummy user");
          
          var userForSession = userdb.getUserForSession(request.body.email, request.body.pwd);
          
          userForSession.then(function (sessionUser) {
            
            if (sessionUser) {
              
              userForSession.then(function (user) {
                
                request.session.userData = user;
                
                var isProfile = profileDB.checkIfProfileExists(request.session.userData.userId);
                isProfile.then((ch) => {
                  if (ch) {
                    console.log("We will not create a profile");
                  } else {
                    console.log("We will create a profile");
                    var created = profileDB.createUserProfile(request.session.userData.userId);
                    created.then((result) => {
                      console.log("New Profile Created");
                    });
                  }
                });
                
                if (request.body.redirectUrl) {
                  response.redirect(request.body.redirectUrl);
                } else {
                  response.redirect('/savedConnections');
                }
              });
            } else {
              console.log("The userForSession is null.");
              response.render('login', { layout: false, test: request.session, redirectUrl: null, errorMsg: "UserId or Password is incorrect.", fieldErrors: null });
            }
          });
        } else {
          console.log("controller.js | /login | emailAddress or password is invalid/empty, redirecting to login");
          
          if (!errors.isEmpty()) {
            console.log("Errors : " + JSON.stringify(errors));
            return response.render('login', { layout: false, test: request.session, redirectUrl: null, errorMsg: null, fieldErrors: errors.array() });
          } else {
            response.redirect('/login');
          }
        }
      });
      
      //  Generate ID for a new Conference
      router.get('/conn', function (request, response) {
        Connection.find({}, {connectionID: 1, _id: 0}).sort({connectionID: -1})
        .exec()
        .then((connection) => {
          if (connection.length > 0) {
            var currentId = connection[0].connectionID;
            var strlen = currentId.length;
            var id = parseInt(currentId.substring(4, strlen)) + 1;
            response.status(200).end("CONN"+id);
          } else {
            response.status(200).end("CONN"+10001);
          }
        })
        .catch((err) => {
          console.log("Error : " + err);
        });
      });
      
      //  Add a new connection with loggedIn user as createdBy host
      router.post('/addNewConnection', urlencodedParser, 
      [
        check('connectionID')
        .trim()
        .isAlphanumeric()
        .withMessage('Must contain only alphabets and numbers. ')
        .escape(),
        check('connectionName')
        .trim()
        .custom((value, {req}) => {
          if(isNaN(value)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Connection name should contain atleast 5 characters. ')
        .escape(),
        check('connectionTopic')
        .trim()
        .custom((value, {req}) => {
          if(isNaN(value)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Connection topic should contain atleast 5 characters. ')
        .escape(),
        check('details')
        .trim()
        .custom((value, {req}) => {
          if(isNaN(value)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Connection details should contain atleast 5 characters. ')
        .escape(),
        check('startDate')
        .trim()
        .custom((startDt, {req}) => {
          
          var st = Date.parse(startDt + ' ' + req.body.startTime);
          
          var date = new Date();
          date.setDate(date.getDate() + 3);
          date.setHours(00);
          date.setMinutes(00);
          date.setSeconds(00);
          
          var dt = Date.parse(date);
          
          if(dt < st) {
            console.log("The date is greater than current date");
            return true;
          } else {
            throw new Error('Start date must be atleast 3 days from the current date. ')
          }
        })
        .escape(),
        check('endDate')
        .trim()
        .custom((endDt, {req}) => {
          
          var st = Date.parse(req.body.startDate + ' ' + req.body.startTime);
          
          var date = Date.parse(endDt + ' ' + req.body.endTime);
          
          if(st < date) {
            return true;
          } else {
            throw new Error('End date must be equal or after the current date. ')
          }
        })
        .escape(),
        check('startTime')
        .trim()
        .custom((sTime, {req}) => {
          
          var st = Date.parse(req.body.startDate + ' ' + sTime);
          
          var date = Date.parse(req.body.endDate + ' ' + req.body.endTime);
          
          if(date <= st) {
            throw new Error('Start time must be before the end time. ')
          } else {
            return true;
          }
        })
        .escape(),
        check('endTime')
        .trim()
        .custom((eTime, {req}) => {
          
          var st = Date.parse(req.body.startDate + ' ' + req.body.startTime);
          
          var date = Date.parse(req.body.endDate + ' ' + eTime);
          
          if(date <= st) {
            throw new Error('End time must be after the start time. ')
          } else {
            return true;
          }
        })
        .escape(),
        check('location')
        .trim()
        .custom((loc, {req}) => {
          if(isNaN(loc)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Location details should be atleast 5 characters long. ')
        .escape(),
        check('hostedby')
        .trim()
        .custom((host, {req}) => {
          if(isNaN(host)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Hosted by details should be atleast 5 characters long. ')
        .escape(),
        check('photoUrl')
        .trim()
        .custom((photo, {req}) => {
          if(isNaN(photo)) {
            return true;
          } else {
            throw new Error('Must contain only alphabets and numbers. ');
          }
        })
        .isLength({ min: 5 })
        .withMessage('Photo url should be atleast 5 characters long. ')
        .escape(),
      ], function (request, response) {
        
        const errors = validationResult(request);
        
        if(!errors.isEmpty()) {
          console.log("Req body : " + JSON.stringify(request.body));
          var formDetails = request.body;
          return response.render('newConnection', { layout: false, test: request.session, errors: errors.array(), formDetails: formDetails });
        }
        
        if ((request.body.connectionID !== null)
        && (request.body.connectionID !== null)
        && (request.body.connectionName !== null)
        && (request.body.connectionTopic !== null)
        && (request.body.details !== null)
        && (request.body.startDate !== null)
        && (request.body.startTime !== null)
        && (request.body.endDate !== null)
        && (request.body.endTime !== null)
        && (request.body.location !== null)
        && (request.body.hostedby !== null)
        && (request.body.photoUrl !== null)
        && (request.body.connectionID !== undefined)
        && (request.body.connectionID !== undefined)
        && (request.body.connectionName !== undefined)
        && (request.body.connectionTopic !== undefined)
        && (request.body.details !== undefined)
        && (request.body.startDate !== undefined)
        && (request.body.startTime !== undefined)
        && (request.body.endDate !== undefined)
        && (request.body.endTime !== undefined)
        && (request.body.location !== undefined)
        && (request.body.hostedby !== undefined)
        && (request.body.photoUrl !== undefined)
        && (request.body.connectionID !== '')
        && (request.body.connectionID !== '')
        && (request.body.connectionName !== '')
        && (request.body.connectionTopic !== '')
        && (request.body.details !== '')
        && (request.body.startDate !== '')
        && (request.body.startTime !== '')
        && (request.body.endDate !== '')
        && (request.body.endTime !== '')
        && (request.body.location !== '')
        && (request.body.hostedby !== '')
        && (request.body.photoUrl !== '')) {
          
          profileDB.addNewConnection(request.body, request.session.userData.userId, function() {
            response.redirect('/savedConnections');
          });
        } else {
          response.redirect('/newConnection');
        }
      });
      
      
      //  All invalid URL mappings to be sent to 404 page
      router.get('/*', function(request, response) {
        console.log("controller.js | "+request.url+" | the request url is invalid, redirecting to 404");
        response.render('404', { layout: false, test: request.session });
      });
      
      module.exports = router;
      