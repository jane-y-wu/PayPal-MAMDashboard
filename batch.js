var request = require('request'); // require request
var schedule = require('node-schedule');
var jobID; // string to hold job ID

var date = new Date();

// variables to hold the current time, up to the hour
// will be used as end time
var currentYear;
var currentMonth;
var currentDate;
var currentHour;

// variables to hold the time that will be used as start time
var startYear;
var startMonth;
var startDate;
var startHour;

var endTime;
var startTime;

var rule = new schedule.RecurrenceRule();
rule.minute = 0; // runs every hour when the minute hits 0

var interval = schedule.scheduleJob(rule, process);


function process() { // runs all the needed functions

	endTime = getEndTime();
	startTime = getStartTime();
	submitRequest(startTime, endTime);

}


function getEndTime() {

	currentYear = date.getFullYear();
	currentMonth = date.getMonth() + 1;
	currentDate = date.getDate();
	currentHour = date.getHours();

	var currentTime = currentYear.toString() + "/" + currentMonth.toString() + "/" + currentDate.toString() + " " + currentHour.toString() + ":00";


	return currentTime;
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
		if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12) { // the month before has 30 days
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

	
	var time = startYear.toString() + "/" + startMonth.toString() + "/" + startDate.toString() + " " + startHour.toString() + ":00";

	return time;
}
	



function submitRequest(start, end) {
    request.post(
            'http://calhadoop-vip-a.slc.paypal.com/regex/request',
            {
                json: { // example search input
			"startTime": start,
        		"endTime": end,
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


