'use strict';

module.exports = function module(app) {

  var monitorApiController = require('./monitor-api-controller')(app);


  app.get('/api/queryready/', monitorApiController.getDetails);
  app.get('/api/getLogs/', monitorApiController.returnLogs); //Example URL: http://localhost:3003/api/getLogs/?startDate=2016-07-26T02:45:00&endDate=2016-07-29T11:00:00
};
