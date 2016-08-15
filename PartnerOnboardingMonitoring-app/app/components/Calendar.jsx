var React = require('react');
var ReactDOM = require('react-dom');
var InfiniteCalendar = require('react-infinite-calendar');

var today = new Date();
var minDate = Number(new Date()) - (24*60*60*1000) * 7; 


module.exports = React.createClass({

  render: function() {
    alert("you here yet");
    return (

      <InfiniteCalendar
        width={400}
        height={600}
        selectedDate={today}
        disabledDays={[0,6]}
        minDate={minDate}
        keyboardSupport={true}
      />, document.getElementById('calendar_container')
    )
  }
});