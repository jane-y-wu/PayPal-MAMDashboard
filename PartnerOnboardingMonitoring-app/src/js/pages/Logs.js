import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

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

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <Table>
              <TableHeader displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>
                    <FlatButton label={"Full Date"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "fullDate")}/>
                    {this.props.sortBy == "fullDate" && this.props.sortDirection == 1 ? <KeyboardArrowUp/> : ""}
                    {this.props.sortBy == "fullDate" && this.props.sortDirection == -1 ? <KeyboardArrowDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    <FlatButton label={"Error Name"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "errName")}/>
                    {this.props.sortBy == "errName" && this.props.sortDirection == 1 ? <KeyboardArrowUp/> : ""}
                    {this.props.sortBy == "errName" && this.props.sortDirection == -1 ? <KeyboardArrowDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    <FlatButton label={"Issue/Message"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "issue_message")}/>
                    {this.props.sortBy == "issue_message" && this.props.sortDirection == 1 ? <KeyboardArrowUp/> : ""}
                    {this.props.sortBy == "issue_message" && this.props.sortDirection == -1 ? <KeyboardArrowDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    <FlatButton label={"Corr ID"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "corr_id_")}/>
                    {this.props.sortBy == "corr_id_" && this.props.sortDirection == 1 ? <KeyboardArrowUp/> : ""}
                    {this.props.sortBy == "corr_id_" && this.props.sortDirection == -1 ? <KeyboardArrowDown/> : ""}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    <FlatButton label={"Operation"} labelStyle={labelStyle} onTouchTap={this.updateSortBy.bind(this, "operation")}/>
                    {this.props.sortBy == "operation" && this.props.sortDirection == 1 ? <KeyboardArrowUp/> : ""}
                    {this.props.sortBy == "operation" && this.props.sortDirection == -1 ? <KeyboardArrowDown/> : ""}
                  </TableHeaderColumn>
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
