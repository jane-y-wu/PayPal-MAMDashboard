import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var moment = require('moment');

import * as LogActions from "../actions/LogActions";
import * as GraphActions from "../actions/GraphActions";

export default class DateRange extends React.Component {
    constructor() {
      super();
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.setStartTime = this.setStartTime.bind(this);
      this.setEndTime = this.setEndTime.bind(this);
      this.attemptRefreshLogs = this.attemptRefreshLogs.bind(this);
      this.refreshLogs = this.refreshLogs.bind(this);
      this.disableFuture = this.disableFuture.bind(this);
      this.handleRequestCloseSnack = this.handleRequestCloseSnack.bind(this);
      var defaultStartDate = moment().subtract(6, 'days').toDate();
      defaultStartDate.setHours(0);
      defaultStartDate.setMinutes(0);
      defaultStartDate.setSeconds(0);
      defaultStartDate.setMilliseconds(0);
      var defaultEndDate = moment().toDate();
      defaultEndDate.setHours(23);
      defaultEndDate.setMinutes(59);
      defaultEndDate.setSeconds(59);
      defaultEndDate.setMilliseconds(999);
      this.state = {
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        defaultStartDate: defaultStartDate,
        defaultEndDate: defaultEndDate,
        showInvalidSnack: false
      }
    }

    componentWillMount() {
      LogActions.getLogs(new Date(this.state.defaultStartDate).toISOString(), new Date(this.state.defaultEndDate).toISOString());
      GraphActions.updateGraph(new Date(this.state.defaultStartDate).toISOString(), new Date(this.state.defaultEndDate).toISOString());
    }

    attemptRefreshLogs() {
      if (this.state.startDate <= this.state.endDate) {
        this.refreshLogs();
      } else {
        this.setState({
          showInvalidSnack: true
        });
      }
    }

    refreshLogs() {
      LogActions.getLogs(new Date(this.state.startDate).toISOString(), new Date(this.state.endDate).toISOString());
      GraphActions.updateGraph(new Date(this.state.startDate).toISOString(), new Date(this.state.endDate).toISOString());
    }

    setStartDate(event, date) {
      var hours = this.startDate.getHours();
      var mins = this.startDate.getMinutes();
      this.state.startDate = date;
      this.state.startDate.setHours(hours);
      this.state.startDate.setMinutes(mins);
    }

    setEndDate(event, date) {
      var hours = this.endDate.getHours();
      var mins = this.endDate.getMinutes();
      this.state.endDate = date;
      this.state.endDate.setHours(hours);
      this.state.endDate.setMinutes(mins);
    }

    handleRequestCloseSnack() {
      this.setState({
        showInvalidSnack: false
      });
    }

    disableFuture(date) {
      return date > moment().toDate();
    }

    setStartTime(event, date) {
      this.state.startDate.setHours(date.getHours());
      this.state.startDate.setMinutes(date.getMinutes());
    }

    setEndTime(event, date) {
      this.state.endDate.setHours(date.getHours());
      this.state.endDate.setMinutes(date.getMinutes());
    }


  render() {

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleCloseInvalidDialog}
      />
    ];

    const datePickerStyle = {
      paddingLeft: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
      paddingTop: "none",
    }

    const datePickerTextStyle = {
      fontSize: "0.8em",
    }

    const paperStyle = {
      textAlign: 'center',
      marginRight: "10px",
      marginBottom: "10px",
      marginTop: "10px",
      display: "inline-block",
    };

    const divStyle = {

    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div style={divStyle}>
          <Paper style={paperStyle} zDepth={0}>
            <div>
              <DatePicker
                style={datePickerStyle}
                textFieldStyle={datePickerTextStyle}
                onChange={this.setStartDate}
                floatingLabelText="Start Date (Inclusive)"
                maxDate={this.maxDate}
                defaultDate={this.state.defaultStartDate}
                container="inline"
                autoOk={true}
                shouldDisableDate={this.disableFuture}
              />
              {this.props.allowTime ? <TimePicker
                textFieldStyle={datePickerTextStyle}
                format="24hr"
                hintText="Start Time"
                onChange={this.setStartTime}
                autoOk={true}
              /> : ""}
            </div>
          </Paper>
          <Paper style={paperStyle} zDepth={0}>
            <div>
              <DatePicker
                style={datePickerStyle}
                textFieldStyle={datePickerTextStyle}
                onChange={this.setEndDate}
                floatingLabelText="End Date (Inclusive)"
                maxDate={this.maxDate}
                defaultDate={this.state.defaultEndDate}
                container="inline"
                autoOk={true}
                shouldDisableDate={this.disableFuture}
              />
              {this.props.allowTime ? <TimePicker
                textFieldStyle={datePickerTextStyle}
                format="24hr"
                hintText="End Time"
                onChange={this.setEndTime}
                autoOk={true}
              /> : ""}
            </div>
          </Paper>
          <RaisedButton label="refresh" onTouchTap={this.attemptRefreshLogs} style={paperStyle}/>
          <Snackbar
            open={this.state.showInvalidSnack}
            message="Start Date must be less than or equal to End Date"
            autoHideDuration={4000}
            onRequestClose={this.handleRequestCloseSnack}
            onActionTouchTap={this.handleRequestCloseSnack}
            action="close"
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
