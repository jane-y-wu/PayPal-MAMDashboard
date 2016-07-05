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

var testSchema = new mongoose.Schema({
	TestKey : String
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

		 		var sampleResponse = new Log(details.records[0]); // gets the first element from the list of responses (for testing)

		 		sampleResponse.payload = payload; // add payload onto the response JSON object

		 		//var sandbox_col = db.collection('sandbox_col');
		 		//var Test = mongoose.model('Test', testSchema);
				//var testResponse = new Test({TestKey : "Test Value"});
				//console.log(JSON.stringify(testResponse));

				sampleResponse.save(function(err, result) {
				//sandbox_col.save(testResponse, function(err, result) {
					//assert.equal(err, null);
					//console.log("Inserted Document Result: " + JSON.stringify(result));
					Log.find(function(err, logs){
						if (err) return console.error(err);
						console.dir(JSON.stringify(logs, null, 4));
						db.close();
					});
				});

				// sampleResponse.save(function(err, sampleResponse) { // save to mongoDB
		 
				// 	 if (err) {
				// 		 return console.error(err);
				// 	 }

				// 	 console.log("Element inserted into mongoDB database : " + JSON.stringify(sampleResponse, null, 4));


				// 	 db.close();
				// });

			});

			// MongoClient.connect(url, function(err, db){
			// 	if(err) {
			// 		console.log('Unable to connect to the mongoDB server. Error:', err);
			// 	} else {
			// 		console.log('Connection established to', url);

			// 		var Log = mongoose.model('Log', logSchema);
			// 		var sampleResponse = new Log(details.records[0]);
			// 		sampleResponse.payload = payload;
			// 		//console.log(JSON.stringify(sampleResponse));

			// 		var Test = mongoose.model('Test', testSchema);
			// 		var testResponse = new Test({TestKey : "Test Value"});
			// 		console.log(JSON.stringify(testResponse));

			// 		var sandbox_col = db.collection('sandbox_col');
			// 		sandbox_col.save(testResponse, function(err, result) {
			// 			//assert.equal(err, null);
			// 			console.log("Inserted Document Result: " + JSON.stringify(result));
			// 			db.close();
			// 		});
			// 	}
			// });

		}
	};
};
