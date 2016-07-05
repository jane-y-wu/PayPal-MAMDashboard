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

	    /*getDetails : function getDetails(req, res, next) {
	    	console.log("getDetails called with jobid: " + req.params.jobid + " !");
	    	service.getDetails(function onGetDetails(err, result) {
	      		if (!err) {
					console.log("callback called")
				} else {
					res.json({
						message : err.message
					});
				}
	    	});
	    }*/


    	/*getDetails : function() {
    		var getRawLogs = function getRawLogs() {
	    		console.log("getRawLogs called");
	    	};

	    	var getDetails = function(req, res, next) {
	    		console.log("getDetails called with jobid: " + req.params.jobid + " !");
		    	service.getDetails(function onGetDetails(err, result) {
		      		if (!err) {
						getRawLogs();
					} else {
						res.json({
							message : err.message
						});
					}
		    	});
		    }
		    return getDetails();
    	}*/
    	getDetails : service.makeGetDetails()

    	// insertMongo()
	};
};
