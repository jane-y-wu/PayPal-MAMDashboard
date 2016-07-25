'use strict';
var request = require('request'); // require request
var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';
//var url = 'mongodb://localhost:12345/';
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var async = require('async');
var Log = require('../../models/log').Log;

mongoose.connect(url);
db.on('error', console.error);
db.once('open', function() {

	Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
		console.log("mongodb query returned!");
		if (err) console.log(err);
		console.log(JSON.stringify(result, null, 4));
		db.close();
	});

});