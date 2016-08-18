var React = require('react');
var DatePicker = require('react-datepicker');
var LineChart = require('react-chartjs').Line;
// var Chart = require('chart.js');
var dataSrc = require('../data_model/data.js');
var moment = require('moment');

import * as GraphActions from "../actions/GraphActions";
import GraphStore from "../stores/GraphStore";

// Chart.defaults.global.responsive = true;

var chartData = {


    labels: dataSrc.dates,
    datasets: [
      {
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: dataSrc.dataset,
      },
      {
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 66, 27, 70],
      },
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

var newData = {
  labels: dataSrc.dates,
    datasets: [
      {
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [23, 25, 28, 29, 23, 20, 22],
      }
    ]
}

export default class GraphContainer extends React.Component {

  constructor() {
    super();
    this.changeState = this.changeState.bind(this);
    this.state = {
      chartData : chartData,
    }
  }

  // onButtonClick(ev) {
  //   alert('the button was clicked; start date : ' + this.state.startDate.format("LL") + ' end date : ' + this.state.endDate.format("LL"));
  //   this.setState({chartData : newData});
  // }

  // handleChangeStart(date) {
  //   this.setState({
  //     startDate: date
  //   });
  // }

  // handleChangeEnd(date) {
  //   this.setState({
  //     endDate: date
  //   });
  // }



  componentWillMount() {
    GraphStore.on("change", this.changeState);
  }

  componentWillUnmount() {
    GraphStore.removeListener("change", this.changeState);
  }

  changeState() {
    var data = GraphStore.returnCount()
    data = data.split(',');
    data = data.map(function(item) {
      return parseInt(item);
    })
    newData.datasets[0].data = data;
    this.setState({chartData : newData});
  }

  render () {
    return(

      <div>

        {/*}<div id="calendar-container" className="row">

          <DatePicker id="star-calendar"
            selected={this.state.startDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            maxDate={moment()}
            todayButton={'Today'}
            onChange={this.handleChangeStart} />
          <DatePicker id="end-calendar"
            selected={this.state.endDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            maxDate={moment()}
            todayButton={'Today'}
            onChange={this.handleChangeEnd} />

          <button type="button" onClick={this.onButtonClick}>Update Chart</button>
        </div>*/}

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
