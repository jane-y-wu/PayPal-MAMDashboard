'use strict'

var mongoose = require('mongoose');
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

module.exports = {
	DailyCount : DailyCount,
	WeeklyCount : WeeklyCount
}
