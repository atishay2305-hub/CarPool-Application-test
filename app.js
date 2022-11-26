var compression = require('compression');
var express = require('express');
var app = express();

app.use(compression());

// view engine setup
app.set('views', __dirname + '/app_server/views');
app.set('view engine', 'ejs');
app.set('view cache', true);

app.use("/public", express.static(__dirname + '/public'));

require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var studentid = require('studentid');
var flash    = require('connect-flash');
var logger = require('morgan');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configDB = require('./config/db');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./config/studentid').setupstudentid(studentid);
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(studentid.initialize());
app.use(studentid.session()); 
app.use(flash()); 

require('./routes')(app, studentid);

module.exports = app;