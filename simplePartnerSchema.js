var mongoose = require("mongoose");

var simplePartnerSchema = new mongoose.Schema({
	partner_id: string,
	partner_name: string
});
