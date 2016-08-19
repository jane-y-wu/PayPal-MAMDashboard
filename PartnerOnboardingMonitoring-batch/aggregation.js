var schedule = require('node-schedule');
var service = require('../PartnerOnboardingMonitoring-REST/services/monitor-api-service-parse-test.js');
var request = require('request'); // require request
var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
//var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/test';
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var async = require('async');
//var logSchema = require('mongoose').model('Log').schema;
//var logFile = require('../models/log.js');

var dailyISE = 0;
var dailyST = 0;
var dailyVE = 0;
var weeklyISE = 0;
var weeklyST = 0;
var weeklyVE = 0;



var rule = new schedule.RecurrenceRule();
rule.hour = 0; // runs every day

var interval = schedule.scheduleJob(rule, store);
//store();

function store() {

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate() - 1;
	date = new Date(year, month, day);

	console.log(date);

	// mongoose.Promise = global.Promise;
	// mongoose.connect(url, {}, function(err, res){
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		var log = require('../models/log.js').Log;
	// 		//var logSchema = require('mongoose').model('Log').schema;
	// 		//console.log(temp);
	// 		console.log('is it at least here');
	// 	}

	// 	console.log('what if i put it out here');
	// 	console.log(log);
	// 	log.find({}, function(err, result) {
	// 		console.log('itcame in');
	// 		if (err) return console.error(err);
	// 		console.dir(result);
	// 	});

	// });



	mongoose.Promise = global.Promise;
	mongoose.connect(url);
	db.on('error', console.error);
	db.once('open', function() {

		var aggregation = require('../models/aggregationSchema.js').Aggregation;
		var log = require('../models/log.js').Log;
		console.log(log);

		// log.find({}, function(err, result) {

		// 	console.log('it finding');
		// 	if (err) return console.error(err);
		// 	console.log(result);

		// })

});

	// mongoose.connect(url);
	// db.on('error', console.error);
	// db.once('open', function() {
	// 	var temp = require('../models/log.js');
	// 	var daily = mongoose.model('daily', aggregation);

	// 	var logSchema = require('mongoose').model('Log').schema;

	// 	// access documents 
	// 	// find everything with each error


	// 	// TODO ALSO GOTTA DO IT BASED ON DAY???

	// 	logSchema.count({'type': 'INTERNAL_SERVICE_ERROR', 'Date':date }, function(err, num) {
 //  			if (err) return console.error(err);
 //  			dailyISE = num;
 //  			console.dir('Number of INTERNAL SERVICE ERRORs is : ' + num);
	// 	});

	// 	logSchema.count({ type: 'SERVICE_TIMEOUT' }, function(err, num) {
 //  			if (err) return console.error(err);
 //  			dailyST = num;
 //  			console.dir('Number of SERVICE TIMOUTs is : ' + num);
	// 	});

	// 	logSchema.count({ type: 'VALIDATION_ERROR' }, function(err, num) {
 //  			if (err) return console.error(err);
 //  			dailyVE = num;
 //  			console.dir('Number of VALIDATION ERRORs is : ' + num);
	// 	});

	// 	// tally them up
	// 	// stick it into mongo
		
	// });
}
