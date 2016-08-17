import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {

    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AppBar
            title="MAM API Monitoring Dashboard"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Drawer open={this.state.open} docked={false} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
            <MenuItem onTouchTap={this.handleClose}>Full Logs</MenuItem>
            <MenuItem onTouchTap={this.handleClose}>Full Statistics</MenuItem>
          </Drawer>
        </MuiThemeProvider>
        {this.props.children}
      </div>
    );
  }
}
