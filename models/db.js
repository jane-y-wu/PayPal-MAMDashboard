'use strict'

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongodb = require('mongodb');
//var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
//var url = 'localhost:27017';
var url = 'mongodb://10.25.39.2:27017/admin';
mongoose.Promise = global.Promise;
//mongoose.connect(url);

mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'}, function(){
    console.log('Mongoose Connected');
});
// mongoose.connect(url, function(){
//     console.log('mongoose connected');
// })
module.exports = mongoose;
