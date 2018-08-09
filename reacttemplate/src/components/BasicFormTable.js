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

class BasicFormTable extends Component {
    render() {
        return (
            <Formik 
                // initialize values to use in form
                initialValues={{
                    title:'', 
                    dataset: datasets[0],
                    datasourceUrl: datasourceUrl,
                    processor:jsonProcessor
                }}

                // pass values to the charts
                onSubmit={this.props.initializeTable}

                // render form
                render={formProps=>(
                    <Form className="draggable" style={{textAlign: "center", zIndex: -1,height:"100%",width:"100%"}}>
                        <label>Chart Title</label>
                        <Field type="text" name="title" placeholder="Chart Title"/>
                        <br/><br/>
                        <label>Choose the dataset</label>
                        <Field component="select" name="dataset">
                            {datasets.map((dataset)=>
                                <option key={dataset}>{dataset}</option>
                            )}
                        </Field>
                        <br/><br/>
                        <Button bsStyle="default" bsSize="medium" type="submit">Submit</Button>
                        {/* <DisplayFormikState {...this.props}/> */}
                    </Form>
                )}
            />
        );
    }
}

const DisplayFormikState = props =>
    <div style={{ margin: '1rem 0', background: '#f6f8fa', padding: '.5rem' }}>
        <strong>Injected Formik props (the form's state)</strong>
        <div>
            <code>errors:</code> {JSON.stringify(props.errors, null, 2)}
        </div>
        <div>
            <code>values:</code> {JSON.stringify(props.values, null, 2)}
        </div>
        <div>
            <code>isSubmitting:</code> {JSON.stringify(props.isSubmitting, null, 2)}
        </div>
    </div>

export default BasicFormTable;