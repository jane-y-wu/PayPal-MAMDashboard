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
      fullMessage: "",
      dialog: {},
      open: false,
      logsNotShown: 0,
      showDialog: false,
      showFullMessage: false,
    };
  }

  handleOpen = (index) => {
    this.state.dialog = this.props.logData[index];
    this.setState({showDialog: true});
  };

  handleClose = () => {
    this.setState({showDialog: false});
  };

  handleShowMessage = (message) => {
    this.state.fullMessage = message;
    this.setState({showFullMessage: true});
  };

  handleCloseMessage = () => {
    this.setState({showFullMessage: false});
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
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    const actionsDialog = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleCloseMessage}
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

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <Table>
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
                    <TableRowColumn><FlatButton children={row.fullDate} onTouchTap={this.handleShowMessage.bind(this, row.fullDate)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Name} onTouchTap={this.handleShowMessage.bind(this, row.Name)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Machine} onTouchTap={this.handleShowMessage.bind(this, row.Machine)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Pool} onTouchTap={this.handleShowMessage.bind(this, row.Pool)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Data_Center} onTouchTap={this.handleShowMessage.bind(this, row.Data_Center)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Class} onTouchTap={this.handleShowMessage.bind(this, row.Class)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Type} onTouchTap={this.handleShowMessage.bind(this, row.Type)}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.Status} onTouchTap={this.handleShowMessage.bind(this, row.Status)}/></TableRowColumn>
                    <TableRowColumn><RaisedButton label="More" onTouchTap={this.handleOpen.bind(this, index)} fullWidth={true}/></TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              actions={actionsDialog}
              modal={false}
              open={this.state.showFullMessage}
              onRequestClose={this.handleCloseMessage}
            >
              <div>
                {/*}<Table>
                  <TableHeader displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>Issue/Message</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} >
                    <TableRow>
                      <TableRowColumn>{this.state.fullMessage}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>*/}
                {this.state.fullMessage}
              </div>
            </Dialog>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.showDialog}
              onRequestClose={this.handleClose}
            >
              <div>
              <Table>
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Raw Logs URL</TableHeaderColumn>
                    <TableHeaderColumn>Machine</TableHeaderColumn>
                    <TableHeaderColumn>Pool</TableHeaderColumn>
                    <TableHeaderColumn>Data Center</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} >
                  <TableRow>
                    <TableRowColumn>{this.state.dialog.rawLogsURL}</TableRowColumn>
                    <TableRowColumn>{this.state.dialog.Machine}</TableRowColumn>
                    <TableRowColumn>{this.state.dialog.Pool}</TableRowColumn>
                    <TableRowColumn>{this.state.dialog.Data_Center}</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
                <Table>
                  <TableHeader displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn>Issue/Message</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} >
                    <TableRow>
                      <TableRowColumn>{this.state.dialog.issue_message}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Dialog>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
