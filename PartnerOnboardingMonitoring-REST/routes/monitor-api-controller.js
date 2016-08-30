'use strict';

module.exports = function module(app) {

	var service = require('../services/monitor-api-service.js')();
	var aggregation = require('../services/monitor-api-service-aggregation.js')();

	return {
		test : function test(req, res, next) {
			console.log("test called");


			var date = new Date(2016, 7, 14, 2, 15);
			if (req.query.id == 1) { // internal service error

				aggregation.storeCount(2, "INTERNAL_SERVICE_ERROR", date);
				console.log(date);
			}

			else if (req.query.id == 2) { // validation error

				aggregation.storeCount(3, "VALIDATION_ERROR", date);
				console.log(date);
			}

			else if (req.query.id == 3) { // service timeout

				aggregation.storeCount(2, "SERVICE_TIMEOUT", date);
				console.log(date);
			}

			res.end("test called");
		},

  	getDetails : function getDetailsClosure(req, res, next) {
  		// This is a closure, which allows you to pass in any of these functions in a callback when calling a function in
  		// monitor-api-services.

    	var getDetails = function(req, res, next) { // Starts here. Calls service.getDetails with onGetDetails as a callback
    		if (req.query.status == "SUBMITTED") {
    			console.log("Query with job id: " + req.query.id + " submitted.");
    			res.end();
    		} else if (req.query.status == "SUCCEEDED") {
    			console.log("Query with job id: " + req.query.id + " succeeded.");
    			res.end();

		    	service.getDetails(req.query.id, function onGetDetails(details) {
		      		getRawLogs(details);
		    	});
				} else {
					console.log("Unknown status: " + req.query.status + ", ID: " + req.query.id);
					res.end();
				}
	    };

	    var getRawLogs = function getRawLogs(details) {
    		console.log("getRawLogs called!");
    		service.getRawLogs(details, function onGetRawLogs(/*details*/ errorNum, errorType, d) {
    			//insertMongo(metadata, payload);
					aggregation.storeCount(errorNum, errorType, d);
    			console.log("COMPLETE");

    		});
    	};

	    return getDetails(req, res, next);
  	},

  	returnLogs : function returnLogs(req, res, next) {
  		console.log("returnLogs called!");

			console.log(req.query.startDate);
			var startDate = new Date(req.query.startDate);
			startDate.setHours(startDate.getHours());
			console.log("startDate: " + startDate);
			var endDate = new Date(req.query.endDate);
			endDate.setHours(endDate.getHours());
			console.log("endDate: " + endDate);

			service.returnLogs(startDate, endDate, [], function(logs){
				res.end(JSON.stringify(logs, null, 4));
			});
  	},

		returnLogsFiltered : function returnLogsFiltered(req, res, next) {
			console.log("returnLogsFiltered called!");

				console.log(req.query.startDate);
				var startDate = new Date(req.query.startDate);
				startDate.setHours(startDate.getHours()); // hacky way of doing it TODO fix so time zone isn't hardcoded in
				console.log("startDate: " + startDate);
				var endDate = new Date(req.query.endDate);
				endDate.setHours(endDate.getHours());
				console.log("endDate: " + endDate);

			service.returnLogs(startDate, endDate, req.body.filters, function(logs){
				res.end(JSON.stringify(logs, null, 4));
			});
		},

		getErrorCount : function getErrorCount(req, res, next) {
			console.log("getErrorCount called!");

			var start = req.query.startDate;
			var end = req.query.endDate;
			var errorType = req.query.error;

			console.log("start is " + start + " and end is " + end);

			aggregation.getErrorCount(start, end, errorType, function (response) {
				res.end(response);
			});

		},

		getSingleLog : function getSingleLog(req, res, next) {
			console.log(JSON.stringify(req.query));
			service.getSingleLog(req.query.logID, function(log){
				res.end(JSON.stringify(log, null, 4));
			});
		}

	};
};
