import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import Logs from "./Logs";
import DateRange from "./DateRange";
import GraphContainer from "./GraphContainer";

import Paper from 'material-ui/Paper';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Layout extends React.Component {

  render() {
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

    return (
      <div>
        <Header/>
        <div style={datePickerStyle}>
          <DateRange/>
        </div>
        <div style={logTableStyle}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Paper>
              <Logs logsToShow={2}/>
            </Paper>
          </MuiThemeProvider>
        </div>
        <GraphContainer />
      </div>
    );
  }
}
