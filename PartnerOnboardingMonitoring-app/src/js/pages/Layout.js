import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import Logs from "./Logs";
import DateRange from "./DateRange";
import GraphContainer from "./GraphContainer";
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import NavLink from './NavLink';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LogWrapper from './LogWrapper';

export default class Layout extends React.Component {

  render() {
    const LOGS_TO_SHOW = 5;

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
          <DateRange allowTime={false}/>
        </div>
        <div style={graphStyle}>
          <GraphContainer />
        </div>
        <div style={logTableStyle}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
              <Paper>
                <LogWrapper logsToShow={LOGS_TO_SHOW} fullLogs={true} searchBy={"All"}/>
              </Paper>
              <NavLink to="/fullLogs"><RaisedButton label="Full Logs" fullWidth={true}/></NavLink>
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}
