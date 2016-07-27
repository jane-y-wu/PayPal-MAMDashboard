'use strict';
var request = require('request'); // require request
var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
//var url = 'mongodb://root:PQCtUUhZnbsmjbUH2C^QKYa3gnv7g2cDX^m9@partner-self-service-2-9367.ccg21.dev.paypalcorp.com:27017';
//var url = 'mongodb://localhost:12345/';
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var async = require('async');
var Log = require('../../models/log').Log;

mongoose.Promise = global.Promise;
mongoose.connect(url);
db.on('error', console.error);
db.once('open', function() {

	var toStore = new Log({rawLogsURL : "www.fakeurl.com"});
	toStore.save(function(err, result){
		if(err) console.log(err);
		console.log("Inserted Document: " + JSON.stringify(result));
		db.close();
	});

	// Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
	// 	console.log("mongodb query returned!");
	// 	if (err) console.log(err);
	// 	console.log(JSON.stringify(result, null, 4));
	// 	db.close();
	// });

});