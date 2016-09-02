var assert = require('assert');
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var app = express();


describe('Server', function(){
  before(function() {
    app.set('port', process.env.PORT || 3004);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    require('../routes')(app);

    http.createServer(app).listen(app.get('port'), function onListening() {
    	console.log('Express server listening on port ' + app.get('port'));
    });
  });
  describe('/queryready', function(){
    it('should return 200 when no status query param provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/queryready/', function(res){
        assert.equal(200, res.statusCode);
        done();
      });
    });

    it('should return Status: SUBMITTED when SUBMITTED status query param provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/queryready/?id=123&status=SUBMITTED', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal('Status: SUBMITTED', data);
          done();
        });
      });
    });

    it('should return Status: SUCCEEDED when SUCCEEDED query param provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/queryready/?id=123&status=SUCCEEDED', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal('Status: SUCCEEDED', data);
          done();
        });
      });
    });

    it('should return Unknown Status when gibberish query param provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/queryready/?id=123&status=gibberish', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal('Unknown Status', data);
          done();
        });
      });
    });

    it('should return No job id when no id query param provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/queryready/?status=gibberish', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal('No job id', data);
          done();
        });
      });
    });
  });


  describe('/getLogs', function() {
    it('should return empty array if no start date provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?endDate=2016-07-29T11:00:00', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal([], data);
          done();
        });
      });
    });

    it('should return empty array if no end date provided', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?startDate=2016-07-26T02:45:00', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal([], data);
          done();
        });
      });
    });

    it('should return empty array if start date is after end date', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?startDate=2016-07-29T02:45:00&endDate=2016-07-26T11:00:00', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal([], data);
          done();
        });
      });
    });

    it('should return empty array if start date or end date are formatted incorrectly', function(done){
      http.get('http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?startDate=2016-07-2602:45:00&endDate=2016-07-29T000', function(res){
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        });

        res.on('end', function () {
          assert.equal([], data);
          done();
        });
      });
    });

  });

})



// if ('development' === app.get('env')) {
// 	app.use(errorHandler);
// 	app.locals.pretty = true;
// }
