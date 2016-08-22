'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var app = express();


app.set('port', process.env.PORT || 3003);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if ('development' === app.get('env')) {
// 	app.use(errorHandler);
// 	app.locals.pretty = true;
// }

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function onListening() {
	console.log('Express server listening on port ' + app.get('port'));
});

