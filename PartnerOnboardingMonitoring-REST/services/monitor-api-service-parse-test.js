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
var NUM_ERRORS = 3;

// var logSchema = new mongoose.Schema({
		
// 	values : {
// 		Command : String,
// 		Status : Number,
// 		Machine : String,
// 		Type : String,
// 		Class : String,
// 		Duration : String,
// 		Pool : String,
// 		Timestamp : String
// 	},
// 	url : String,
// 	payload : String
// });

var logSchema = new mongoose.Schema({
	rawLogsUrl : String,
	metaData : {
		Command : {type: String},
		Status : {type: Number},
		Machine : {type: String},
		Type : {type: String},
		Class : {type: String},
		Duration : {type: String},
		Pool : {type: String},
		Data_Center : {type: String},
		Timestamp : {type: Date}
	},
	payload: {
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
		exception: {type: String}
	}
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
				var Log = mongoose.model('Log', logSchema);

				async.each(details.records, function(record, asyncCallback){

					var eventDetailURL = record.url;
					var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");

					request(rawLogsURL, function(error, response, body){
						if(!error && response.statusCode == 200) {
							console.log("raw logs successfully retrieved!");
							// create schema instance from record, add body
							var localLog = { metaData : {}, payload: {} };
							// rawLogsURL from rawLogsURL
							localLog.rawLogsURL = rawLogsURL;
							// metaData object from record
							// toStore.metaData = record; // this will probably need more parsing
							localLog.metaData["Command"] = record.values.Command;
							localLog.metaData["Status"] = parseInt(record.values.Status);
							localLog.metaData["Machine"] = record.values.Machine;
							localLog.metaData["Type"] = record.values.Type;
							localLog.metaData["Class"] = record.values.Class;
							localLog.metaData["Duration"] = record.values.Duration;
							localLog.metaData["Pool"] = record.values.Pool;
							localLog.metaData["Data_Center"] = record.values.dataCenter;
							localLog.metaData["Timestamp"] = Date.parse(record.values.Timestamp); // Date
							// payload object from body
							// until the planned payload goes live we will just parse hardcoded strings
							var toParse = "VALIDATION_ERROR\n corr_id_=2f51e107f2ec1&partnerAccount=1177032420632337513&method=POST&isLoginable=true&hasPartnerRelationships=true&channel=API&operation=VALIDATE_US&type=Input Validation Error&service=PartnerApiPlatformServ&path=#/owner_info/phones/@type=='HOME'/national_number&issue=National number must be between 1 to 14 digits long"

							var NUM_ERRORS = 3;
							var errors = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"];
							var errorFields = [
								["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", "type", "service", "path"/*, "message", "exception"*/], // VALIDATION_ERROR
								["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", /*"type", */"service", /*"path", */"message"], // INTERNAL_SERVICE_ERROR
								["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", /*"type", */"service", /*"path", */"message", "exception"] // SERVICE_TIMEOUT
							];

							var lines = toParse.split("\n");

							var errNum = 0;
							for (; errNum < NUM_ERRORS; errNum++) {
								if (lines[0].localeCompare(errors[errNum]) == 0) break;
							}

							if (errNum == NUM_ERRORS) {
								console.log("Error does not match PartnerApiPlatformServ's list of errors.");
								return;
							}


							for (var fieldNum in errorFields[errNum]) {
								var start = errorFields[errNum][fieldNum] + "=";
								var end = "&";
								var fieldVal = lines[1].match(new RegExp(start + "(.*?)" + end));
								if (fieldVal == null) { // edge case: if field is last
									fieldVal = lines[1].match(new RegExp(start + "(.*)"));
								}
								fieldVal = fieldVal[1];
								console.log("field: " + errorFields[errNum][fieldNum]);
								console.log(fieldVal);
								console.log(" ");

								var fieldName = errorFields[errNum][fieldNum];

								if (fieldName.localeCompare("isLoginable") == 0 || fieldName.localeCompare("hasPartnerRelationships") == 0) {
									localLog.payload[fieldName] = (fieldVal === "true");
								}

								localLog.payload[fieldName] = fieldVal;
							}
							var toStore = new Log(localLog);
							console.log(JSON.stringify(toStore, null, 4));

							toStore.save(function(err, result){
								console.log("Inserted Document: " + JSON.stringify(result));
								asyncCallback();
							});
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

		insertMongo: function insertMongo(record, payload) {
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

		}
	};
};