import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import Divider from 'material-ui/Divider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as LogActions from "../actions/LogActions";
import LogStore from "../stores/LogStore";

export default class SingleLog extends React.Component {

  constructor(props) {
    super(props);
    this.getLog = this.getLog.bind(this);
    this.state = {
      singleLog: "",
      logKeys: []
    };
  }

  componentWillMount() {
    this.state.logID = this.props.params.logID;
    this.setState({
    })
    LogStore.on("singleLogChange", this.getLog);
    LogActions.getSingleLog(this.state.logID);
  }

  getLog() {
    var singleLog = JSON.parse(LogStore.getSingleLog());
    var parsedLog = {};
    parsedLog.rawLogsUrl = singleLog.rawLogsURL;
    parsedLog._id = singleLog._id;
    for (var j in singleLog.metaData) {
      parsedLog[j] = singleLog.metaData[j];
    }
    for (var k in singleLog.payload) {
      if (k == "Full_Date") continue;
      parsedLog[k] = singleLog.payload[k];
    }
    var rawDate = singleLog.payload.Full_Date;
    var dateObj = new Date(rawDate);
    //parsedLog.dateObj = dateObj;
    parsedLog.fullDate = dateObj.getMonth() + "/" + dateObj.getDay() + "/" + dateObj.getFullYear() + " " + dateObj.getHours() + ":";
    if (dateObj.getMinutes() < 10) parsedLog.fullDate += "0";
    parsedLog.fullDate += dateObj.getMinutes();
    this.state.singleLog = parsedLog;

    var keys = []
    for (var i in this.state.singleLog) if(i != "_id") keys.push(i);
    this.state.logKeys = keys;
    this.setState({});
  }

  render() {

    const singleLogStyle = {
      padding: "2%"
    }

    const smallTableStyle = {
      padding: "10px"
    }

    const keyStyle = {
      color: "grey"
    }

    const fieldStyle = {
      width: "100%",
      overflow: "auto",
      wordWrap: "break-word",
      color: "black"
    }

    const dividerStyle = {
      width: "70%"
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div style={singleLogStyle}>
          <h3>
            Full Log Details
          </h3>
          {this.state.logKeys.map( (key, index) => (
            <div style={smallTableStyle}>
              <div style={keyStyle}>
                {key}
              </div>
              <Divider style={dividerStyle}/>
              <div style={fieldStyle}>
                {this.state.singleLog[key]}
              </div>
            </div>
          ))}
        </div>
      </MuiThemeProvider>
    );
  }
}
