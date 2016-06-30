'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

if ('development' === app.get('env')) {
	app.use(express.errorHandler());
	app.locals.pretty = true;
}

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function onListening() {
	console.log('Express server listening on port ' + app.get('port'));
});
