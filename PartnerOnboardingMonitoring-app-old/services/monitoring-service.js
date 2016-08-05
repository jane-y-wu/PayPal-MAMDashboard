'use strict';


module.exports = function module() {

	return {
		getDashboardData : function getDashboardData(callback) {
			var mockDashboardData = {"title":"coming soon.."}
			callback(null, mockDashboardData);
		}
	};
};
