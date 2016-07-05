'use strict';

module.exports = function module(app) {

  var monitorApiController = require('./monitor-api-controller')(app);

  // REST API routes
  app.get('/api/process/cal-result/:id', monitorApiController.processCalResult);
  app.post('/api/add/log-category/:category', monitorApiController.addLogCategory);
  app.get('/api/logs/all', monitorApiController.getAllCalLogs);
  // app.get('/api/querysent', monitorApiController.awaitSherlock); this function should not be necessary
  
  app.get('/api/queryready/:jobid', monitorApiController.getDetails);
};