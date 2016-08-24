var React = require('react');
var DatePicker = require('react-datepicker');
var LineChart = require('react-chartjs').Line;
var moment = require('moment');

import * as GraphActions from "../actions/GraphActions";
import GraphStore from "../stores/GraphStore";

var chartData = {


    labels: [],
    datasets: [
      {
        label: 'INTERNAL_SERVICE_ERROR',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [],
      },
      {
        label: 'VALIDATION_ERROR',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [],
      },

      {
        label: 'SERVICE_TIMEOUT',
        fillColor: 'rgba(185,203,212,0.2)',
        strokeColor: 'rgba(185,203,212,1)',
        pointColor: 'rgba(185,203,212,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(185.5,203.5,212.5,1)',
        data: [],
      },

      {
        label: 'Total',
        fillColor: 'rgba(185,203,212,0.2)',
        strokeColor: 'rgba(185,203,212,1)',
        pointColor: 'rgba(185,203,212,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(185.5,203.5,212.5,1)',
        data: [],
      }
    ]

}

var options = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
}

var styles = {
  graphContainer: {
    //
  }
}

export default class GraphContainer extends React.Component {

  constructor() {
    super();
    this.changeState = this.changeState.bind(this);

    GraphActions.updateGraph(moment().subtract(6, 'days').startOf('day').toISOString(), moment().toISOString());
    //GraphStore.on('change', this.changeState);
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

    //console.log(response);

    chartData.labels = response.labels;
    chartData.datasets[0].data = response.INTERNAL_SERVICE_ERROR;
    chartData.datasets[1].data = response.VALIDATION_ERROR;
    chartData.datasets[2].data = response.SERVICE_TIMEOUT;
    chartData.datasets[3].data = response.totalData;

    this.setState({chartData : chartData});

  }

  render () {
    return(

      <div>
         <div id="chart-container" className="row">
                <div style={styles.graphContainer} width="100%">
                  <LineChart data={this.state.chartData}
                    options={options}
                    width="1200" height="500" redraw/>
                </div>
         </div>


      </div>
    )
  }
}
