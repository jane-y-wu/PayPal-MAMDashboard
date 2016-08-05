var React = require('react');
var ReactDOM = require('react-dom');
var url = 'http://localhost:3003/api/getLogs/?startDate=2016-07-26T02:45:00&endDate=2016-07-29T11:00:00';

var LogList = React.createClass({
  getInitialState: function() {
    return {
      data: 'not loaded'
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(url, function (result) {
      this.setState({
        data: result
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div className="logList">
        {this.state.data}
      </div>
    );
  }
});

ReactDOM.render(
  // React.createElement(LogList, null),
  <LogList />,
  document.getElementById('content')
);
