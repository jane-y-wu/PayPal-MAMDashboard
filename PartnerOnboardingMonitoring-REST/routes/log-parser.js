'use strict'
var mongoose = require('mongoose');
var db = mongoose.connection;
var url = 'mongodb://partner-self-service-6103.ccg21.dev.paypalcorp.com:12345/';

var NUM_ERRORS = 3;

var logSchema = new mongoose.Schema({
	rawLogsUrl : String,
	metaData : {
		Command : {type: String},
		Status : {type: Number},
		Machine : {type: String},
		Type : {type: String},
		Class : {type: String},
		Duration : {type: String},
		Pool : {type: String},
		Timestamp : {type: Date},
	},
	payload: {
		corr_id_: {type: String},
		method: {type: String},
		isLoginable: {type: Boolean},
		hasPartnerRelationships: {type: Boolean},
		channel: {type: String},
		operation: {type: String},
		type: {type: String},
		service: {type: String},
		path: {type: String},
		issue: {type: String},
		partnerAccount: {type: String},
		message: {type: String},
		exception: {type: String}
	}
});

var toParse = "VALIDATION_ERROR\n corr_id_=2f51e107f2ec1&partnerAccount=1177032420632337513&method=POST&isLoginable=true&hasPartnerRelationships=true&channel=API&operation=VALIDATE_US&type=Input Validation Error&service=PartnerApiPlatformServ&path=#/owner_info/phones/@type=='HOME'/national_number&issue=National number must be between 1 to 14 digits long"

//var toParse = "INTERNAL_SERVICE_ERROR\n corr_id_=03b7500ca79a9&partnerAccount=1177032420632337513&method=POST&isLoginable=true&hasPartnerRelationships=true&channel=API&operation=CHECK_EMAIL_ADDRESS_UNIQUE&service=PartnerApiPlatformServ&message=email:not available, but belong to same partner."

/*var toParse = "SERVICE_TIMEOUT\n corr_id_=16ac20755a3b7&partnerAccount=1177032420632337513&method=POST&isLoginable=true&hasPartnerRelationships=true&channel=API&operation=CREATE_SESSION&service=OnboardingApiServ&message=OASReadManager EXCEPTION. &exception=
Unable to perform call
com.ebayinc.platform.jaxrs.resteasy.clienthttpengine.AsyncHttpClientEngine.invoke(AsyncHttpClientEngine.java:130)
com.ebayinc.platform.jaxrs.resteasy.InstrumentationClientEngine.invoke(InstrumentationClientEngine.java:56)
org.jboss.resteasy.client.jaxrs.internal.ClientInvocation.invoke(ClientInvocation.java:407)
org.jboss.resteasy.client.jaxrs.internal.ClientInvocation.invoke(ClientInvocation.java:450)
com.ebayinc.platform.jaxrs.client.resilience.spi.ResilientInvocation.delegateInvoke(ResilientInvocation.java:158)
com.ebayinc.platform.jaxrs.client.resilience.hystrix.HystrixInvocation.access$000(HystrixInvocation.java:36)
com.ebayinc.platform.jaxrs.client.resilience.hystrix.HystrixInvocation$4.run(HystrixInvocation.java:168)
com.netflix.hystrix.HystrixCommand.executeCommand(HystrixCommand.java:1281)
com.netflix.hystrix.HystrixCommand.access$2300(HystrixCommand.java:103)
com.netflix.hystrix.HystrixCommand$5.call(HystrixCommand.java:1186)
com.ebay.kernel.calwrapper.JaxRsClientResilienceHystrixConcurrencyStrategy$1.call(JaxRsClientResilienceHystrixConcurrencyStrategy.java:49)
com.netflix.hystrix.strategy.concurrency.HystrixContextCallable.call(HystrixContextCallable.java:51)
java.util.concurrent.FutureTask.run(FutureTask.java:262)
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
java.lang.Thread.run(Thread.java:744)"*/

var errors = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"];
var errorFields = [
	["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", "type", "service", "path"/*, "message", "exception"*/], // VALIDATION_ERROR
	["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", /*"type", */"service", /*"path", */"message"], // INTERNAL_SERVICE_ERROR
	["corr_id_", "partnerAccount", "method", "isLoginable", "hasPartnerRelationships", "channel", "operation", /*"type", */"service", /*"path", */"message", "exception"] // SERVICE_TIMEOUT
];

var lines = toParse.split("\n");

var errNum = 0;
for (; errNum < NUM_ERRORS; errNum++) {
	if (lines[0].localeCompare(errors[errNum]) == 0) break;
}

if (errNum == NUM_ERRORS) {
	console.log("Error does not match PartnerApiPlatformServ's list of errors.");
	return;
}

console.log("Error: " + errors[errNum]);
mongoose.connect(url);
db.on('error', console.error);
db.once('open', function() {
	var Log = mongoose.model('Log', logSchema);
	var localLog = { payload: {} };

	for (var fieldNum in errorFields[errNum]) {
		var start = errorFields[errNum][fieldNum] + "=";
		var end = "&";
		var fieldVal = lines[1].match(new RegExp(start + "(.*?)" + end));
		if (fieldVal == null) { // edge case: if field is last
			fieldVal = lines[1].match(new RegExp(start + "(.*)"));
		}
		fieldVal = fieldVal[1];
		console.log("field: " + errorFields[errNum][fieldNum]);
		console.log(fieldVal);
		console.log(" ");

		var fieldName = errorFields[errNum][fieldNum];

		if (fieldName.localeCompare("isLoginable") == 0 || fieldName.localeCompare("hasPartnerRelationships") == 0) {
			localLog.payload[fieldName] = (fieldVal === "true");
		}

		localLog.payload[fieldName] = fieldVal;
	}
	var toStore = new Log(localLog);
	console.log(JSON.stringify(toStore, null, 4));
	db.close();
});

