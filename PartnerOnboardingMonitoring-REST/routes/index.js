'use strict';

module.exports = function module(app) {

  var monitorApiController = require('./monitor-api-controller')(app);

  app.post('/*',function(req,res,next){
      res.header('Access-Control-Allow-Origin' , '*' );
	console.log(req.url);
      next();
  });

  app.get('/*',function(req,res,next){
      res.header('Access-Control-Allow-Origin' , '*' );
      console.log(req.url);
	next();
  });

  app.get('/api/queryready/', monitorApiController.getDetails);

  // Example URL: http://localhost:3003/api/getLogs/?startDate=2016-07-26T02:45:00&endDate=2016-07-29T11:00:00
  app.post('/api/getLogs/', monitorApiController.returnLogsFiltered);

  app.get('/api/getErrorCount/', monitorApiController.getErrorCount);

  app.get('/api/getSingleLog/', monitorApiController.getSingleLog);

  app.get('/api/testOnline/', monitorApiController.testOnline);

};
