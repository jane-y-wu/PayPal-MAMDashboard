'use strict'

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
//var url = 'localhost:27017';
mongoose.Promise = global.Promise;

var dailyCount = new mongoose.Schema({
	date: {type: Date},
	// start: {type: Date},
	// end: {type: Date},
	// internalServiceErrorCount: {type: String},
	// serviceTimeoutCount: {type: String},
	// validationErrorCount: {type: String},
	// totalCount: {type: String}
	errorType: {type: String},
	errorCount: {type: Number},
	lastUpdated: {type: Date}
});

var weeklyCount = new mongoose.Schema({
	//weekNumber: [ {type: Number}, {type: Number}],
	weekNumber: {type: Object},
	errorType: {type: String},
	errorCount: {type: Number},
	lastUpdated: {type: Date}

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
													errorCount: errorNum,
													lastUpdated: timestamp}); 

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

					if (!results.length) { // there is no document for the day


						var doc = new WeeklyCount({weekNumber : weekNum,
													errorType: errorName,
													errorCount: errorNum,
													lastUpdated: timestamp}); 

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

		}
	}
}
