var request = require('request'); // require request
var schedule = require('node-schedule');
var async = require('async');
var jobID; // string to hold job ID
var regexsField = [/*'INTERNAL_SERVICE_ERROR', 'VALIDATION_ERROR', 'SERVICE_TIMEOUT',*/ 'HEADERS_STATUS_DELIVERED']; // expressions to search for in the CAL log
var errorCodes = 0; // number of times CAL returns an error code
var nullResponse = 0; // number of times the response is null
var alexC3 = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com'; // for testing purposes
var madhavC3 = 'http://partner-onboarding-monitor-9745.ccg21.dev.paypalcorp.com';
var httpCallbackURL;
var option = process.argv[2];

// for testing purposes: option a to use alex's C3, m for madhav's
if (option == 'a') {
	httpCallbackURL = alexC3 + ":3004/api/queryready/?id=$id&status=$status";
}
else if (option == 'm') {
	httpCallbackURL = madhavC3 + ":3004/api/queryready/?id=$id&status=$status";
}
else { // default
    httpCallbackURL = madhavC3 + ":3004/api/queryready/?id=$id&status=$status";
}

// TEST
console.log(httpCallbackURL);

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
rule.minute = 1; // runs every hour; one minute past the new hour for a slight delay

//var interval = schedule.scheduleJob(rule, run);
run();

function run() { // runs all the needed functions

	endTime = getEndTime();
	startTime = getStartTime();

	/*async.each(regexsField, function(searchString, callback) {
		submitRequest(startTime, endTime, searchString);
		},
		function(err) {}); */
	submitRequest(startTime, endTime);

	nullResponse = 0;
	errorCodes = 0;
}


function getEndTime() { // gets current time up to the hour and will be saved as endTime

	currentYear = date.getFullYear();
	currentMonth = date.getMonth() + 1;
	currentDate = date.getDate();
	currentHour = date.getHours();

	var currentTime = currentYear.toString() + "/" + currentMonth.toString() + "/" + currentDate.toString() + " " + currentHour.toString() + ":00";


	return currentTime;
}

function getStartTime() {

	// YEAR
	if (currentMonth == 1 && currentDate == 1 && currentHour == 0) { // current time is new year
		startYear = currentYear - 1;
	}
	else {
		startYear = currentYear;
	}

	// MONTH
	if (currentDate == 1 && currentHour == 0) { // first day of a month
		if (currentMonth == 1) { // january
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
	if (currentDate == 1 && currentHour == 0) { // first day of a month
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
	if (currentHour == 0) { // midnight
		startHour = 23;
	}
	else {
		startHour = currentHour - 1;
	}

	// used as startTime
	var time = startYear.toString() + "/" + startMonth.toString() + "/" + startDate.toString() + " " + startHour.toString() + ":00";

	return time;
}


function submitRequest(start, end /*, searchString*/) { // submit 3 queries for 3 different errors. create list of errors to loop through

    /* var searchArray = [searchString];
    console.log('submitting request : ' + searchArray); */

    request.post(
    	'http://calhadoop-vip-a.slc.paypal.com/regex/request',
			//'http://mscalhadoop.qa.paypal.com/regex/request',
    	{
    	json: { // example search input
           "startTime": start,
           "endTime": end,
           "environment":"paypal",
           "pool": "partnerapiplatformserv",
           "dataCenter":"all",
           "machine":"",
           "sampling":"100",
           "regexs": ["INTERNAL_SERVICE_ERROR"],
           "isTransactionSearch":"true",
           "searchMode":"simple",
           "httpCallback": httpCallbackURL,
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

				if (errorCodes < 3) { // while there has not been three error codes returned yet
					console.log(response.statusCode); // error code
					errorCodes++; // give up after three times
					console.log("error code trying again : " + errorCodes);
					submitRequest(start, end /*, searchArray*/); // resubmit request
				}

			}
		}

		else { // if response is null

			if (nullResponse < 3 ) { // same as error codes

				nullResponse++;
				console.log("null trying again : " + nullResponse);
				submitRequest(start, end /*, searchArray */);
			}


		}
	}

)};
