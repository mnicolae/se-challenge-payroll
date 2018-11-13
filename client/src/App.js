import React, { Component } from 'react';
import './App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null,
      payrolls: [],
      loaded: 0,
    };
  }

  componentDidMount() {
    fetch('/v1/payroll/getPayrollReport')
      .then(response => response.json())
      .then(data => this.setState({ payrolls: data.payrolls }))
  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  handleUpload = () => {
    const data = new FormData()
    data.append('timeReportFile', this.state.selectedFile, this.state.selectedFile.name)

    axios
      .post('/v1/payroll/uploadTimeReport', data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          })
        },
      })
      .then(res => {
        fetch('/v1/payroll/getPayrollReport')
          .then(response => response.json())
          .then(data => this.setState({ payrolls: data.payrolls }))
      });
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
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <button onClick={this.handleUpload}>Upload</button>
      </div>
    );
  }
}
export default App;
