var React = require("react");
var LineChart = require("react-chartjs").Line;
var Chart = require('chart.js');

var data = [3, 4, 6];
var chartOptions = {
	responsive : false
};

module.exports = React.createClass({
  render: function() {
  	alert("are you in charttest");
  	alert(data);
  	alert(chartOptions);
  	alert(<LineChart data={data} options={chartOptions}/>);
    return <LineChart data={data} options={chartOptions} width="600" height="1000"/>
  }
});