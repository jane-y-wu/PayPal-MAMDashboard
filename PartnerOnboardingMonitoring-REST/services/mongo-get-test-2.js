var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:H9yu7Xn+WD!Ru6Dc_thvxtU7c7AKDuHy292x@10.25.39.2:27017';
var Log = require('../../models/log').Log;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

MongoClient.connect(url, function(err, db) {
  if(err) console.log(err);
  var toStore = new Log({rawLogsURL : "www.fakeurl.com"});
	toStore.save(function(err, result){
		if(err) console.log(err);
		console.log("Inserted Document: " + JSON.stringify(result));

		// Log.findOne({ rawLogsURL : "www.fakeurl.com"}, function (err, result) {
		// 	console.log("mongodb query returned!");
		// 	if (err) console.log(err);
		// 	console.log(JSON.stringify(result, null, 4));
		// 	db.close();
		// });

	});
  db.close();
})
