var React = require('react');
var DatePicker = require('react-datepicker');
var moment = require('moment');

module.exports = React.createClass({
  displayName: 'Example',

  getInitialState: function() {
    return {
      startDate: moment(),
      endDate: moment()
    };
  },

  handleChangeStart: function(date) {
    this.setState({
      startDate: date
    });
  },

   handleChangeEnd: function(date) {
    this.setState({
      endDate: date
    });
  },


  render: function() {
    return (  
    <div> 
      <DatePicker
        selected={this.state.startDate}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        maxDate={moment()}
        todayButton={'Today'}
        onChange={this.handleChangeStart} />
      <DatePicker
        selected={this.state.endDate}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        maxDate={moment()}
        todayButton={'Today'}
        onChange={this.handleChangeEnd} />
    </div>

    )}
});