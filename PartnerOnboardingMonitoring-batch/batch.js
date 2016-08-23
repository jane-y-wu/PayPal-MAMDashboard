var request = require('request'); // require request
var schedule = require('node-schedule');
var async = require('async');
var moment = require('moment');
var jobID; // string to hold job ID
var regexsField = ['INTERNAL_SERVICE_ERROR', 'VALIDATION_ERROR', 'SERVICE_TIMEOUT'/*, 'HEADERS_STATUS_DELIVERED'*/]; // expressions to search for in the CAL log
var errorCodes = 0; // number of times CAL returns an error code
var nullResponse = 0; // number of times the response is null
var alexC3 = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com'; // for testing purposes
var madhavC3 = 'http://partner-onboarding-monitor-9745.ccg21.dev.paypalcorp.com';
var httpCallbackURL;
var option = process.argv[2];

// for testing purposes: option a to use alex's C3, m for madhav's
if (option == 'a') {
	httpCallbackURL = alexC3 + ":3003/api/queryready/?id=$id&status=$status";
}
else if (option == 'm') {
	httpCallbackURL = madhavC3 + ":3003/api/queryready/?id=$id&status=$status";
}
else { // default
    httpCallbackURL = madhavC3 + ":3003/api/queryready/?id=$id&status=$status";
}

console.log(httpCallbackURL);

var rule = new schedule.RecurrenceRule();
rule.minute = 1; // runs every hour; one minute past the new hour for a slight delay

//var interval = schedule.scheduleJob(rule, run);
run();

function run() { // runs all the needed functions

	endTime = moment().startOf('hour').format('YYYY/MM/DD HH:mm');
	startTime = moment().subtract(1, 'hours').startOf('hour').format('YYYY/MM/DD HH:mm');

	console.log('start time : ' + startTime + '; end time : ' + endTime);

	async.each(regexsField, function(searchString, callback) {
		submitRequest(startTime, endTime, searchString);
		},
		function(err) {});
	//submitRequest(startTime, endTime);

	nullResponse = 0;
	errorCodes = 0;
}

function submitRequest(start, end, searchString) { // submit 3 queries for 3 different errors. create list of errors to loop through

    var searchArray = [searchString];
    console.log('submitting request : ' + searchArray);

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
        	"regexs": /*["ResponseCode=200"], */searchArray,
        	"isTransactionSearch":"false",
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
					submitRequest(start, end , searchArray); // resubmit request
				}

			}
		}

		else { // if response is null

			if (nullResponse < 3 ) { // same as error codes

				nullResponse++;
				console.log("null trying again : " + nullResponse);
				submitRequest(start, end , searchArray);
			}


		}
	}

)};
