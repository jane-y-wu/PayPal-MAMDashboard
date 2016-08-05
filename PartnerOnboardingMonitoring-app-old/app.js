'use strict';

// Initialize library moudule 
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

// set app level configurations
app.set('port', process.env.PORT || 8003);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development environment tweaks go here
if ('development' === app.get('env')) {
	app.use(errorHandler());
	app.locals.pretty = true;
}

// configure all the routes mentioned in routes/index.js
require('./routes')(app);

// Start the server
http.createServer(app).listen(app.get('port'), function onListening() {
	console.log('Express server listening on port ' + app.get('port'));
});
