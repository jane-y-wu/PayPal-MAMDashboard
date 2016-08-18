'use strict';

module.exports = function module(app) {

	var service = require('../services/monitor-api-service.js')();
	var aggregation = require('../services/monitor-api-service-aggregation.js')();

	return {
		test : function test(req, res, next) {
			console.log("test called");
			res.end("test called");
		},

		processCalResult : function processCalResult(req, res, next) {
			console.log("processCalResult called with " + req.params.id)

			service.processCalResult(req.params.id,
					function onProcessCalResult(err, result) {
						if (!err) {
							return res.json(result);
						}
						res.json({
							message : err.message
						});
					});
		},

		addLogCategory : function addLogCategory(req, res, next) {
			console.log("addLogCategory called with " + req.params.category)
			service.addLogCategory(req.params.category, function onAddLogCategory(
					err, result) {
				if (!err) {
					return res.json(result);
				}
				res.json({
					message : err.message
				});
			});
		},

		getAllCalLogs : function getAllCalLogs(req, res, next) {
			console.log("getAllCalLogs called")
			service.getAllCalLogs(function onFetchAllCalLogs(err, result) {
				if (!err) {
					return res.json(result);
				}
				res.json({
					message : err.message
				});
			});
		},


    	getDetails : function getDetailsClosure(req, res, next) {
    		// This is a closure, which allows you to pass in any of these functions in a callback when calling a function in
    		// monitor-api-services.
    		console.log("in get details");

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
				startDate.setHours(startDate.getHours() + 7); // hacky way of doing it TODO fix so time zone isn't hardcoded in
				console.log("startDate: " + startDate);
				var endDate = new Date(req.query.endDate);
				endDate.setHours(endDate.getHours() + 7);
				console.log("endDate: " + endDate);

				service.returnLogs(startDate, endDate, [], function(logs){
					res.end(JSON.stringify(logs, null, 4));
				});
    	},

		returnLogsFiltered : function returnLogsFiltered(req, res, next) {
			console.log("returnLogsFiltered called!");

				console.log(req.query.startDate);
				var startDate = new Date(req.query.startDate);
				startDate.setHours(startDate.getHours() + 7); // hacky way of doing it TODO fix so time zone isn't hardcoded in
				console.log("startDate: " + startDate);
				var endDate = new Date(req.query.endDate);
				endDate.setHours(endDate.getHours() + 7);
				console.log("endDate: " + endDate);

			service.returnLogs(startDate, endDate, req.body.filters, function(logs){
				res.end(JSON.stringify(logs, null, 4));
			});
		},

		returnCount : function returnCount(req, res, next) {
			console.log("returnCount called!");

			var start = req.query.startDate;
			var end = req.query.endDate;
			var errorType = req.query.error;

			console.log("start is " + start + " and end is " + end);

			aggregation.returnCount(start, end, errorType, function(response) {
				res.end(response);
			});
		}
	};
};
