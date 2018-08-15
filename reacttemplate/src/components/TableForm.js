import React, {Component} from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from 'react-bootstrap';
import '../bootstrap.css';
import apiData from './ApiData2';
import JsonProcessor from './JsonProcessor';

// hard coded for now
let datasourceUrl = 'http://localhost:8084/Dummy_API/getCustomerOrders';
let jsonProcessor = new JsonProcessor(apiData);
let datasets = jsonProcessor.getDatasetNames();

class TableForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            aggregateType: 'Sum'
        }
    }

    changeAggregate = (e)=>{
        console.log("hiii" +e);
        let aggregateType = this.state.aggregateType;
        aggregateType = e;
        this.setState(aggregateType);
    }

    render() {
        return (
            <Formik 
                // initialize values to use in form
                initialValues={{
                    title:'', 
                    dataset: datasets[0],
                    datasourceUrl: datasourceUrl,
                    primaryCol: jsonProcessor.getOptions(datasets[0])[0], 
                    processor:jsonProcessor,
                }}

                // pass values to the charts
                onSubmit={this.props.initializeTable}

                // render form
                render={formProps=>(
                    <Form className="draggable" style={{textAlign: "center", zIndex: -1,height:"100%",width:"100%"}}>
                        <label style={{marginRight:5}}>Chart Title</label>
                        <Field type="text" name="title" placeholder="Chart Title"/>
                        <br/><br/>
                        <label style={{marginRight:5}}>Choose the dataset</label>
                        <Field component="select" name="dataset">
                            {datasets.map((dataset)=>
                                <option key={dataset}>{dataset}</option>
                            )}
                        </Field>
                        <br/><br/>
                        <label style={{marginRight:5}}>Type of Calculation</label> 
                        <select name="tableAggregate">
                            {/* gets the option based on selected dataset */}
                            <option key = "Sum" onClick={this.changeAggregate}>Sum</option>
                            <option key = "Average"  onClick={this.changeAggregate}>Average</option>
                            <option key = "Medium"  onClick={this.changeAggregate}>Medium</option>
                        </select>
                        <br/><br/>
                        <label style={{marginRight:5}}>Choose the category for {this.state.aggregateType}</label>   
                        <Field component="select" name="tableCat">
                            {/* gets the option based on selected dataset */}
                            {jsonProcessor.getOptions(formProps.values.dataset)
                            .map((option)=>
                                <option key={option}>{option}</option>
                            )}
                        </Field>

                        <br/><br/>
                        <Button bsStyle="default" type="submit">Submit</Button>
                    </Form>
                )}
            />
        );
    }
}

export default TableForm;