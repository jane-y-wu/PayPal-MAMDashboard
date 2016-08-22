'use strict'

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
//var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
var url = 'localhost:27017';
//var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;
var async = require('async');
var errorNames = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"];

var form = 'MMM Do YYYY'; // format of date string

var moment = require('moment');

var dailyCount = new mongoose.Schema({
	date: {type: Date},
	errorType: {type: String},
	errorCount: {type: Number},
});

var weeklyCount = new mongoose.Schema({
	weekNumber: {type: Object},
	errorType: {type: String},
	errorCount: {type: Number},
})

var DailyCount = mongoose.model('DailyCount', dailyCount);
var WeeklyCount = mongoose.model('WeeklyCount', weeklyCount);


module.exports = function module() {

	return {

		storeCount : function storeCount(errorNum, errorName, time) {

			var getWeekNumber = function getWeekNumber(d) {
				var d = new Date(+d);
			    d.setHours(0,0,0);
			    d.setDate(d.getDate()+4-(d.getDay()||7));
			    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
			}

			console.log("in store count : " + errorNum + " " + errorName + " " + time);

			//db = mongoose.createConnection(url /*, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'}*/);
			mongoose.connect(url);

			db.on('error', console.error);
			db.once('open', function() {

				// TODO parse out date
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var day = time.getDay();
				var minute = time.getMinutes();
				var second = time.getSeconds();

				//var currentDate = new Date(year, month, day);
				var timestamp = new Date(year, month, day, minute, second);

				var weekNum = [year, getWeekNumber(time)];
				console.log("week number : " + weekNum);

				DailyCount.find({date : time, errorType : errorName}, function(err, results) {

					if (!results.length) { // there is no document for the day


						var doc = new DailyCount({date : time,
													errorType: errorName,
													errorCount: errorNum});

						console.log(doc);

						var store = new DailyCount(doc);

						store.save(function(err, result){
							console.log(result);
							console.log("saved");
							db.close();
						})

					}
					else {

						DailyCount.update({date : time, errorType : errorName}, {$inc: {errorCount: errorNum}}, function(err, results) {
							console.log("updating");
							console.log(results);

							db.close();
						})

					}

				});

				WeeklyCount.find({weekNumber : weekNum, errorType : errorName}, function(err, results) {

					if (!results.length) { // there is no document for the week


						var doc = new WeeklyCount({weekNumber : weekNum,
													errorType: errorName,
													errorCount: errorNum});

						console.log(doc);

						var store = new WeeklyCount(doc);

						store.save(function(err, result){
							console.log(result);
							console.log("saved");
							db.close();
						})

					}
					else {

						WeeklyCount.update({weekNumber : weekNum, errorType : errorName}, {$inc: {errorCount: errorNum}}, function(err, results) {
							console.log("updating");
							console.log(results);

							db.close();
						})

					}
				})


			});

		},

		getErrorCount : function getErrorCount (startDate, endDate, errorType, callback) {

			var dates = [];
			var dataset = [];

			var responseObj = new Object();

			var start = moment(startDate).toDate();
			var end = moment(endDate).toDate();

			//db = mongoose.createConnection(url);
			mongoose.connect(url);
			//console.log('getErrorCount DB CONNECTS!!!!');
			db.on('error', console.error);
			db.once('open', function() {

				//console.log('getErrorCount DB OPENING!!!!');

				console.log(start + " " + end + " " + errorType);

				if (errorType === "undefined") { // search all three


					async.each(errorNames, function(eachErr, cb) {
						//debugger;
						console.log(eachErr);
						//console.log('************************ before find');
						DailyCount.find({ date : {$gte: start, $lte: end} , errorType : eachErr }, null, {sort : {date : 1}}, function (err, results) {
		      				console.log('inside find');
							if (!err) {

								dates = [];
								dataset = [];

								console.log("results are " + results);
		      
								//store the error count
								results.forEach(function (dailyCt) {
		      
									console.log(dailyCt.errorCount + dailyCt.date);
									dates.push(moment(dailyCt.date).format(form));
									dataset.push(dailyCt.errorCount);

								});
		      
							} else {
								console.log("the error is " + err);
							}

							responseObj[eachErr] = dataset;

							cb();

						})

					}, function(err) {

						responseObj.labels = dates;
						db.close();
						//console.log("***************   get error count db closed");

						callback(JSON.stringify(responseObj));

					})

				} else {
					db.close();
				}



			});
			
		}
	}
}
