'use strict';
var request = require('request'); // require request
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url
var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
mongoose.Promise = global.Promise;
//var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';
var assert = require('assert');
var async = require('async');
var Log = require('../../models/log').Log;

var errorNames = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT", "HEADERS_STATUS_DELIVERED"];

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

		getRawLogs : function getRawLogs(details, callback) {
			mongoose.connect(url);
			db.on('error', console.error);
			db.once('open', function() {

				async.each(details.records, function(record, asyncCallback){

					var eventDetailURL = record.url;
					var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");

					// TODO: decompose
					request(rawLogsURL, function(error, response, body){ // use an async each for each row in the response
						if(!error && response.statusCode == 200 && body !== "") {
							console.log("raw logs successfully retrieved!");

							var lines = body.split("\r\n");
							async.each(lines, function(singleLog, async2Callback){
								if (singleLog !== "") {
									var logSegments = singleLog.split("\t");
									//console.log(JSON.stringify(logSegments, null, 4));
									var match = logSegments[0].match(/[a-zA-Z]+/);
									logSegments[0] = logSegments[0].substring(match.index, logSegments[0].length);
									logSegments.unshift(logSegments[0][0]);
									logSegments[1] = logSegments[1].substring(1, logSegments[1].length);
									logSegments[4] = parseInt(logSegments[4]);
									var fields = ["Class", "Timestamp", "Type", "Name", "Status"]; //"Duration", "Data" | Duration is only a field with 't', 'T' or 'A' TODO: account for possibility of 'A'

									// if the line's name matches the array of valid names
									if (errorNames.indexOf(logSegments[3]) >= 0) {
										var localLog = { metaData : {}, payload: {} };
										// rawLogsURL from rawLogsURL
										localLog.rawLogsURL = rawLogsURL;
										// metaData object from record
										localLog.metaData["Machine"] = record.values.Machine;
										localLog.metaData["Pool"] = record.values.Pool;
										var dataCenter = "Data-Center";
										localLog.metaData["Data_Center"] = record.values[dataCenter];

										var dateMatch = rawLogsURL.match("datetime=(.*) ");
										var calendarDate = dateMatch[1];

										for (var field in fields) {
											switch(fields[field]) {
												case "Timestamp":
													var time = logSegments[field];
													var fullDate = calendarDate + 'T' + time.substring(0, 8);
													var fullDateDashes = fullDate.replace(/\//g, "-");
													localLog.payload["Full_Date"] = new Date(fullDateDashes);
													break;
												default:
													localLog.payload[fields[field]] = logSegments[field];
											}
										}
										//console.log(JSON.stringify(localLog));

										var payloadSegments = logSegments[5].split("&");
										//console.log(payloadSegments);

										for (var i in payloadSegments) { // skip duration field
											var split = payloadSegments[i].split("=");
											switch(split[0]) {
												case "Status":
													localLog.payload[split[0]] = parseInt(split[1]);
													break;
												default:
												localLog.payload[split[0]] = split[1];
											}
										}
										//console.log(JSON.stringify(localLog, null, 4));

										var toStore = new Log(localLog);
										console.log("toStore: " + JSON.stringify(toStore, null, 4));

										toStore.save(function(err, result){
											if(err) console.log(err);
											console.log("Inserted Document: " + JSON.stringify(result));
											async2Callback();

											// Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
											// 	console.log("mongodb query returned!");
											// 	if (err) console.log(err);
											// 	console.log(JSON.stringify(result, null, 4));
											// 	async2Callback();
											// });
										});
									} else {
										async2Callback();
									}
								} else {
									async2Callback();
								}
							}, function(err) {
								asyncCallback();
							});
						} else {
							//if (error) console.log("Network error in getRawLogs: " + response.statusCode); //TODO debug the errors being received
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
