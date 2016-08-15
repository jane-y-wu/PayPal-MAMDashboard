var React = require('react');
var Info = require('./Info.jsx');
var Table = require('./Table.jsx');
var Chart = require('./Chart.jsx');
var Calendar = require('./Calendar.jsx');

module.exports = React.createClass({
    render:function(){
               return(

                    <div>
                    <div id="table_container" className="row">
                    table goes here
                    </div>
                   
                  <div id="calendar_container" className="row">
                   calendar goes here
                  <Calendar />
                   </div>

                   <div id="chart_container" className="row">
                   "chart is here"
                   <Chart />
                   </div>

                   
                   </div>
                   )
           } 
});


