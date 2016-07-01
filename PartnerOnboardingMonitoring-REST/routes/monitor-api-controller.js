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
		}
	};
};