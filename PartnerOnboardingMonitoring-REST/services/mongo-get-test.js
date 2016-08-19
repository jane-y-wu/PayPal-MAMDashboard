'use strict';
var request = require('request'); // require request
var assert = require('assert');
var async = require('async');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// var url = 'mongodb://root:ej+yFtAR^mEjKB?6AhK7Xrm_prM?aK32Xx94@10.25.39.2:27017';
var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'});
var db = mongoose.connection;

// var simpleLogSchema = new mongoose.Schema({
// 	rawLogsURL : String
// });

var logSchema = new mongoose.Schema({
	rawLogsURL : String,
	// eventDetailURL: String,
	metaData : { // not all of this is necessary. is this just an echo of the search parameters?
		Machine : {type: String}, //*
		Pool : {type: String}, //*
		Data_Center : {type: String}, //*
	},
	payload: {
		Class : {type: String},
		//Timestamp : {type: String},
		Full_Date : {type: Date},
		Type : {type: String}, // typically ERROR, INFO or WARNING
		Status : {type: Number},
		Name : {type: String},
		// Duration
		corr_id_: {type: String},
		method: {type: String},
		isLoginable: {type: Boolean},
		hasPartnerRelationships: {type: Boolean},
		channel: {type: String},
		operation: {type: String},
		type: {type: String},
		service: {type: String},
		path: {type: String},
		issue: {type: String},
		partnerAccount: {type: String},
		message: {type: String},
		exception: {type: String},
		merchantAccountNumber : {type: Number}
	}
});

var Log = mongoose.model('Log', logSchema);

console.log("okay");

db.on('error', console.error);
db.once('open', function() {

	console.log("connection open");

	// Log.findOne({ rawLogsURL : "www.fakeurl.com"}, function (err, result) {
	// 	console.log("mongodb query returned!");
	// 	if (err) console.log(err);
	// 	console.log(JSON.stringify(result, null, 4));
	// 	db.close();
	// });

	var toStore = new Log({rawLogsURL : "www.fakeurl.com"});
	console.log(toStore);
	toStore.save(function(err, result){
		if(err) console.log(err);
		console.log("Inserted Document: " + JSON.stringify(result));
		db.close();

		// Log.findOne({ rawLogsURL : "www.fakeurl.com"}, function (err, result) {
		// 	console.log("mongodb query returned!");
		// 	if (err) console.log(err);
		// 	console.log(JSON.stringify(result, null, 4));
		// 	db.close();
		// });

	});

});
//
// var time = "14:42:36.76";
// var fullDate = "2016/07/28" + 'T' + time.substring(0, 8);
// var fullDateDashes = new Date(fullDate.replace(/\//g, "-"));
// console.log(fullDateDashes)
