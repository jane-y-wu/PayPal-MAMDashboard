'use strict';

module.exports = function module(app) {

  var monitoringController = require('./monitoring-controller')(app);

  app.get('/', monitoringController.showDashboard);

};