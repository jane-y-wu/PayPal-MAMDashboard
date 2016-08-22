'use strict'

function generateDate() {
	var newDate = new Date(Date.now());
	newDate.setMinutes(Math.floor(Math.random() * 60));
	//var now = Date.now();
	newDate.setHours(newDate.getHours() - 1);
	return newDate;
}

var fakeDataObject = [
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Type : "Validation",
			Status : 2,
			Name : "VALIDATION_ERROR",
			corr_id_: "2f51e107f2ec1",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "VALIDATE_US",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			path: "#/owner_info/phones/@type=='HOME'/national_number",
			issue: "National number must be between 1 to 14 digits long",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Type : "Validation",
			Status : 2,
			Name : "VALIDATION_ERROR",
			corr_id_: "2f51e107f2ec1",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "VALIDATE_US",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			path: "#/owner_info/phones/@type=='HOME'/national_number",
			issue: "National number must be between 1 to 14 digits long",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Type : "Validation",
			Status : 2,
			Name : "VALIDATION_ERROR",
			corr_id_: "2f51e107f2ec1",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "VALIDATE_US",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			path: "#/owner_info/phones/@type=='HOME'/national_number",
			issue: "National number must be between 1 to 14 digits long",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "INTERNAL_SERVICE_ERROR",
			corr_id_: "03b7500ca79a9",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CHECK_EMAIL_ADDRESS_UNIQUE",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			issue: "email:not available, but belong to same partner",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "INTERNAL_SERVICE_ERROR",
			corr_id_: "03b7500ca79a9",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CHECK_EMAIL_ADDRESS_UNIQUE",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			issue: "email:not available, but belong to same partner",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "INTERNAL_SERVICE_ERROR",
			corr_id_: "03b7500ca79a9",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CHECK_EMAIL_ADDRESS_UNIQUE",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			issue: "email:not available, but belong to same partner",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "INTERNAL_SERVICE_ERROR",
			corr_id_: "03b7500ca79a9",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CHECK_EMAIL_ADDRESS_UNIQUE",
			type: "Input Validation Error",
			service: "PartnerApiPlatformServ",
			issue: "email:not available, but belong to same partner",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "SERVICE_TIMEOUT",
			corr_id_: "16ac20755a3b7",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CREATE_SESSION",
			service: "OnboardingApiServ",
			issue: "OASReadManager EXCEPTION.",
			partnerAccount: "1177032420632337513"
		}
	},
	{
		rawLogsURL : "http://calhadoop-vip-a.slc.paypal.com/logviewui/environment/paypal/pool/partnerapiplatformserv/machine/dcg12partnerapiplatformserv6508/rawLogs?datetime=2016/07/28 10:22&thread=0x96&evt=1469726564044&key=102240:3:1525&colo=dcg12",
		metaData : {
			Machine : "dcg12partnerapiplatformserv6508",
			Pool : "partnerapiplatformserv",
			Data_Center : "dcg12",
		},
		payload: {
			Class : "E",
			Full_Date : generateDate(),
			Status : 2,
			Name : "SERVICE_TIMEOUT",
			corr_id_: "16ac20755a3b7",
			method: "POST",
			isLoginable: true,
			hasPartnerRelationships: true,
			channel: "API",
			operation: "CREATE_SESSION",
			service: "OnboardingApiServ",
			issue: "OASReadManager EXCEPTION.",
			partnerAccount: "1177032420632337513"
		}
	}
]

module.exports = {
	fakeDataObject : fakeDataObject
}
