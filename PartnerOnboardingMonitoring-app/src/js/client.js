import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from "./pages/Layout";

injectTapEventPlugin();

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={Layout}/>
  </Router>
), document.getElementById('app'));
