'use strict';

module.exports = function module(app) {

  var monitorApiController = require('./monitor-api-controller')(app);

  // REST API routes
  app.get('/api/process/cal-result/:id', monitorApiController.processCalResult);
  app.post('/api/add/log-category/:category', monitorApiController.addLogCategory);
  app.get('/api/logs/all', monitorApiController.getAllCalLogs);

  app.get('/api/queryready/:jobID', monitorApiController.getDetails);
  app.get('/api/test', monitorApiController.testCall);
  //app.get('/api/queryready/{jobID}', monitorApiController.getDetails2);
  //app.get('/api/queryready/?id={jobID}', monitorApiController.getDetails3);
  app.get('/queryready', function (req, res, next){
  	console.log("job id with getDetails4: " + req.query.id);
  });

  // app.param('id', function (req, res, next, id){
  // 	console.log("job id in param: " + id);
  // });
};