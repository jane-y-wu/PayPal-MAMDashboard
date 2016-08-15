// var mongoose = require('mongoose');
// var db = mongoose.connection;
// var mongodb = require('mongodb');
// var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
// mongoose.Promise = global.Promise;
// var DailyCount = require('../../models/aggregationSchema').DailyCount;
// var WeeklyCount = require('../../models/aggregationSchema').WeeklyCount;

function getPreviousDay(currentDay) {

	var cYear = currentDay.getFullYear();
	var cMonth = currentDay.getMonth();
	var cDay = currentDay.getDate();

	var pYear;
	var pMonth;
	var pDay;

	// YEAR
	if (currentMonth == 1 && currentDate == 1) { // current time is new year
		pYear = cYear - 1;
	}
	else {
		pYear = cYear;
	}

	// MONTH
	if (cDate == 1) { // first day of a month
		if (cMonth == 1) { // january
			pMonth = 12;
		}

		else {
			pMonth = cMonth - 1;
		}
	}

	else {
		pMonth = cMonth;
	}

	// DATE
	if (cDate == 1) { // first day of a month
		if (cMonth == 5 || cMonth == 7 || cMonth == 10 || cMonth == 12) { // the month before has 30 days
			pDate = 30;
		}
		else if (cMonth == 1 || cMonth == 2 || cMonth == 4 || cMonth == 6 || cMonth == 8 || cMonth == 9 || cMonth == 11) {
			pDate = 31;
		}
		else if (cMonth == 3) { // february
			if ((cYear % 4) == 0 && !((cYear % 100) == 0 && (cYear % 400) != 0)) { // leap year
				pDate = 29;
			}
			else {
				pDate = 28;
			}
		}
		else {
			pDate = cDate - 1;
		}
	}
	else {
		pDate = cDate;
	}

	// used as startTime
	// var time = startYear.toString() + "/" + startMonth.toString() + "/" + startDate.toString() + " " + startHour.toString() + ":00";

	var previousDay = new Date(pYear, pMonth, pDate).toLocaleDateString();
	return previousDay;
}


var date = new Date();

var currentYear = date.getFullYear();
var currentMonth = date.getMonth();
var currentDate = date.getDate();

// today
var dateSeven = new Date(currentYear, currentMonth, currentDate).toLocaleDateString();


// now do that for the 6 days before

var dateSix = new Date(currentYear, currentMonth, currentDate-1).toLocaleDateString();
var dateFive = new Date(currentYear, currentMonth, currentDate-2).toLocaleDateString();
var dateFour = new Date(currentYear, currentMonth, currentDate-3).toLocaleDateString();
var dateThree = new Date(currentYear, currentMonth, currentDate-4).toLocaleDateString();
var dateTwo = new Date(currentYear, currentMonth, currentDate-5).toLocaleDateString();
var dateOne = new Date(currentYear, currentMonth, currentDate-6).toLocaleDateString();

var dayOne = 15;

var dayTwo = 18;
var dayThree = 12;
var dayFour = 10;
var dayFive = 16;
var daySix = 19;
var daySeven = 13;


// mongoose.connect(url);
// db.on('error', console.error);
// db.once('open', function() {

// 	DailyCount.find({date: daySeven}, function(err, results) {

// 		if (!err) {

// 			//store the error count
// 			results.errorCount;

// 			// put it into the array in its corresponding location - how???
// 			// also need to know what type of error it is
// 		}
// 	})

// });


var dates = [dateOne, dateTwo, dateThree, dateFour, dateFive, dateSix, dateSeven];
var dataset = [dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven];

module.exports = {

	dates : dates,
	dataset : dataset
}