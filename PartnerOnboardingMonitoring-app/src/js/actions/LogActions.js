import dispatcher from "../dispatcher";

var url1 = 'http://localhost:3003/api/getLogs/?startDate=2016-07-26T02:45:00&endDate=2016-07-29T11:00:00'
var url2 = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?startDate=2016-08-23T02:45:00&endDate=2016-08-29T11:00:00'
var url = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com:3004/api/getLogs/?'

export function getLogs(startDate, endDate) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      dispatcher.dispatch({type: "UPDATE_LOGS", logs: request.responseText});
    } else {
      console.warn('error');
    }
  };

  request.open('POST', url + 'startDate=' + startDate + '&endDate=' + endDate );
  request.send();
}

export function updateSortBy(sortBy) {
  dispatcher.dispatch({type: "UPDATE_SORT_BY", sortBy: sortBy});
}
