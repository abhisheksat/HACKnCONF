//  Network Based Application Development - ITIS 5166
//  @Author - Abhishek Satpute | MS CS | Spring 2020
//  File: app.js

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();

var mongoose = require('mongoose');

var db = 'mongodb://localhost:27017/nbadconnections';

mongoose.Promise = global.Promise;
mongoose.connect(db);

//  set the view / template enginer to ejs
app.set('view engine', 'ejs');

//  static middleware for serving static files
app.use('/assets', express.static('assets'));

app.use(favicon(path.join(__dirname, 'assets/images', 'logo.jpg')));

//  register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//  register express-session with its secret id
app.use(session({secret: 'sessionsecret', saveUninitialized: true, resave: true}));

//  Handler for / request mapping. Associated routes in connectionRouter will be invoked
var connectionRouter = require('./routes/controller.js');
app.use('/', connectionRouter);

//  Handler for / request mapping. Associated routes in profileRouter will be invoked
var profileRouter = require('./routes/profileController.js');
app.use('/', profileRouter);

//  listen HTTP on 8084
app.listen(8084);
