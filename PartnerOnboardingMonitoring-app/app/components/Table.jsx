var SimpleTable = require('react-simple-table');
var React = require('react');

var eLogs = [{
  first: {
    name: 'INTERNAL_SERVICE_ERROR',
    date: 'today',
    status: 'x'
  }
}];

module.exports = React.createClass({
  render: function() {
    return (
      <SimpleTable columns={[
        {columnHeader: 'Error Name', path: 'first.name'},
        {columnHeader: 'Date', path: 'first.date'},
        {columnHeader: 'Status', path: 'first.status'}
      ]} data={eLogs } />
    )
  }
});