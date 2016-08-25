import React from "react";
import { Link } from "react-router";
import Header from "./Header";

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as LogActions from "../actions/LogActions";
import LogStore from "../stores/LogStore";

export default class SingleLog extends React.Component {

  constructor(props) {
    super(props);
    this.getLog = this.getLog.bind(this);
    this.state = {
      singleLog: ""
    };
  }

  componentWillMount() {
    this.setState({
      logID: this.props.params.logID
    })
    LogStore.on("singleLogChange", this.getLog);
    LogActions.getSingleLog(this.state.logID);
  }

  getLog() {
    this.state.singleLog = LogStore.getSingleLog();
    this.setState({});
  }

  render() {

    return (
      <div>
        {this.state.logID}
        {this.state.singleLog}
      </div>
    );
  }
}
