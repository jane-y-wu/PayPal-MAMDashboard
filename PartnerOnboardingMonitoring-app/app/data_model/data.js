// var mongoose = require('mongoose');
// var db = mongoose.connection;
// var mongodb = require('mongodb');
// var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
// mongoose.Promise = global.Promise;
// var DailyCount = require('../../models/aggregationSchema').DailyCount;
// var WeeklyCount = require('../../models/aggregationSchema').WeeklyCount;
var moment = require('moment');


var dateSeven = moment();
var dateSix = dateSeven.clone().subtract(1, 'days');
var dateFive = dateSix.clone().subtract(1, 'days');
var dateFour = dateFive.clone().subtract(1, 'days');
var dateThree = dateFour.clone().subtract(1, 'days');
var dateTwo = dateThree.clone().subtract(1, 'days');
var dateOne = dateTwo.clone().subtract(1, 'days');

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


var dates = [dateOne.format('LL'), dateTwo.format('LL'), dateThree.format('LL'), dateFour.format('LL'), dateFive.format('LL'), dateSix.format('LL'), dateSeven.format('LL')];
var dataset = [dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven];
var newDataset = [80, 48, 60, 119, 86, 27, 190];

// module.exports = {

// 	dates : dates,
// 	currentDataset : dataset,
// 	newDataset : newDataset

//}

module.exports = {

	dates : dates,
	dataset : dataset
}