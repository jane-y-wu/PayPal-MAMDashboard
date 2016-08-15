'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Log = require('../../models/log.js');

var router = require("express").Router();
//router.route("/dashboard/:id?").get(getData);

module.exports = function module(app) {

	var service = require('../services/monitoring-service.js')();

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
		},

		getData : function getData(req, res) {
		    Log.find(function (err, schools) {
		        if (err)
		            res.send(err);
		        else
		            res.json(schools);
		    });
		}

	};
};