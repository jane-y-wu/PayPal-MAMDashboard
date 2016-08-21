'use strict'

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
//var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
var url = 'localhost:27017';
//var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;

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

			mongoose.connect(url /*, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'}*/);
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

		returnCountDefault : function returnCountDefault (callback) {

			var dateSeven = moment();
			var dateSix = dateSeven.clone().subtract(1, 'days');
			var dateFive = dateSix.clone().subtract(1, 'days');
			var dateFour = dateFive.clone().subtract(1, 'days');
			var dateThree = dateFour.clone().subtract(1, 'days');
			var dateTwo = dateThree.clone().subtract(1, 'days');
			var dateOne = dateTwo.clone().subtract(1, 'days');

			var dates = [dateOne.format(form), dateTwo.format(form), dateThree.format(form), dateFour.format(form), dateFive.format(form), dateSix.format(form), dateSeven.format(form)];
			var dataset = [/*dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven*/];

			db = mongoose.createConnection(url);

			db.on('error', console.error);
			db.once('open', function() {

				dates.forEach(function (day) {
					DailyCount.find({date : day, errorType : "AeroHC"}, function (err, results) {
						//dataset.push(results.errorCount);
					})
				});

				db.close();

			})

			// var dayOne = 15;
			// var dayTwo = 18;
			// var dayThree = 12;
			// var dayFour = 10;
			// var dayFive = 16;
			// var daySix = 19;
			// var daySeven = 13;

			
			dataset = [80, 48, 60, 119, 86, 27, 190]

			callback([dates, dataset].toString());
		},

		returnCount : function returnCount (startDate, endDate, errorType, callback) {

			console.log('finding counts!!!!!!!!!!!!!!!!!!!!!!!!!!');

			//mongoose.connect(url);

			var dates = [1, 2, 3, 4, 5, 6, 7];
			var dataset = [53, 55, 28, 29, 23, 50, 22];

			var start = moment(startDate).toDate();
			var end = moment(endDate).toDate();

			db = mongoose.createConnection(url);

			console.log("the url is " + url);
			db.on('error', console.error);
			db.once('open', function() {

				console.log(start + " " + end + " " + errorType);
				DailyCount.find({ date : {$gte: start, $lte: end} , errorType : "AeroHC" }, function (err, results) {
      
					if (!err) {

						console.log("results are " + results);
      
						//store the error count
						results.forEach(function (dailyCt) {
      
							console.log(dailyCt.errorCount + dailyCt.date);
							dates.push(dailyCt.date);
							dataset.push(dailyCt.errorCount);

						});
      
					} else {
						console.log("the error is " + err);
					}
      
					db.close();
					console.log("db closed");
				})
      
      
			})

			callback([dates, dataset].toString());
		}
	}
}
