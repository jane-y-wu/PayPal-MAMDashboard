'use strict';

module.exports = function module(app) {

	var service = require('../services/monitor-api-service.js')();

	return {
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

	    	var getDetails = function(req, res, next) { // Starts here. Calls service.getDetails with onGetDetails as a callback
	    		if (req.query.status == "SUBMITTED") {
	    			console.log("Query with job id: " + req.query.id + " submitted.");
	    			res.end();
	    		} else if (req.query.status == "SUCCEEDED") {
	    			console.log("Query with job id: " + req.query.id + " succeeded.");
	    			res.end();
			    	service.getDetails(req.params.jobID, function onGetDetails(details, rawLogsURL) {
			      		getRawLogs(details, rawLogsURL);
			    	});
			    }
		    }

		    var getRawLogs = function getRawLogs(details, rawLogsURL) {
	    		console.log("getRawLogs called!");
	    		service.getRawLogs(details, rawLogsURL, function onGetRawLogs(details, payload) {
	    			insertMongo(details, payload);
	    		});
	    	};

	    	var insertMongo = function(details, payload) {
    			console.log("insertMongo called!");
    			service.insertMongo(details, payload);
    		};

		    return getDetails(req, res, next);
    	}
	};
};
