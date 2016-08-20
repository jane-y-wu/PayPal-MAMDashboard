'use strict';
var request = require('request'); // require request
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url
var mongoose = require('mongoose');
var db = mongoose.connection;
//var url = 'mongodb://root:ej+yFtAR^mEjKB?6AhK7Xrm_prM?aK32Xx94@10.25.39.2:27017';
var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;
//var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';
var assert = require('assert');
var async = require('async');
//var Log = require('../../models/log').Log;

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

var fakeDataObject = [{
		rawLogsURL : "http://www.paypal.com",
		metaData : {
			Machine : "machine",
			Pool : "pool",
			Data_Center : "data center",
		},
		payload: {
			Class : "E",
			Full_Date : Date.now(),
			Type : "Validation",
			Status : 2,
			Name : "VALIDATION_ERROR",
			corr_id_: "123456789",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "VALIDATE_US",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			path: "#/owner_info/phones/@type=='HOME'/national_number",
			issue: "National number must be between 1 to 14 digits long",
			partnerAccount: "1177032420632337513"
		}},
	{
		rawLogsURL : "http://www.paypal2.com",
		metaData : {
			Machine : "machine2",
			Pool : "pool2",
			Data_Center : "data center2",
		},
		payload: {
			Class : "E2",
			Full_Date : Date.now(),
			Type : "Validation 2",
			Status : 2,
			Name : "VALIDATION_ERROR 2",
			corr_id_: "123456789 2",
			method: "POST 2",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API 2",
			operation: "VALIDATE_US 2",
			type: "Input Validation Error2",
			service: "PartnerApiPlatformServ 2",
			path: "#/owner_info/phones/@type=='HOME'/national_number 2",
			issue: "National number must be between 1 to 14 digits long ",
			partnerAccount: "1177032420632337513 2"
		}},
		{
			rawLogsURL : "http://www.paypal.com",
			metaData : {
				Machine : "machine",
				Pool : "pool",
				Data_Center : "data center",
			},
			payload: {
				Class : "E",
				Full_Date : Date.now(),
				Type : "Validation 3",
				Status : 3,
				Name : "VALIDATION_ERROR 3",
				corr_id_: "123456789 3",
				method: "POST 3",
				isLoginable: true,
				hasPartnerRelationships: true,
				channel: "API 3",
				operation: "VALIDATE_US 3",
				type: "Input Validation Error 3",
				service: "PartnerApiPlatformServ 3",
				path: "#/owner_info/phones/@type=='HOME'/national_number 3",
				issue: "National number must be between 1 to 14 digits long 3",
				partnerAccount: "1177032420632337513 3"
			}},
			{
					rawLogsURL : "http://www.paypal.com",
					metaData : {
						Machine : "machine",
						Pool : "pool",
						Data_Center : "data center",
					},
					payload: {
						Class : "E",
						Full_Date : Date.now(),
						Type : "Validation",
						Status : 2,
						Name : "INTERNAL_SERVICE_ERROR",
						corr_id_: "123456789",
						method: "POST",
						isLoginable: true,
						hasPartnerRelationships: true,
						channel: "API",
						operation: "VALIDATE_US",
						type: "Input Validation Error",
						service: "PartnerApiPlatformServ",
						path: "#/owner_info/phones/@type=='HOME'/national_number",
						issue: "National number must be between 1 to 14 digits long",
						partnerAccount: "1177032420632337513"
					}},
				{
					rawLogsURL : "http://www.paypal2.com",
					metaData : {
						Machine : "machine2",
						Pool : "pool2",
						Data_Center : "data center2",
					},
					payload: {
						Class : "E2",
						Full_Date : Date.now(),
						Type : "Validation 2",
						Status : 2,
						Name : "INTERNAL_SERVICE_ERROR 2",
						corr_id_: "123456789 2",
						method: "POST 2",
						isLoginable: true,
						hasPartnerRelationships: true,
						channel: "API 2",
						operation: "VALIDATE_US 2",
						type: "Input Validation Error2",
						service: "PartnerApiPlatformServ 2",
						path: "#/owner_info/phones/@type=='HOME'/national_number 2",
						issue: "National number must be between 1 to 14 digits long ",
						partnerAccount: "1177032420632337513 2"
					}},
					{
						rawLogsURL : "http://www.paypal.com",
						metaData : {
							Machine : "machine",
							Pool : "pool",
							Data_Center : "data center",
						},
						payload: {
							Class : "E",
							Full_Date : Date.now(),
							Type : "Validation 3",
							Status : 3,
							Name : "INTERNAL_SERVICE_ERROR 3",
							corr_id_: "123456789 3",
							method: "POST 3",
							isLoginable: true,
							hasPartnerRelationships: true,
							channel: "API 3",
							operation: "VALIDATE_US 3",
							type: "Input Validation Error 3",
							service: "PartnerApiPlatformServ 3",
							path: "#/owner_info/phones/@type=='HOME'/national_number 3",
							issue: "National number must be between 1 to 14 digits long 3",
							partnerAccount: "1177032420632337513 3"
						}},
						{
								rawLogsURL : "http://www.paypal.com",
								metaData : {
									Machine : "machine",
									Pool : "pool",
									Data_Center : "data center",
								},
								payload: {
									Class : "E",
									Full_Date : Date.now(),
									Type : "Validation",
									Status : 2,
									Name : "SERVICE_TIMEOUT",
									corr_id_: "123456789",
									method: "POST",
									isLoginable: true,
									hasPartnerRelationships: true,
									channel: "API",
									operation: "VALIDATE_US",
									type: "Input Validation Error",
									service: "PartnerApiPlatformServ",
									path: "#/owner_info/phones/@type=='HOME'/national_number",
									issue: "National number must be between 1 to 14 digits long",
									partnerAccount: "1177032420632337513"
								}},
							{
								rawLogsURL : "http://www.paypal2.com",
								metaData : {
									Machine : "machine2",
									Pool : "pool2",
									Data_Center : "data center2",
								},
								payload: {
									Class : "E2",
									Full_Date : Date.now(),
									Type : "Validation 2",
									Status : 2,
									Name : "SERVICE_TIMEOUT 2",
									corr_id_: "123456789 2",
									method: "POST 2",
									isLoginable: true,
									hasPartnerRelationships: true,
									channel: "API 2",
									operation: "VALIDATE_US 2",
									type: "Input Validation Error2",
									service: "PartnerApiPlatformServ 2",
									path: "#/owner_info/phones/@type=='HOME'/national_number 2",
									issue: "National number must be between 1 to 14 digits long ",
									partnerAccount: "1177032420632337513 2"
								}},
								{
									rawLogsURL : "http://www.paypal.com",
									metaData : {
										Machine : "machine",
										Pool : "pool",
										Data_Center : "data center",
									},
									payload: {
										Class : "E",
										Full_Date : Date.now(),
										Type : "Validation 3",
										Status : 3,
										Name : "SERVICE_TIMEOUT 3",
										corr_id_: "123456789 3",
										method: "POST 3",
										isLoginable: true,
										hasPartnerRelationships: true,
										channel: "API 3",
										operation: "VALIDATE_US 3",
										type: "Input Validation Error 3",
										service: "PartnerApiPlatformServ 3",
										path: "#/owner_info/phones/@type=='HOME'/national_number 3",
										issue: "National number must be between 1 to 14 digits long 3",
										partnerAccount: "1177032420632337513 3"
									}}]

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
			mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'});
			db.on('error', console.error);
			db.once('open', function() {

				var numErrors = details.records.length;
				var errorType;
				var date;

				async.each(details.records, function(record, asyncCallback){

					var eventDetailURL = record.url; //this is logview url
					var jsonURL = eventDetailURL.replace("logviewui", "logview");

					request(jsonURL, function(error, response, body){
						// In response.calBlockResp:
						// every JSON object has @Subclasstype calblockresponse or calrecordbean
						// calrecordbeans are what we're interested. calblockresponse contain more JSON objects
						if(!error && response.statusCode == 200) {
							// Use a stack to iteratively search through entire JSON object for objects with name in errorNames
							var recordStack = [];
							recordStack.push(JSON.parse(body));
							while (recordStack.length > 0) {
								var currRecord = recordStack.pop();
								if (currRecord["@Subclasstype"] == "callblockresponse") {
									for (var i in currRecord["calActivitiesResp"]) {
										recordStack.push(currRecord["calActivitiesResp"][i]);
									}
								} else if (currRecord["@Subclasstype"] == "callblockresponse" && errorNames.indexOf(currRecord["name"]) >= 0) {
									// Parse Class and Full_date from messageClass
									// Parse Type, Status and Name from currRecord
									// Parse key value pairs in data for rest of fields
								} else if (currRecord["@Subclasstype"] != "callblockresponse") {
									console.log("Unknown subclasstype!");
								}
							}
						} else {
							console.log(error);
							console.log("Status Code: " + response.statusCode);
						}
					});

					// var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs");
					//
					// // TODO: decompose
					// request(rawLogsURL, function(error, response, body){ // use an async each for each row in the response
					// 	if(!error && response.statusCode == 200 && body !== "") {
					// 		console.log("raw logs successfully retrieved!");
					//
					// 		var lines = body.split("\r\n");
					// 		async.each(lines, function(singleLog, async2Callback){
					// 			if (singleLog !== "") {
					// 				var logSegments = singleLog.split("\t");
					// 				//console.log(JSON.stringify(logSegments, null, 4));
					// 				var match = logSegments[0].match(/[a-zA-Z]+/);
					// 				logSegments[0] = logSegments[0].substring(match.index, logSegments[0].length);
					// 				logSegments.unshift(logSegments[0][0]);
					// 				logSegments[1] = logSegments[1].substring(1, logSegments[1].length);
					// 				logSegments[4] = parseInt(logSegments[4]);
					// 				var fields = ["Class", "Timestamp", "Type", "Name", "Status"]; //"Duration", "Data" | Duration is only a field with 't', 'T' or 'A' TODO: account for possibility of 'A'
					//
					// 				// if the line's name matches the array of valid names
					// 				if (errorNames.indexOf(logSegments[3]) >= 0) {
					// 					var localLog = { metaData : {}, payload: {} };
					// 					// rawLogsURL from rawLogsURL
					// 					localLog.rawLogsURL = rawLogsURL;
					// 					// metaData object from record
					// 					localLog.metaData["Machine"] = record.values.Machine;
					// 					localLog.metaData["Pool"] = record.values.Pool;
					// 					var dataCenter = "Data-Center";
					// 					localLog.metaData["Data_Center"] = record.values[dataCenter];
					//
					// 					var dateMatch = rawLogsURL.match("datetime=(.*) ");
					// 					var calendarDate = dateMatch[1];
					//
					// 					for (var field in fields) {
					// 						switch(fields[field]) {
					// 							case "Timestamp":
					// 								var time = logSegments[field];
					// 								var fullDate = calendarDate + 'T' + time.substring(0, 8);
					// 								var fullDateDashes = fullDate.replace(/\//g, "-");
					// 								localLog.payload["Full_Date"] = new Date(fullDateDashes);
					// 								break;
					// 							default:
					// 								localLog.payload[fields[field]] = logSegments[field];
					// 						}
					// 					}
					// 					//console.log(JSON.stringify(localLog));
					//
					// 					var payloadSegments = logSegments[5].split("&");
					// 					//console.log(payloadSegments);
					//
					// 					for (var i in payloadSegments) { // skip duration field
					// 						var split = payloadSegments[i].split("=");
					// 						switch(split[0]) {
					// 							case "Status":
					// 								localLog.payload[split[0]] = parseInt(split[1]);
					// 								break;
					// 							case "isLoginable":
					// 							case "hasPartnerRelationships":
					// 								localLog.payload[split[0]] = (split[1] === 'true');
					// 								break;
					// 							default:
					// 							localLog.payload[split[0]] = split[1];
					// 						}
					// 					}
					// 					//console.log(JSON.stringify(localLog, null, 4));
					//
					// 					var toStore = new Log(localLog);
					// 					console.log("toStore: " + JSON.stringify(toStore, null, 4));
					//
					// 					toStore.save(function(err, result){
					// 						if(err) console.log(err);
					// 						console.log("Inserted Document: " + JSON.stringify(result));
					// 						async2Callback();
					//
					// 						// Log.findOne({ 'payload.Type' : 't'}, function (err, result) {
					// 						// 	console.log("mongodb query returned!");
					// 						// 	if (err) console.log(err);
					// 						// 	console.log(JSON.stringify(result, null, 4));
					// 						// 	async2Callback();
					// 						// });e
					// 					});
					//
					// 					errorType = localLog.payload["Name"];
					// 					date = localLog.payload["Full_Date"];
					//
					//
					// 				} else {
					// 					async2Callback();
					// 				}
					// 			} else {
					// 				async2Callback();
					// 			}
					// 		}, function(err) {
					//
					// 			asyncCallback();
					//
					// 		});
					// 	} else {
					// 		//if (error) console.log("Network error in getRawLogs: " + response.statusCode); //TODO debug the errors being received
					// 		asyncCallback();
					// 	}
					// });

				}, function(err/*, numErrors, errorType, date*/){
					db.close();

                    			//callback();
                    			db.once('close', function() {
						console.log(numErrors + " " + errorType + " " + date);
						callback(numErrors, errorType, date);
                    			})

				});
			});
		},

		returnLogs : function returnLogs(startDate, endDate, filters, callback) {

			console.log("filters: " + filters);

			mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'});
			db.on('error', console.error);
			db.once('open', function() {

				//if(filters.length == 0) {
					Log.find({'payload.Full_Date' : { $gte:startDate, $lte: endDate}}, function(err, logs){
						db.close();
						console.log("logs: " + JSON.stringify(logs));
						callback(logs);
					});
				// } else {
				// 	Log.find(filters, function(err, logs){
				// 		db.close();
				// 		callback(logs);
				// 	});
				// }

				//callback(fakeDataObject);

			});
			//callback(fakeDataObject);
		}


	};
};
