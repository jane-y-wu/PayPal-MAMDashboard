import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import LogWrapper from "./LogWrapper";
import DateRange from "./DateRange";
import GraphContainer from "./GraphContainer";

import Paper from 'material-ui/Paper';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Layout extends React.Component {

  render() {
    const LOGS_TO_SHOW = 3;

    const logTableStyle = {
      margin: "5%",
      marginTop: 0,
      float: "left",
    }

    const datePickerStyle = {
      marginLeft: "5%",
      float: "left",
      marginTop: "2%",
      width: "100%"
    }

    const graphStyle = {
      textAlign: "center",
      padding: "5%"
    }

    return (
      <div>
        <div style={datePickerStyle}>
          <DateRange/>
        </div>
        <div style={logTableStyle}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Paper>
              <LogWrapper logsToShow={-1}/>
            </Paper>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}
