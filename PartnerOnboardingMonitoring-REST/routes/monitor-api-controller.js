'use strict';



module.exports = function module(app) {

	// var service = require('../services/monitor-api-service.js')();
	var service = require('../services/monitor-api-service-parse-test.js')();
	var aggregation = require('../services/monitor-api-service-aggregation.js')();

	return {
		test : function test(req, res, next) {
			console.log("test called");
			res.end("test called");


			var dateTest = new Date(2016, 9, 1);

			
			var error;
			var errorType = req.query.error;
			if (errorType == 1) {
				error = 'INTERNAL_SERVICE_ERROR';
			}
			else if (errorType == 2) {
				error = 'SERVICE_TIMEOUT';
			}
			else {
				error = 'VALIDATION_ERROR';
			}

			aggregation.storeCount(3, error, dateTest);

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
		    }

		    var getRawLogs = function getRawLogs(details) {
	    		console.log("getRawLogs called!");
	    		service.getRawLogs(details, function onGetRawLogs(/*details*/ errorNum, errorType, d, db) {
	    			//insertMongo(metadata, payload);
				console.log("ABOUT TO AGGREGATE WOW");
				aggregation.storeCount(errorNum, errorType, d, db);
	    			console.log("COMPLETE");

	    		});
	    	};

	    	// var insertMongo = function(record, payload) {
    		// 	console.log("insertMongo called!");
    		// 	service.insertMongo(record, payload);
    		// };

		    return getDetails(req, res, next);
    	},

    	displayAll : function displayAll(req, res, next) {
    		console.log("displayAll called!");
    		service.displayAll(function onDisplayAll(){
    			console.log("ALL DISPLAYED");
    		});
    	}
	};
};
