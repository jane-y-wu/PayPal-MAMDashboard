var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

var simpleApiCallSchema = new mongoose.Schema({
        date: Date,
        partner_id: String,
        payload: String
});
var ApiCall = mongoose.model('ApiCall', simpleApiCallSchema);


