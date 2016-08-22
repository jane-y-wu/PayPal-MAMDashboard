import React from 'react';

import Logs from './Logs';

import * as LogActions from "../actions/LogActions";
import LogStore from "../stores/LogStore";

export default class LogWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.getLogs = this.getLogs.bind(this);
    this.state = {
      LOGS_TO_SHOW: props.logsToShow,
      parsedLogs: [{errName: "loading"}],
    };
  }

  componentWillMount() {
    LogStore.on("change", this.getLogs);
    LogActions.getLogs();
  }

  componentWillUnmount() {
    LogStore.removeListener("change", this.getLogs);
  }

  getLogs() {
    var rawLogs = JSON.parse(LogStore.getAll());
    this.state.parsedLogs = [];
    console.log(this.state.LOGS_TO_SHOW);
    for (var i in rawLogs) {
      if (i >= this.state.LOGS_TO_SHOW && this.state.LOGS_TO_SHOW > 0) break;
      var parsedLog = {
        errName: rawLogs[i].payload.Name,
        // fullDate: rawLogs[i].payload.Full_Date,
        issue_message: rawLogs[i].payload.issue,
        rawLogsURL : rawLogs[i].rawLogsURL,
        Machine: rawLogs[i].metaData.Machine,
        Pool: rawLogs[i].metaData.Pool,
        Data_Center: rawLogs[i].metaData.Data_Center,
        corr_id_: rawLogs[i].payload.corr_id_,
        operation: rawLogs[i].payload.operation,
      };
      var rawDate = rawLogs[i].payload.Full_Date;
      var dateObj = new Date(rawDate);
      parsedLog.dateObj = dateObj;
      parsedLog.fullDate = dateObj.getMonth() + "/" + dateObj.getDay() + "/" + dateObj.getFullYear() + " " + dateObj.getHours() + ":";
      if (dateObj.getMinutes() < 10) parsedLog.fullDate += "0";
      parsedLog.fullDate += dateObj.getMinutes();
      //parsedLog.fullDate = dateObj.toLocaleString();
      this.state.parsedLogs.push(parsedLog);
    }
    this.setState({
    });
    console.log(this.state.parsedLogs);
  }

  render() {
    return(
      <Logs logsToShow={this.state.LOGS_TO_SHOW} logData={this.state.parsedLogs}/>
    )
  }
}