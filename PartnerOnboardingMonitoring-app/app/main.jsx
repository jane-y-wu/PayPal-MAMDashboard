var React = require("react");
var ReactDOM = require("react-dom");
var GraphContainer = require("./components/GraphContainer.jsx");


function render(){
        ReactDOM.render(<GraphContainer />, document.getElementById("container"));    
}

render();
