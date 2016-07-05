'use strict';

module.exports = function module() {

	return {
		processCalResult : function processCalResult(id, callback) {
			// do your processing here
			callback(null, {
				"response" : "ok"
			});
		},

		addLogCategory : function addLogCategory(id, callback) {
			// do your processing here
			callback(null, {
				"response" : "ok"
			});
		},

		getAllCalLogs : function getAllCalLogs(callback) {
			// do your processing here
			callback(null, {
				"payload" : [ "payload1", "payload2" ]
			});
		},

		getDetails : function getDetails(callback) {
			// do your processing here
			callback();
		},

		makeGetDetails : function() {
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
    	}
	};
};