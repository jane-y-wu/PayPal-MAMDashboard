'use strict'
var mongoose = require('mongoose');
var db = mongoose.connection;
//var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';
var url = 'mongodb://localhost:12345';

var logSchema = new mongoose.Schema({
	rawLogsUrl : String,
	metaData : { // not all of this is necessary. is this just an echo of the search parameters?
		Machine : {type: String}, //*
		Pool : {type: String}, //*
		Data_Center : {type: String}, //*
	},
	payload: {
		Class : {type: String},
		Timestamp : {type: String},
		Type : {type: String},
		Status : {type: Number}, // type number
		// Name
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

var toParse = '0  T11:00:48.60\tAsyncCb\tAeroHC.Response\t0\t10\tid=8526071539653013254&pid=8526071539653013253&pThreadId=0X128&requestFiltersExecutionMs=0&headersDeliveredMs=9&bodyContentDeliveredMs=9\r\n","url":"http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg11partnerapiplatformserv4014/eventDetail?datetime=2016/07/07 11:00&thread=0x9b&evt=1467914448060&key=110040:10:277&colo=dcg11';

// parse raw log into array of segments
var logSegments = toParse.split("\t");
var match = logSegments[0].match(/[a-zA-Z]+/);
logSegments[0] = logSegments[0].substring(match.index, logSegments[0].length);
logSegments.unshift(logSegments[0][0]);
logSegments[1] = logSegments[1].substring(1, logSegments[1].length);
logSegments[4] = parseInt(logSegments[4]);
var fields = ["Class", "Timestamp", "Type", "Name", "Status", "Duration"]; //, "Data"


mongoose.connect(url);
db.on('error', console.error);
db.once('open', function() {
	var Log = mongoose.model('Log', logSchema);
	var localLog = {payload : {}};

	for (var field in fields) {
		localLog.payload[fields[field]] = logSegments[field];
	}
	//console.log(JSON.stringify(localLog));

	var payloadSegments = logSegments[6].split("&");
	//console.log(payloadSegments);

	for (var i in payloadSegments) { // skip duration field
		var split = payloadSegments[i].split("=");
		localLog.payload[split[0]] = split[1]
	}
	//console.log(JSON.stringify(localLog, null, 4));

	var toStore = new Log(localLog);
	console.log(JSON.stringify(toStore, null, 4));
	toStore.save(function(err, result){
		if (err) console.log(err);
		console.log("Inserted Document: " + JSON.stringify(result));
		db.close();
	});
});

