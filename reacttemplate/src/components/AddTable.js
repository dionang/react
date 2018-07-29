import React from "react";
import { makeData } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class AddTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData()
    };
  }
  render() {
    return ( 
        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Status",
                  accessor: "status"
                }
              ]
            },
            {
              Header: 'Stats',
              columns: [
                {
                  Header: "Visits",
                  accessor: "visits"
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
    );
  }
}

export default AddTable;