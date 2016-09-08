'use strict'

var mongoose = require('mongoose');
//var db = mongoose.connection;
var db = require('../../models/db.js');
var mongodb = require('mongodb');
//var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
var url = 'localhost:27017';
//var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;
var async = require('async');
var errorNames = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"/*, add additional search terms here */];
//mongoose.connect(url);

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

// var DailyCount = mongoose.model('DailyCount', dailyCount);
// var WeeklyCount = mongoose.model('WeeklyCount', weeklyCount);

var DailyCount = db.model('DailyCount', dailyCount);
var WeeklyCount = db.model('WeeklyCount', weeklyCount);


module.exports = function module() {

	return {

		storeCount : function storeCount(errorNum, errorName, time) {

			var getWeekNumber = function getWeekNumber(d) {
				var d = new Date(+d);
			    d.setHours(0,0,0);
			    d.setDate(d.getDate()+4-(d.getDay()||7));
			    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
			}

			//console.log("in store count : " + errorNum + " " + errorName + " " + time);

			// TODO parse out date
			var year = time.getFullYear();
			var month = time.getMonth() + 1;
			var day = time.getDay();
			var minute = time.getMinutes();
			var second = time.getSeconds();

			//var currentDate = new Date(year, month, day);
			var timestamp = new Date(year, month, day, minute, second);

			var weekNum = [year, getWeekNumber(time)];
			//console.log("week number : " + weekNum);

			DailyCount.find({date : time, errorType : errorName}, function(err, results) {

				if (!results.length) { // there is no document for the day


					var doc = new DailyCount({date : time,
												errorType: errorName,
												errorCount: errorNum});

					//console.log(doc);

					var store = new DailyCount(doc);

					store.save(function(err, result){
						//console.log(result);
						//console.log("saved");
					})

				}
				else {

					DailyCount.update({date : time, errorType : errorName}, {$inc: {errorCount: errorNum}}, function(err, results) {
						//console.log("updating");
						//console.log(results);
					})

				}

			});

			WeeklyCount.find({weekNumber : weekNum, errorType : errorName}, function(err, results) {

				if (!results.length) { // there is no document for the week


					var doc = new WeeklyCount({weekNumber : weekNum,
												errorType: errorName,
												errorCount: errorNum});

					//console.log(doc);

					var store = new WeeklyCount(doc);

					store.save(function(err, result){
						//console.log(result);
						//console.log("saved");
					})

				}
				else {

					WeeklyCount.update({weekNumber : weekNum, errorType : errorName}, {$inc: {errorCount: errorNum}}, function(err, results) {
						//console.log("updating");
						//console.log(results);
					})

				}
			})

		},

		getErrorCount : function getErrorCount (startDate, endDate, errorType, callback) {

			var dates = [];
			var dataset = [];
			var total = [];
			var emptyDataset = [];

			var responseObj = new Object();

			var start = moment(startDate).toDate();
			var end = moment(endDate).toDate();

			var curr = moment(startDate);

			//console.log('end is ' + end + ' curr is ' + curr.toDate());

			while (curr.toDate() <= end) {

				dates.push(curr.format(form));
				curr.add(1, 'day');
				emptyDataset.push(0);

			}

			//console.log(dates + emptyDataset);

			//console.log(start + " " + end + " " + errorType);

			if (errorType === "undefined") { // search all three


				async.each(errorNames, function(eachErr, cb) {
					//console.log(eachErr);
					DailyCount.find({ date : {$gte: start, $lte: end} , errorType : eachErr }, null, {sort : {date : 1}}, function (err, results) {
	      				//console.log('inside find');
						if (!err) {

							dataset = []; // reset dataset for each error

							//console.log("results are " + results);

							var dailyCt = 0;

							if (results.length != 0) {

								for (var i = 0; i < dates.length; i++) {
									//console.log(dates.length);
									//console.log("dailyCt is " + dailyCt + " results " + results[dailyCt]);

									if (!results[dailyCt]) {
										dataset.push(0);
										dailyCt++;
									}

									else if (dates[i] === moment(results[dailyCt].date).format(form)) {
										dataset.push(results[dailyCt].errorCount);
										dailyCt++;
									}
									else { // there is no error count for that day, push a 0
										dataset.push(0);
									}


								}
							}

							else {
								dataset = emptyDataset;
							}


						} else {
							//console.log("the error is " + err);
						}

						responseObj[eachErr] = dataset;

						cb();

					})

				}, function(err) {

					responseObj.labels = dates;

					// calculate total
					for (var i = 0; i < responseObj.labels.length; i++) {
					    total.push(responseObj.VALIDATION_ERROR[i] + responseObj.INTERNAL_SERVICE_ERROR[i] + responseObj.SERVICE_TIMEOUT[i]);
					}

					responseObj.totalData = total;
					//console.log(responseObj);
					callback(JSON.stringify(responseObj));

				})

			} else {

			}

		}
	}
}
