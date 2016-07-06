'use strict';
var request = require('request'); // require request
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url
var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';
//var url = 'mongodb://localhost:12345/';
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var async = require('async');

var logSchema = new mongoose.Schema({
		
	values : {
		Command : String,
		Status : Number,
		Machine : String,
		Type : String,
		Class : String,
		Duration : String,
		Pool : String,
		Timestamp : String
	},
	url : String,
	payload : String
});

module.exports = function module() {

	return {
		processCalResult : function processCalResult(id, callback) {
			// do your processing here
			callback(null, {
				"response" : "ok"
			});
		},

		addLogCategory : function addLogCategory(id, callback) {
			// do your processing here
			callback(null, {
				"response" : "ok"
			});
		},

		getAllCalLogs : function getAllCalLogs(callback) {
			// do your processing here
			callback(null, {
				"payload" : [ "payload1", "payload2" ]
			});
		},

		getDetails : function getDetails(jobID, callback) {
			request(sherlockEndpoint + jobID + "/output", function (error, response, body){
				if (!error && response.statusCode == 200) {
					var details = JSON.parse(body);
					//console.log("Details: " + JSON.stringify(details, null, 4));
					var eventDetailURL = details.records[0].url;
					var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");
					callback(details, rawLogsURL);
				} else {
					console.log("Connection error when getting details: " + response.statusCode);
				}
			});
		},

		getRawLogs : function getRawLogs(details, url, callback) {
			request(url, function(error, response, body){
				if(!error && response.statusCode == 200) {
					console.log("raw logs successfully retrieved!");
					//console.log(body);
					callback(details, body);
				} else {
					console.log("Network error in getRawLogs: " + response.statusCode);
				}
			});
		},

		insertMongo: function insertMongo(details, payload) {
		mongoose.connect(url); 

		 	db.on('error', console.error);
		 	db.once('open', function() {
		 		var Log = mongoose.model('Log', logSchema);

		 		async.each(details.records, function(record, callback){
		 			var toStore = new Log(record);
		 			toStore.save(function(err, result){
		 				console.log("Inserted Document Result: " + JSON.stringify(result));
		 				callback();
		 			});
		 		}, function(err){
		 			db.close();
		 		});
			});

		}
	};
};
