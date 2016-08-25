import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Divider from 'material-ui/Divider';
import NavLink from './NavLink';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as LogActions from "../actions/LogActions";
import LogStore from "../stores/LogStore";

/*
Plan

Have logs to display and logs in time range objects
Have sort by string/key and sort boolean
Have filter boolean and filters objects
Only call getLogs() is dates are changed (times are considred filters)


*/


export default class Logs extends React.Component {
  constructor(props) {
    super(props);
    // this.getLogs = this.getLogs.bind(this);
    //this.pullLogsData = this.pullLogData.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
    this.state = {
      LOGS_TO_SHOW: props.logsToShow,
      //parsedLogs: [{errName: "loading"}],
      //parsedLogs: props.logData,
      fullField: "",
      dialog: {},
      dialogKeys: [],
      open: false,
      logsNotShown: 0,
      showDialog: false,
      showFullField: false,
    };
  }

  handleOpen = (index) => {
    this.state.dialog = this.props.logData[index];
    console.log(this.state.dialog);
    var keys = [];
    for (var i in this.props.logData[index]) keys.push(i);
    this.state.dialogKeys = keys;
    console.log(this.state.dialogKeys);
    this.setState({showDialog: true});
  };

  handleClose = () => {
    this.setState({showDialog: false});
  };

  handleShowField = (fullField, title) => {
    this.setState({
      showFullField: true,
      fullField: fullField,
      fieldTitle: title
    });
  };

  handleCloseField = () => {
    this.setState({showFullField: false});
  };

  updateSortBy = (sortBy) => {
    LogActions.updateSortBy(sortBy);
  }

  // componentWillMount() {
  //   LogStore.on("refresh", this.pullLogData);
  // }

  // pullLogData() {
  //   console.log("Logs.js recieved pulllogdata");
  // }

  render() {

    const actions = [
      <NavLink to={"/singleLog/" + this.state.dialog._id}><FlatButton label="See in Page" primary={true} fullWidth={false}/></NavLink>,
      <FlatButton
        label="Close"
        primary={false}
        onTouchTap={this.handleClose}
      />
    ];

    const actionsDialog = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleCloseField}
      />
    ];

    const maxDate = Date.now();

    const labelStyle = {
      textTransform: "none",
      color: "grey",
      fontSize: "1em"
    }

    const headerCellStyle = {
      width: "12%"
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

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <Table fixedHeader={true}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={headerCellStyle} >
                    <div>
                      <FlatButton label={"Full Date"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "fullDate")}/>
                      {this.props.sortBy == "fullDate" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                      {this.props.sortBy == "fullDate" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                    </div>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Error Name"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Name")}/>
                    {this.props.sortBy == "Name" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Name" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Machine"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Machine")}/>
                    {this.props.sortBy == "Machine" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Machine" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Pool"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Pool")}/>
                    {this.props.sortBy == "Pool" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Pool" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Data_Center"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Data_Center")}/>
                    {this.props.sortBy == "Data_Center" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Data_Center" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Class"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Class")}/>
                    {this.props.sortBy == "Class" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Class" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Type"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Type")}/>
                    {this.props.sortBy == "Type" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Type" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}>
                    <FlatButton label={"Status"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "Status")}/>
                    {this.props.sortBy == "Status" && this.props.sortDirection == 1 ? <ArrowDropUp/> : ""}
                    {this.props.sortBy == "Status" && this.props.sortDirection == -1 ? <ArrowDropDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={headerCellStyle}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>

                {this.props.logData.map( (row, index) => (
                  <TableRow key={index}>
                    <TableRowColumn><FlatButton children={row.fullDate} onTouchTap={this.handleShowField.bind(this, row.fullDate, "Full Date")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Name} onTouchTap={this.handleShowField.bind(this, row.Name, "Error Name")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Machine} onTouchTap={this.handleShowField.bind(this, row.Machine, "Machine")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Pool} onTouchTap={this.handleShowField.bind(this, row.Pool, "Pool")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Data_Center} onTouchTap={this.handleShowField.bind(this, row.Data_Center, "Data Center")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Class} onTouchTap={this.handleShowField.bind(this, row.Class, "Class")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Type} onTouchTap={this.handleShowField.bind(this, row.Type, "Type")}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Status} onTouchTap={this.handleShowField.bind(this, row.Status, "Status")}/></TableRowColumn>
                    <TableRowColumn><RaisedButton label="More" onTouchTap={this.handleOpen.bind(this, index)} fullWidth={true}/></TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              actions={actionsDialog}
              modal={false}
              open={this.state.showFullField}
              onRequestClose={this.handleCloseField}
            >
              <div>
                <Table>
                  <TableHeader displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>{this.state.fieldTitle}</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} >
                    <TableRow>
                      <TableRowColumn>{this.state.fullField}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Dialog>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.showDialog}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
              title={"Full Details"}
            >
              <div>
                {this.state.dialogKeys.map( (key, index) => (
                  <div style={smallTableStyle}>
                    <div style={keyStyle}>
                      {key}
                    </div>
                    <Divider />
                    <div style={fieldStyle}>
                      {this.state.dialog[key]}
                    </div>
                  </div>
                ))}
              </div>
            </Dialog>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
