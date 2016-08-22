import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

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
      var defaultStartDate = moment().subtract(6, 'days').toDate();
      this.state = {
        startDate: moment().subtract(6, 'days').toDate(),
        endDate: moment().toDate(),
        defaultStartDate: defaultStartDate,
        defaultEndDate: moment().toDate(),
      }
      this.refreshLogs = this.refreshLogs.bind(this);
    }

    refreshLogs() {
      LogActions.getLogs();
      GraphActions.updateGraph(new Date(this.state.startDate).toISOString(), new Date(this.state.endDate).toISOString());
    }

    setStartDate(event, date) {
      this.setState({
        startDate: date,
      });
    }

    setEndDate(event, date) {
      this.setState({
        endDate: date,
      });
    }

    setStartTime() {
      //
    }

    setEndTime() {
      //
    }

  render() {

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
                floatingLabelText="Start Date"
                maxDate={this.maxDate}
                defaultDate={this.state.defaultStartDate}
              />
              {/*}<TimePicker
                textFieldStyle={datePickerTextStyle}
                format="24hr"
                hintText="Start Time"
              />*/}
            </div>
          </Paper>
          <Paper style={paperStyle} zDepth={0}>
            <div>
              <DatePicker
                style={datePickerStyle}
                textFieldStyle={datePickerTextStyle}
                onChange={this.setEndDate}
                floatingLabelText="End Date"
                maxDate={this.maxDate}
                defaultDate={this.state.defaultEndDate}
              />
              {/*}<TimePicker
                textFieldStyle={datePickerTextStyle}
                format="24hr"
                hintText="End Time"
              />*/}
            </div>
          </Paper>
          <RaisedButton label="refresh" onTouchTap={this.refreshLogs} style={paperStyle}/>
        </div>
      </MuiThemeProvider>
    );
  }
}
