'use strict';
var request = require('request'); // require request
var assert = require('assert');
var async = require('async');
//var Log = require('../../models/log').Log;
//var SimpleLog = require('../../models/log').SimpleLog;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var SimpleLog = require('../../models/log');
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
mongoose.connect(url);
var db = mongoose.connection;

// var simpleLogSchema = new mongoose.Schema({
// 	rawLogsURL : String
// });

db.on('error', console.error);
db.once('open', function() {

	console.log("connection open");

	// Log.findOne({ rawLogsURL : "www.fakeurl.com"}, function (err, result) {
	// 	console.log("mongodb query returned!");
	// 	if (err) console.log(err);
	// 	console.log(JSON.stringify(result, null, 4));
	// 	db.close();
	// });

	var toStore = new SimpleLog({rawLogsURL : "www.fakeurl.com"});
	console.log(toStore);
	// toStore.save(function(err, result){
	// 	if(err) console.log(err);
	// 	console.log("Inserted Document: " + JSON.stringify(result));
	// 	db.close();
	//
	// 	// Log.findOne({ rawLogsURL : "www.fakeurl.com"}, function (err, result) {
	// 	// 	console.log("mongodb query returned!");
	// 	// 	if (err) console.log(err);
	// 	// 	console.log(JSON.stringify(result, null, 4));
	// 	// 	db.close();
	// 	// });
	//
	// });
	toStore.save().then(function(doc){
		console.log("Inserted Document: " + JSON.stringify(doc));
		db.close();
	});

});
//
// var time = "14:42:36.76";
// var fullDate = "2016/07/28" + 'T' + time.substring(0, 8);
// var fullDateDashes = new Date(fullDate.replace(/\//g, "-"));
// console.log(fullDateDashes)
