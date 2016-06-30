'use strict';

module.exports = function module(app) {

  var service = require('../services/monitor-api-service.js');

  return {
	  processCalResult : function processCalResult(req, res, next) {
      service.processCalResult(req.params.id, function onProcessCalResult(err, result) {
        if (!err) {
          return res.json(result);
        }
        res.json({
          message : err.message
        });
      });
    },

    addLogCategory : function addLogCategory(req, res, next) {
      service.addLogCategory(req.params.id, function onAddLogCategory(err, result) {
        if (!err) {
          return res.json(result);
        }
        res.json({
          message : err.message
        });
      });
    },

    getAllCalLogs : function getAllCalLogs(req, res, next) {
      service.getAllCalLogs(function onFetchAllCalLogs(err, result) {
        if (!err) {
          return res.json(result);
        }
        res.json({
          message : err.message
        });
      });
    }
  };
};