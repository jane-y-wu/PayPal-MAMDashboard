var React = require('react');
var DatePicker = require('react-datepicker');
var PieChart = require('react-chartjs').Pie;
var moment = require('moment');

import DateRange from "./DateRange";
import * as GraphActions from "../actions/GraphActions";
import GraphStore from "../stores/GraphStore";

 var chartData = [
    {
        value: 300,
        color:"#C8D7E3",
        highlight: "#DDE6ED",
        label: "INTERNAL_SERVICE_ERROR"
    },
    {
        value: 50,
        color: "#98B1C4",
        highlight: "#AEC1D0",
        label: "VALIDATION_ERROR"
    },
    {
        value: 100,
        color: "#2F4E6F",
        highlight: "#3D668F",
        label: "SERVICE_TIMEOUT"
    }
];


var pieOptions = {
  animatable: true,
  segmentShowStroke : true,
  segmentStrokeColor : "#fff",
  segmentStrokeWidth : 2,
  percentageInnerCutout : 0,
  animationSteps : 100,
  animationEasing : "easeOutBounce",
  animateRotate : true,
  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
};

export default class Statistics extends React.Component {

  constructor() {
    super();
    this.changeState = this.changeState.bind(this);
    GraphActions.updateGraph(moment().subtract(6, 'days').startOf('day').toISOString(), moment().toISOString());

    this.state = {
      chartData : chartData,
    }
  }

  componentWillMount() {
    GraphStore.on("change", this.changeState);
  }

  componentWillUnmount() {
    GraphStore.removeListener("change", this.changeState);
  }

  changeState() {

    var response = GraphStore.returnCount();
    response = JSON.parse(response);

    var getSum = function(arr) {

      var total = 0;

      for (var i = 0; i < arr.length; i++) {
        total += arr[i];
      }

      return total;
    }

    var iseTotal = getSum(response.INTERNAL_SERVICE_ERROR);
    var veTotal = getSum(response.VALIDATION_ERROR);
    var stTotal = getSum(response.SERVICE_TIMEOUT);

    chartData[0].value = iseTotal;
    chartData[1].value = veTotal;
    chartData[2].value = stTotal;

    this.setState({chartData : chartData});

  }

  render () {

    const datePickerStyle = {
      marginLeft: "5%",
      float: "left",
      marginTop: "2%",
      width: "100%"
    }

    return(
      <div>
        <div style={datePickerStyle}>
          <DateRange allowTime={false}/>
        </div>
         <div id="pie-container" className="row">
                <div width="100%">
                    <PieChart data={this.state.chartData} options={pieOptions} width="1200" height="500" redraw/>

                </div>
         </div>
      </div>
    )
  }
}

