import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';

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

  // componentWillMount() {
  // }
  //
  // componentWillUnmount() {
  //   LogStore.removeListener("change", this.getLogs);
  // }


  // Plan:
  // in getLogs hardcode the data fields in the table. these can only be fields shared by all error types
  // in getdetails
  // getLogs() {
  //   var rawLogs = JSON.parse(LogStore.getAll());
  //   this.state.parsedLogs = [];
  //   console.log(this.state.LOGS_TO_SHOW);
  //   for (var i in rawLogs) {
  //     if (i >= this.state.LOGS_TO_SHOW && this.state.LOGS_TO_SHOW > 0) break;
  //     var parsedLog = {
  //       errName: rawLogs[i].payload.Name,
  //       // fullDate: rawLogs[i].payload.Full_Date,
  //       issue_message: rawLogs[i].payload.issue,
  //       rawLogsURL : rawLogs[i].rawLogsURL,
  //       Machine: rawLogs[i].metaData.Machine,
  //       Pool: rawLogs[i].metaData.Pool,
  //       Data_Center: rawLogs[i].metaData.Data_Center,
  //       corr_id_: rawLogs[i].payload.corr_id_,
  //       operation: rawLogs[i].payload.operation,
  //     };
  //     var rawDate = rawLogs[i].payload.Full_Date;
  //     var dateObj = new Date(rawDate);
  //     parsedLog.dateObj = dateObj;
  //     parsedLog.fullDate = dateObj.getMonth() + "/" + dateObj.getDay() + "/" + dateObj.getFullYear() + " " + dateObj.getHours() + ":";
  //     if (dateObj.getMinutes() < 10) parsedLog.fullDate += "0";
  //     parsedLog.fullDate += dateObj.getMinutes();
  //     //parsedLog.fullDate = dateObj.toLocaleString();
  //     this.state.parsedLogs.push(parsedLog);
  //   }
  //   this.setState({
  //   });
  // }

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

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <Table>
              <TableHeader displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Full Date</TableHeaderColumn>
                  <TableHeaderColumn>Error Name</TableHeaderColumn>
                  <TableHeaderColumn>Issue/Message</TableHeaderColumn>
                  <TableHeaderColumn>Corr ID</TableHeaderColumn>
                  <TableHeaderColumn>Operation</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>

                {this.props.logData.map( (row, index) => (
                  <TableRow key={index}>
                    <TableRowColumn>{row.fullDate}</TableRowColumn>
                    <TableRowColumn><FlatButton label={row.errName}/></TableRowColumn>
                    <TableRowColumn><FlatButton children={row.issue_message} onTouchTap={this.handleShowMessage.bind(this, row.issue_message)}/></TableRowColumn>
                    <TableRowColumn><FlatButton label={row.corr_id_}/></TableRowColumn>
                    <TableRowColumn><FlatButton label={row.operation}/></TableRowColumn>
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
                <Table>
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
                </Table>
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
