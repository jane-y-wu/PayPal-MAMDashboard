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
var Log = require('../../models/log').Log;

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
					if (details.records.length == 0) {
						console.log("No results!");
					} else {
						//var eventDetailURL = details.records[0].url;
						//var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");
						callback(details);
					}
				} else {
					console.log("Connection error when getting details: " + response.statusCode);
					console.log(sherlockEndpoint + jobID + "/output");
				}
			});
		},

		getRawLogs : function getRawLogs(details, callback) { // TODO: decompose
			mongoose.connect(url);
			db.on('error', console.error);
			db.once('open', function() {

				async.each(details.records, function(record, asyncCallback){

					var eventDetailURL = record.url;
					var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");

					request(rawLogsURL, function(error, response, body){ // use an async each for each row in the response
						if(!error && response.statusCode == 200) {
							console.log("raw logs successfully retrieved!");
							// create schema instance from record, add body
							var localLog = { metaData : {}, payload: {} };
							// rawLogsURL from rawLogsURL
							localLog.rawLogsURL = rawLogsURL;
							// metaData object from record
							localLog.metaData["Machine"] = record.values.Machine;
							localLog.metaData["Pool"] = record.values.Pool;
							var dataCenter = "Data-Center";
							localLog.metaData["Data_Center"] = record.values[dataCenter];
							// payload from body
							if (body !== "") {
								var logSegments = body.split("\t");
								console.log(JSON.stringify(logSegments, null, 4));
								var match = logSegments[0].match(/[a-zA-Z]+/);
								logSegments[0] = logSegments[0].substring(match.index, logSegments[0].length);
								logSegments.unshift(logSegments[0][0]);
								logSegments[1] = logSegments[1].substring(1, logSegments[1].length);
								//logSegments[4] = parseInt(logSegments[4]);
								var fields = ["Class", "Timestamp", "Type", "Name", "Status", "Duration"]; //, "Data"

								for (var field in fields) {
									localLog.payload[fields[field]] = logSegments[field];
								}
								//console.log(JSON.stringify(localLog));

								var payloadSegments = logSegments[6].split("&");
								//console.log(payloadSegments);

								for (var i in payloadSegments) { // skip duration field
									var split = payloadSegments[i].split("=");
									localLog.payload[split[0]] = split[1] // TODO: check if field is not of String type and parse accordingly
								}
								//console.log(JSON.stringify(localLog, null, 4));

								var toStore = new Log(localLog);

								toStore.save(function(err, result){
									if(err) console.log(err);
									console.log("Inserted Document: " + JSON.stringify(result));

									Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
										console.log("mongodb query returned!");
										if (err) console.log(err);
										console.log(JSON.stringify(result, null, 4));
										asyncCallback();
									});

									//asyncCallback();
								});
							} else {
								asyncCallback();
							}							
						} else {
							console.log("Network error in getRawLogs: " + response.statusCode);
							asyncCallback();
						}
					});
				
				}, function(err){
					db.close();
					callback();
				});
			});
		},

		insertMongo : function insertMongo(record, payload) {
		   mongoose.connect(url);

			db.on('error', console.error);
			db.once('open', function() {
				var Log = mongoose.model('Log', logSchema);

				async.each(details.records, function(record, callback){
					var toStore = new Log(record);
					toStore.payload = payload
					toStore.save(function(err, result){
						console.log("Inserted Document Result: " + JSON.stringify(result));
						callback();
					});
				}, function(err){
					db.close();
				});
			});
		},

		displayAll : function displayAll(callback) {
			Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
				console.log("mongodb query returned!");
				if (err) console.log(err);
				console.log(JSON.stringify(result, null, 4));
				callback();
			});
		}
	};
};