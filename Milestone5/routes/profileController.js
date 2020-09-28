var express = require('express');
var router = express.Router();

var profileDB = require('../utilities/UserProfileDB');

var profile = require('../utilities/UserProfile');

//  Delete a savedConnection from the userProfile stored in session
router.post('/delete', function(request, response) {

    console.log("profileController.js | /delete | process connection delete request");

    if(request.session.userData) {
        console.log("profileController.js | /delete | user session is valid");
        if(request.body.rsvpdelete === 'delete') {
            console.log("profileController.js | /delete | valid delete connection request detected");
            var flag = profileDB.checkIfConnectionExists(request.body.connId, request.session.userData.userId);
            flag.then(function (ch) {
                if (ch) {
                  profileDB.deleteConnection(request.body.connId, request.session.userData.userId, function () {
                    response.redirect('/savedConnections');
                  });
                } else {
                  response.redirect('/savedConnections');
                }
            });
        } else {
            console.log("profileController.js | /delete | delete connection request is invalid, redirecting to /savedConnections");
            response.redirect('/savedConnections');
        }
    } else {
        console.log("profileController.js | /delete | user session invalid, login required, redirecting to /login");
        response.redirect('/login');
    }
});

//  Process RSVP response. Update if already responded, add to profile if new
router.post('/rsvp', function(request, response) {

    console.log("profileController.js | /rsvp | process rsvp request");

    if(request.session.userData) {
        console.log("profileController.js | /rsvp | user session is valid");

        if ((request.body.rsvpaction === 'RSVP')
            && (request.body.rsvpvalue === 'Yes' ||
                request.body.rsvpvalue === 'No' ||
                request.body.rsvpvalue === 'Maybe')) {

            console.log("profileController.js | /rsvp | rsvp connection request detected");
            var flag = profileDB.checkIfConnectionExists(request.body.connId, request.session.userData.userId);
            flag.then(function (ch) {
                if (ch) {
                  console.log("profileController.js | /rsvp | connection already exists, updating RSVP value");
                  profileDB.updateRSVP(request.body.connId, request.body.rsvpvalue, request.session.userData.userId, function() {
                    response.redirect('/savedConnections');
                  });
                } else {
                  profileDB.addNew(request.body.connId, request.body.rsvpvalue, request.session.userData.userId, function() {
                    response.redirect('/savedConnections');
                  });
                }
            });
        } else {
            console.log("profileController.js | /rsvp | rsvp connection request is invalid, redirecting to /savedConnections");
            response.redirect('/savedConnections');
        }
    } else {
        console.log("profileController.js | /rsvp | user session invalid, login required, redirecting to /login");
        response.redirect('/login?redirectUrl=' + request.body.browserUrl);
    }
});

module.exports = router;
