import React from "react";
import { Link } from "react-router";
import Header from "./Header";
import LogWrapper from "./LogWrapper";
import DateRange from "./DateRange";
import GraphContainer from "./GraphContainer";

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleChangeSearchBy = this.handleChangeSearchBy.bind(this);
    this.state = {
      searchText: "",
      searchBy: "All"
    }
  }

  handleChangeSearch = (event) => {
    this.setState({searchText: event.target.value});
  };

  handleChangeSearchBy = (event, index, value) => {
    this.state.searchBy = value;
    this.setState({});
  }

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
          <div>
            <TextField
              hintText="Search"
              value={this.state.searchText}
              onChange={this.handleChangeSearch}
            />
            <DropDownMenu value={this.state.searchBy} onChange={this.handleChangeSearchBy}>
              <MenuItem value={"All"} primaryText="All" />
              <MenuItem value={"fullDate"} primaryText="Full Date" />
              <MenuItem value={"Name"} primaryText="Error Name" />
              <MenuItem value={"Machine"} primaryText="Machine" />
              <MenuItem value={"Pool"} primaryText="Pool" />
              <MenuItem value={"Data_Center"} primaryText="Data Center" />
              <MenuItem value={"Class"} primaryText="Class" />
              <MenuItem value={"Type"} primaryText="Type" />
              <MenuItem value={"Status"} primaryText="Status" />
            </DropDownMenu>
          </div>
        </MuiThemeProvider>
        <div style={logTableStyle}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Paper>
              <LogWrapper logsToShow={-1} fullLogs={true} searchText={this.state.searchText} searchBy={this.state.searchBy}/>
            </Paper>
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}
