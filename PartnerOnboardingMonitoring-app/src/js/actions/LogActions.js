import dispatcher from "../dispatcher";

var serverURL = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com';
var portNo = '3004';

export function getLogs(startDate, endDate) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('Get Logs Success', request.responseText);
      dispatcher.dispatch({type: "UPDATE_LOGS", logs: request.responseText});
    } else {
      console.warn('error');
    }
  };

  request.open('POST', serverURL + ':' + portNo + '/api/getLogs/?' + 'startDate=' + startDate + '&endDate=' + endDate);
  request.send();
}

export function updateSortBy(sortBy) {
  dispatcher.dispatch({type: "UPDATE_SORT_BY", sortBy: sortBy});
}

export function getSingleLog(logID) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('Get Single Log Success', request.responseText);
      dispatcher.dispatch({type: "GET_SINGLE_LOG", log: request.responseText});
    } else {
      console.warn('error');
    }
  };

  request.open('GET', serverURL + ':' + portNo + '/api/getSingleLog/?logID=' + logID);
  request.send();
}
