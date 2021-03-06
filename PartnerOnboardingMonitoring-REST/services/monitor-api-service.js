'use strict';
var request = require('request'); // require request
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url
var mongoose = require('mongoose');
var db = require('../../models/db.js');
mongoose.Promise = global.Promise;
var assert = require('assert');
var async = require('async');

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
		Full_Date : {type: Date}, // TODO: Define as primary key
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

var Log = db.model('Log', logSchema);

var errorNames = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"/*, add additional search terms here */];

module.exports = function module() {

	return {

		getDetails : function getDetails(jobID, callback) {
			request(sherlockEndpoint + jobID + "/output", function (error, response, body){
				if (!error && response.statusCode == 200) {
					var details = JSON.parse(body);
					if (details.records.length == 0) {
						console.log("Query with jobID " + jobID + " returned with no results!");
					} else {
						callback(details);
					}
				} else {
					console.log("Connection error when getting details. Status code: " + response.statusCode + " Request URL: " + sherlockEndpoint + jobID + "/output");
				}
			});
		},

		getRawLogs : function getRawLogsClosure(details, callback) {

			var getRawLogs = function(details, callback) {
				var aggregateData = {};
				aggregateData.numErrors = details.records.length;
				aggregateData.errorType;
				aggregateData.date;

				async.each(details.records, function(record, asyncCallback){
					var eventDetailURL = record.url; //this is logview url
					var jsonURL = eventDetailURL.replace("logviewui", "logview");
					console.log(record);
					console.log(JSON.stringify(record, null, 4));

					request(jsonURL, function(error, response, body){
						// In response.calBlockResp:
						// every JSON object has @Subclasstype calblockresponse or calrecordbean
						// calrecordbeans are what we're interested. calblockresponse contain more JSON objects
						if(!error && response.statusCode == 200) {
							// Use a stack to iteratively search through entire JSON object for objects with name in errorNames
							var toStores = [];

							var metaBlock = JSON.parse(body);
							var pool = metaBlock.pool;
							var machine = metaBlock.machine;
							var recordStack = [];
							for(var h in metaBlock.calBlockResp) {
								recordStack.push(metaBlock.calBlockResp[h]);
							}
							while (recordStack.length > 0) {
								var currRecord = recordStack.pop();
								if (currRecord["@Subclasstype"] == "calblockresponse") {
									for (var i in currRecord["calActivitesResp"]) {
										recordStack.push(currRecord["calActivitesResp"][i]);
									}
								} else if (currRecord["@Subclasstype"] == "calrecordbean" && errorNames.indexOf(currRecord["name"]) >= 0) {
									parseLog(toStores, currRecord, jsonURL, pool, machine, record, aggregateData);
								} else if (currRecord["@Subclasstype"] != "calrecordbean" && currRecord["@Subclasstype"] != "calblockresponse") {
									console.log("Unknown subclasstype: " + currRecord["@Subclasstype"]);
								}
							}
						} else {
							console.log("Error fetching logs. Status Code: " + response.statusCode + " Error: " + console.log(error));
						}

						storeLogs(toStores, asyncCallback);

					});
				}, function(err){
						callback(aggregateData.numErrors, aggregateData.errorType, aggregateData.date);
				});
			};

			var parseLog = function(toStores, currRecord, jsonURL, pool, machine, record, aggregateData) {
				var localLog = { metaData : {}, payload: {} };
				localLog.rawLogsURL = jsonURL;
				localLog.metaData.Pool = pool;
				localLog.metaData.Machine = machine;
				localLog.metaData.Data_Center = record.values["Data-Center"];
				// Parse Full_date from messageClass
				localLog.payload.Class = record.values.Class;
				var dateMatch = jsonURL.match("datetime=(.*) ");
				var calendarDate = dateMatch[1];
				var time = currRecord.messageClass.substring(1);
				var fullDate = calendarDate + 'T' + time.substring(0, 8);
				var fullDateDashes = fullDate.replace(/\//g, "-");
				localLog.payload["Full_Date"] = new Date(fullDateDashes);
				// Parse Type, Status and Name from currRecord
				localLog.payload.Type = record.values.Type; // TODO parse from record instead of currRecord
				localLog.payload.Status = parseInt(currRecord.status);
				localLog.payload.Name = currRecord.name;
				// Parse key value pairs in data for rest of fields
				var payloadSegments = currRecord.data.split("&");

				for (var i in payloadSegments) {
					var split = payloadSegments[i].split("=");
					switch(split[0]) {
						case "Status":
							localLog.payload[split[0]] = parseInt(split[1]);
							break;
						case "isLoginable":
						case "hasPartnerRelationships":
							localLog.payload[split[0]] = (split[1] === 'true');
							break;
						default:
						localLog.payload[split[0]] = split[1];
					}
				}

				aggregateData.errorType = localLog.payload.Name;
				aggregateData.date = localLog.payload["Full_Date"];

				// Save to queue of toStores
				var toStore = new Log(localLog);
				toStores.push(toStore);
			};

			var storeLogs = function(toStores, asyncCallback){
				async.each(toStores, function(toStore, asyncCallback2) {
					// Add all toStores to MongoDB
					toStore.save(function(err, result){
						if(err) console.log(err);
						asyncCallback2();
					});
				}, function(err) {
					asyncCallback();
				});
			};

			return getRawLogs(details, callback);
		},

		returnLogs : function returnLogs(startDate, endDate, filters, callback) {
			Log.find({'payload.Full_Date' : { $gte:startDate, $lte: endDate}}, function(err, logs){
				if (err){
					console.log("error retrieving logs from mongo");
					console.log(err);
				}
				callback(logs);
			});
		},

    getSingleLog : function getSingleLog(logID, callback) {
      Log.findOne({'_id' : logID}, function(err, log){
        if(err) console.log(err);
				callback(log);
      });
    }

	};
};
