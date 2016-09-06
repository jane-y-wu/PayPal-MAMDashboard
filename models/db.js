'use strict'

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;


mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'}, function(){
    console.log('Mongoose Connected');
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
