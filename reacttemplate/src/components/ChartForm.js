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

class ChartForm extends Component {
    render() {
        return (
            <Formik 
                // initialize values to use in form
                initialValues={{
                    title:'', 
                    dataset: datasets[0],
                    datasourceUrl: datasourceUrl,
                    xAxis: jsonProcessor.getOptions(datasets[0])[0], 
                    yAxis: jsonProcessor.getNumericalOptions(datasets[0])[0], 
                    processor:jsonProcessor
                }}

                // pass values to the charts
                onSubmit={this.props.initializeChart}

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
                        <label>Choose the X-Axis</label> 
                        <Field component="select" name="xAxis">
                            {/* gets the option based on selected dataset */}
                            {jsonProcessor.getOptions(formProps.values.dataset)
                            .map((option)=>
                                <option key={option}>{option}</option>
                            )}
                        </Field>
                        <br/><br/>
                        <label>Choose the Y-Axis</label> 
                        <Field component="select" name="yAxis">
                            {jsonProcessor.getNumericalOptions(formProps.values.dataset)
                            .map((option)=> 
                                <option key={option}>{option}</option>
                            )}
                        </Field>
                        <br/><br/>
                        <Button type="submit">Submit</Button>
                        {/* <DisplayFormikState {...this.props}/> */}
                    </Form>
                )}
            />
        );
    }
}

export default ChartForm;