import React from 'react';
import _ from 'lodash';

import Logs from './Logs';

import * as LogActions from "../actions/LogActions";
import LogStore from "../stores/LogStore";

export default class LogWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.getLogs = this.getLogs.bind(this);
    this.sortLogs = this.sortLogs.bind(this);
    this.reSortLogs = this.reSortLogs.bind(this);
    this.filterLogs = this.filterLogs.bind(this);
    this.state = {
      LOGS_TO_SHOW: props.logsToShow,
      parsedLogs: [{errName: "loading"}],
      sortBy: "dateObj",
      sortDirection: 1,
      filteredLogs: [],
    };
  }

  componentWillMount() {
    LogStore.on("change", this.getLogs);
    LogStore.on("sortChange", this.reSortLogs);
    //LogStore.on("filterLogs", this.filterLogs);
    LogActions.getLogs();
  }

  componentWillUnmount() {
    LogStore.removeListener("change", this.getLogs);
    LogStore.removeListener("sortChange", this.reSortLogs);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchText !== this.props.searchText || nextProps.searchBy !== this.props.searchBy) {
      this.state.searchBy = nextProps.searchBy;
      this.setState({});
      this.filterLogs(nextProps.searchText);
    }
  }

  filterLogs(searchTerm) {
    var filterFn = function(i){
      for (var j in i) {
        if (i[j].toString().indexOf(searchTerm) !== -1) return true;
      }
      return false;
    };
    if (this.state.searchBy !== "All") {
      var searchBy = this.state.searchBy;
      filterFn = function(i) {
        if (i[searchBy].toString().indexOf(searchTerm) !== -1) return true;
        return false;
      }
    }

    if (searchTerm == "") {
      this.state.filteredLogs = this.state.parsedLogs;
    } else {
      this.state.filteredLogs = _.filter(this.state.parsedLogs, filterFn);
    }
    this.setState({});
  }

  sortLogs(a, b) {
    if (a[this.state.sortBy] < b[this.state.sortBy]) return -1 * this.state.sortDirection;
    if (a[this.state.sortBy] > b[this.state.sortBy]) return 1 * this.state.sortDirection;
    return 0;
  }

  reSortLogs() {
    var toSortBy = LogStore.getSortBy();
    if (this.state.sortBy == toSortBy) {
      this.state.sortDirection *= -1;
    } else {
      this.state.sortBy = toSortBy;
      this.state.sortDirection = 1;
    }
    this.state.parsedLogs.sort(this.sortLogs);
    this.setState({});
  }

  getLogs() {
    var rawLogs = JSON.parse(LogStore.getAll());
    this.state.parsedLogs = [];
    for (var i in rawLogs) {
      if (i >= this.state.LOGS_TO_SHOW && this.state.LOGS_TO_SHOW > 0) break;
      var parsedLog = {};
      parsedLog.rawLogsUrl = rawLogs[i].rawLogsURL;
      parsedLog._id = rawLogs[i]._id;
      for (var j in rawLogs[i].metaData) {
        parsedLog[j] = rawLogs[i].metaData[j];
      }
      for (var k in rawLogs[i].payload) {
        if (k == "Full_Date") continue;
        parsedLog[k] = rawLogs[i].payload[k];
      }
      var rawDate = rawLogs[i].payload.Full_Date;
      var dateObj = new Date(rawDate);
      parsedLog.fullDate = dateObj.getMonth()+1 + "/" + dateObj.getDate() + "/" + dateObj.getFullYear() + " " + dateObj.getHours() + ":";
      if (dateObj.getMinutes() < 10) parsedLog.fullDate += "0";
      parsedLog.fullDate += dateObj.getMinutes();
      this.state.parsedLogs.push(parsedLog);
    }
    this.state.parsedLogs.sort(this.sortLogs);
    this.filterLogs("");
    this.setState({
    });
  }

  render() {
    return(
      <Logs logsToShow={this.state.LOGS_TO_SHOW} logData={this.state.filteredLogs} sortBy={this.state.sortBy} sortDirection={this.state.sortDirection}/>
    )
  }
}
