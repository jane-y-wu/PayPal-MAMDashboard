var mongoose = require("mongoose");

var simpleApiCallSchema = new mongoose.Schema({
	date: Date,
	partner_id: String,
	payload: String
});
var ApiCall = mongoose.model('ApiCall', simpleApiCallSchema);

module.exports = {
	ApiCall: ApiCall
}
