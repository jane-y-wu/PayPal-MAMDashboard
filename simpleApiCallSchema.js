var mongoose = require("mongoose");

var simpleApiCallSchema = new mongoose.Schema({
	date: Date,
	partner_id: String,
	payload: String
});
