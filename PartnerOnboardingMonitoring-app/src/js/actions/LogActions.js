import dispatcher from "../dispatcher";

var url = 'http://localhost:3003/api/getLogs/?startDate=2016-07-26T02:45:00&endDate=2016-07-29T11:00:00'

export function getLogs() {
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

  request.open('POST', url);
  request.send();
}
