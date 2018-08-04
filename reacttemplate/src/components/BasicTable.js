import BootstrapTable from 'react-bootstrap-table-next';
import React from "react";
import cellEditFactory from 'react-bootstrap-table2-editor';


class BasicTable extends React.Component {
    render() {
        const columns = [{
            dataField: 'id',
            text: 'Product ID',
            sort: true

        }, {
            dataField: 'name',
            text: 'Product Name',
            sort: true

        }, {
            dataField: 'price',
            text: 'Product Price',
            sort: true

        }];

        var products = [{
            id: 1,
            name: "Product1",
            price: 120
        }, {
            id: 2,
            name: "Product2",
            price: 80
        }, {
            id: 3,
            name: "Product1",
            price: 120
        }, {
            id: 4,
            name: "Product2",
            price: 80
        },{
            id: 5,
            name: "Product1",
            price: 120
        }];
        
        const rowStyle = { backgroundColor: '#c8e6c9' };

       
          

        return (
            <div>
                <BootstrapTable keyField='id' data={products}
                    columns={columns}
                    cellEdit={cellEditFactory({ mode: 'dbclick' })}
                    rowStyle={ rowStyle }>
                </BootstrapTable>
            </div>
        )
    }
}

export default BasicTable;