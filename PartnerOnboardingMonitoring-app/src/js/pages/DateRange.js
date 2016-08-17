import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as LogActions from "../actions/LogActions";

export default class DateRange extends React.Component {
    constructor() {
      super();
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.state = {
        startDate: Date.now(),
        endDate: Date.now(),
      }
    }

    refreshLogs() {
      console.log(this.state.startDate + " " + this.state.endDate);
      LogActions.getLogs();
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
      padding: "10px",
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
          <Paper style={paperStyle}>
            <div>
              <DatePicker style={datePickerStyle} onChange={this.setStartDate}
                floatingLabelText="Start Date"
                maxDate={this.maxDate}
              />
              <TimePicker
                format="24hr"
                hintText="Start Time"
              />
            </div>
          </Paper>
          <Paper style={paperStyle}>
            <div>
              <DatePicker style={datePickerStyle} onChange={this.setEndDate}
                floatingLabelText="End Date"
                maxDate={this.maxDate}
              />
              <TimePicker
                format="24hr"
                hintText="End Time"
              />
            </div>
          </Paper>
          <RaisedButton label="refresh" onTouchTap={this.refreshLogs} style={paperStyle}/>
        </div>
      </MuiThemeProvider>
    );
  }
}
