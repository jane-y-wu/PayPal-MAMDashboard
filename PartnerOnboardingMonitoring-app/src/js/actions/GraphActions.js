import dispatcher from "../dispatcher";

//var url = 'http://localhost:3003/api/returnCount/?startDate=2016-07-01T07:00:00Z&endDate=2016-10-31T07:00:00Z&error=INTERNAL_SERVICE_ERROR'

export function updateGraph(startDate, endDate) {

	var url = 'http://localhost:3003/api/returnCount/?startDate=' + startDate + '&endDate=' + endDate + '&error=INTERNAL_SERVICE_ERROR';
	var request = new XMLHttpRequest();
	request.onreadystatechange = (e) => {
		if (request.readyState !==4) { // DON'T EXACTLY UNDERSTAND THIS LINE
			return;
		}

		if (request.status === 200) {
			dispatcher.dispatch({type: "REFRESH_GRAPH", data: request.responseText});
			console.log("request's response text is " + request.responseText);
		} else {
			console.warn('error');
		}
	};

	request.open('GET', url);
	request.send();
	
}