var request = require('request'); // require request
var schedule = require('node-schedule');
var jobID; // string to hold job ID
var start = 00;
var end = 01;

var date = new Date();

var currentYear;
var currentMonth;
var currentDate;
var currentHour;

var startYear;
var startMonth;
var startDate;
var startHour;

var endTime = getEndTime();
var startTime = getStartTime();

//console.log(endTime);
//console.log(startTime);
//getEndTime();
//getStartTime();

// var interval = schedule.scheduleJob('*/10 * * * * *', submitRequest);


submitRequest();




function getEndTime() {

	currentYear = date.getFullYear();
	currentMonth = date.getMonth() + 1;
	currentDate = date.getDate();
	currentHour = date.getHours();

	// TEST

	/*currentYear = 2015;
	currentMonth = 5;
	currentDate = 25;
	currentHour = 20;*/


	endTime = currentYear.toString() + "/" + currentMonth.toString() + "/" + currentDate.toString() + " " + currentHour.toString() + ":00";


	return endTime;
}

function getStartTime() {

	// YEAR
	if (currentMonth == 1 && currentDate == 1 && currentHour == 0) {
		startYear = currentYear - 1;
	}
	else {
		startYear = currentYear;
	}

	// MONTH
	if (currentDate == 1 && currentHour == 0) {
		if (currentMonth == 1) {	
			startMonth = 12;
		}

		else {
			startMonth = currentMonth - 1;
		}
	}
	
	else {
		startMonth = currentMonth;
	}

	// DATE
	if (currentDate == 1 && currentHour == 0) {
		if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12) {
			startDate = 30;
		}
		else if (currentMonth == 1 || currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 || currentMonth == 9 || currentMonth == 11) {
			startDate = 31;
		}
		else if (currentMonth == 3) { // february
			if ((currentYear % 4) == 0 && !((currentYear % 100) == 0 && (currentYear % 400) != 0)) { // leap year
				startDate = 29;
			}
			else {
				startDate = 28;
			}
		}
		else {
			startDate = currentDate - 1;
		}
	}
	else {
		startDate = currentDate;
	}	
	
	// HOUR
	if (currentHour == 0) {
		startHour = 23;
	}
	else {
		startHour = currentHour - 1;
	}

	
	startTime = startYear.toString() + "/" + startMonth.toString() + "/" + startDate.toString() + " " + startHour.toString() + ":00";

	return startTime;
}
	



function submitRequest() {
    request.post(
            'http://calhadoop-vip-a.slc.paypal.com/regex/request',
            {
                json: { // example search input
			"startTime": startTime,
        		"endTime": endTime,
			"environment":"paypal",
			"pool": "partnerapiplatformserv",
			"dataCenter":"all",
        		"machine":"",
        		"sampling":"100",
        		"regexs":["ResponseCode=200"],
        		"isTransactionSearch":"false",
        		"searchMode":"simple",
        		"httpCallback":"http://partner-onboarding-monitor-9745.ccg21.dev.paypalcorp.com:3003/api/test",
        		"email":"janwu@paypal.com"
		}
	},
	function (error, response, body) {

		if (response) {
			if (!error && response.statusCode == 200) { // no errors
				console.log("Job ID : " + body); // prints out job ID
				jobID = body; // store job ID

				console.log(startTime);
				console.log(endTime);
				
			}

                	else {
				console.log(response.statusCode); // error code
                		// TODO what to do when we get an error code back
				
			}
		}

		else { // if response is null
			// TODO
		}
	}

)};


