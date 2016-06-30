'use strict';

module.exports = function module(app) {

	var service = require('../services/monitoring-service.js')
			(app.locals.todos);

	return {
		showDashboard : function showDashboard(req, res, next) {
			console.log("showDashboard called");
			//access HTTP req, res here. req can be used to get query parameters
			service.getDashboardData(function onDashboardReady(err, dashboardData) {
				// This callback is called by service when it's done processing
				if (!err) {
					return res.render('index', {
						dashboardData : dashboardData
					});
				}
				res.send(500);
			});
		}

	};
};