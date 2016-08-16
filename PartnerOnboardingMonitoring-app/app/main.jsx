var React = require("react");
var ReactDOM = require("react-dom");
var DashboardContainer = require("./components/DashboardContainer.jsx");
var Table = require("./components/Table.jsx");
var OtherTable = require("./components/OtherTable.jsx");


function render(){
        ReactDOM.render(<DashboardContainer />, document.getElementById("container"));    
}

render();
