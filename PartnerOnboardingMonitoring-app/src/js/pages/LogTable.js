import React from 'react';
import Table from 'rc-table';

export default class LogTable extends React.Component {
  constructor() {
    super();
    this.columns = [{
      title: 'col1', dataIndex: 'a', key:'a', width: 100,
    }, {
      title: 'col2', dataIndex: 'b', key:'b', width: 100,
    }, {
      title: 'col3', dataIndex: 'c', key:'c', width: 100,
    }, {
      title: 'col4', dataIndex: 'd', key:'d', width: 100,
    }];

    this.data = [
      { a: '123', b: '123', c: '123', key:'1' },
      { a: '123', b: '123', c: '123', key:'2' },
      { a: '123', b: '123', c: '123', d:'extra', key:'3'},
    ];
  }

  render() {

    return (
      <Table columns={this.columns} data={this.data}/>
    );
  }
}
