'use strict';

module.exports = function module(app) {

	var service = require('../services/monitor-api-service.js')();
	var aggregation = require('../services/monitor-api-service-aggregation.js')();

	return {

  	getDetails : function getDetailsClosure(req, res, next) {
  		// This is a closure, which allows you to pass in any of these functions in a callback when calling a function in
  		// monitor-api-services.

    	var getDetails = function(req, res, next) { // Starts here. Calls service.getDetails with onGetDetails as a callback
				if (req.query.id){
	    		if (req.query.status == "SUBMITTED") {
	    			console.log("Query with job id: " + req.query.id + " submitted.");
	    			res.end("Status: SUBMITTED");
	    		} else if (req.query.status == "SUCCEEDED") {
	    			console.log("Query with job id: " + req.query.id + " succeeded.");
	    			res.end("Status: SUCCEEDED");

			    	service.getDetails(req.query.id, function onGetDetails(details) {
			      		getRawLogs(details);
			    	});
					} else {
						console.log("Unknown status: " + req.query.status + ", ID: " + req.query.id);
						res.end("Unknown Status");
					}
				} else {
					console.log("No job id provided");
					res.end("No job id")
				}
	    };

	    var getRawLogs = function getRawLogs(details) {
    		service.getRawLogs(details, function onGetRawLogs(errorNum, errorType, d) {
					aggregation.storeCount(errorNum, errorType, d);
    			console.log("Logs pulled from CAL and stored in MongoDB!");

    		});
    	};

	    return getDetails(req, res, next);
  	},

		returnLogsFiltered : function returnLogsFiltered(req, res, next) {

			console.log("In return logs filtered");
			if (typeof req.query.startDate === 'undefined' || typeof req.query.endDate === 'undefined') {
				res.end('[]');
			} else {
				var startDate = new Date(req.query.startDate);
				//startDate.setHours(startDate.getHours());
				var endDate = new Date(req.query.endDate);
				//endDate.setHours(endDate.getHours());

				service.returnLogs(startDate, endDate, req.body.filters, function(logs){
					res.end(JSON.stringify(logs, null, 4));
				});
			}
		},

		getErrorCount : function getErrorCount(req, res, next) {

			var start = req.query.startDate;
			var end = req.query.endDate;
			var errorType = req.query.error;


			aggregation.getErrorCount(start, end, errorType, function (response) {
				res.end(response);
			});

		},

		getSingleLog : function getSingleLog(req, res, next) {
			service.getSingleLog(req.query.logID, function(log){
				res.end(JSON.stringify(log, null, 4));
			});
		},

		testOnline: function testOnline(req, res, next) {
			console.log("test online called");
			res.end("Online!");
		}

	};
};
