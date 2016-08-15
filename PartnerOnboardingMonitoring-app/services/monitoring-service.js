'use strict';

var $ = require("jquery");
var promise = require("es6-promise");
var resourceUrl = "http://localhost:8003/api/dashboard";
module.exports = function module() {

	return {
		getDashboardData : function getDashboardData(callback) {
			var mockDashboardData = {"title":"coming soon.."}
			callback(null, mockDashboardData);
		},


	    getData : function getData() {
	        var Promise = promise.Promise;
	        return new Promise(function (resolve, reject) {
	            $.ajax({
	                url: resourceUrl,
	                method: "GET",
	                dataType: "json",
	                success: resolve,
	                error: reject
	            });
	        });
	    }
		
	};
};
