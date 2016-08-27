var React = require('react');
var DatePicker = require('react-datepicker');
var PieChart = require('react-chartjs').Pie;
//var Chart = require('chartjs'); 
var moment = require('moment');

import * as GraphActions from "../actions/GraphActions";
import GraphStore from "../stores/GraphStore";

// var chartData = {
//     labels: [
//         "Red",
//         "Blue",
//         "Yellow"
//     ],
//     datasets: [
//         {
//             data: [300, 50, 100],
//             backgroundColor: [
//                 "#FF6384",
//                 "#36A2EB",
//                 "#FFCE56"
//             ],
//             hoverBackgroundColor: [
//                 "#FF6384",
//                 "#36A2EB",
//                 "#FFCE56"
//             ]
//         }]
// }

 var chartData = [
              {
                  value: 300,
                  color:"#F7464A",
                  highlight: "#FF5A5E",
                  label: "Red"
              },
              {
                  value: 50,
                  color: "#46BFBD",
                  highlight: "#5AD3D1",
                  label: "Green"
              },
              {
                  value: 100,
                  color: "#FDB45C",
                  highlight: "#FFC870",
                  label: "Yellow"
              },
              {
                  value: 40,
                  color: "#949FB1",
                  highlight: "#A8B3C5",
                  label: "Grey"
              },
              {
                  value: 120,
                  color: "#4D5360",
                  highlight: "#616774",
                  label: "Dark Grey"
              }
          ];

var styles = {
  pieContainer: {
    //
  }
}

var options = {

}

export default class Statistics extends React.Component {

  constructor() {
    super();
    //this.changeState = this.changeState.bind(this);
    //GraphActions.updateGraph(moment().subtract(6, 'days').startOf('day').toISOString(), moment().toISOString());
    
    this.state = {
      chartData : chartData,
    }
  }

  // componentWillMount() {
  //   GraphStore.on("change", this.changeState);
  // }

  // componentWillUnmount() {
  //   GraphStore.removeListener("change", this.changeState);
  // }

  // changeState() {

  //   var response = GraphStore.returnCount();
  //   response = JSON.parse(response);

  //   //console.log(response);

  //   chartData.labels = response.labels;
  //   chartData.datasets[0].data = response.INTERNAL_SERVICE_ERROR;
  //   chartData.datasets[1].data = response.VALIDATION_ERROR;
  //   chartData.datasets[2].data = response.SERVICE_TIMEOUT;
  //   chartData.datasets[3].data = response.totalData;

  //   this.setState({chartData : chartData});

  // }

  render () {
  	console.log('at least it rendering');
    return(

      <div>
         <div id="pie-container" className="row">
                <div style={styles.pieContainer} width="100%">
                    <PieChart data={this.state.chartData} options={options} redraw/>
                </div>
         </div>
      </div>
    )
  }
}

