import React, { Component } from 'react';
import './App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payrolls: []
    };
  }

  componentDidMount() {
    fetch('/v1/payroll/getPayrollReport')
      .then(response => response.json())
      .then(data => this.setState({ payrolls: data.payrolls }))
  }

render() {
    const { payrolls } = this.state;
    return (
      <div>
        <ReactTable
          data={payrolls}
          columns={[
            {
              Header: "Employee ID",
              accessor: "empid"
            },
            {
              Header: "Pay period",
              accessor: d => d.pay_period.substring(0,10),
              id: "pay_period"
            },
            {
              Header: "Amount paid",
              accessor: "sum"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}
export default App;
