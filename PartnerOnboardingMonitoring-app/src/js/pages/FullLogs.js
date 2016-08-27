import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import LogWrapper from "./LogWrapper";
import DateRange from "./DateRange";
import GraphContainer from "./GraphContainer";

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.state = {
      searchText: ""
    }
  }

  handleChangeSearch = (event) => {
    this.setState({searchText: event.target.value});
  };

  render() {

    const layoutStyle = {
      margin: "5%"
    }

    const logTableStyle = {
      marginTop: 0,
      float: "left",
    }

    const datePickerStyle = {
      float: "left",
      marginTop: "2%",
      width: "100%"
    }

    const graphStyle = {
      textAlign: "center",
    }

    return (
      <div  style={layoutStyle}>
        <div style={datePickerStyle}>
          <DateRange allowTime={true}/>
        </div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <TextField
            hintText="Search"
            value={this.state.searchText}
            onChange={this.handleChangeSearch}
          />
        </MuiThemeProvider>
        <div style={logTableStyle}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Paper>
              <LogWrapper logsToShow={-1} fullLogs={true} searchText={this.state.searchText}/>
            </Paper>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}
