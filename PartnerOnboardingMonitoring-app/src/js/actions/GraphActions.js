import dispatcher from "../dispatcher";

export function updateGraph() {

	dispatcher.dispatch({type: "REFRESH_GRAPH" /*, logs: request.responseText*/});
}