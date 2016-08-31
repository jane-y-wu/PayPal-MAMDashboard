import dispatcher from "../dispatcher";

//var url = 'http://localhost:3003/api/getErrorCount/?startDate=2016-07-01T07:00:00Z&endDate=2016-10-31T07:00:00Z&error=INTERNAL_SERVICE_ERROR'

export function updateGraph(startDate, endDate, errorType) {

	//var url = 'http://localhost:3003/api/getErrorCount/?startDate=' + startDate + '&endDate=' + endDate + '&error=' + errorType;
	var c3url = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3003/api/getErrorCount/?startDate=' + startDate + '&endDate=' + endDate + '&error=' + errorType;
  var url = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getErrorCount/?startDate=' + startDate + '&endDate=' + endDate + '&error=' + errorType;
  var request = new XMLHttpRequest();
	request.onreadystatechange = (e) => {
		if (request.readyState !==4) {
			return;
		}

		if (request.status === 200) {
			dispatcher.dispatch({type: "REFRESH_GRAPH", data: request.responseText});
		} else {
			console.warn('error');
		}
	};

	request.open('GET', url);
	request.send();

}
