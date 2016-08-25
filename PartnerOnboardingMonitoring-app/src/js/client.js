import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from "./pages/Layout";
import Header from "./pages/Header";
import FullLogs from "./pages/FullLogs";
import SingleLog from "./pages/SingleLog";

injectTapEventPlugin();

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={Header}>
      <IndexRoute component={Layout}/>
      <Route path="fullLogs" component={FullLogs}/>
      <Route path="singleLog/:logID" component={SingleLog}/>
    </Route>
  </Router>
), document.getElementById('app'));
