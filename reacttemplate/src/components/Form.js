import React, {Component} from 'react';
import { Formik, Form, Field } from 'formik';

import apiData from './ApiData';
import JsonProcessor from './JsonProcessor'

let jsonProcessor = new JsonProcessor(apiData);
var datasets = jsonProcessor.getDatasetNames();

class BasicForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Formik 
                // initialize values to use in form
                initialValues={{
                    title:'', 
                    dataset: datasets[0], 
                    xAxis: jsonProcessor.getOptions(datasets[0])[0], 
                    yAxis: jsonProcessor.getOptions(datasets[0])[0], 
                    processor:jsonProcessor
                }}

                // pass values to the charts
                onSubmit={this.props.initializeChart}

                // render form
                render={formProps=>(
                    <Form className="draggable" style={{textAlign: "center"}}>
                        <label>Chart Title</label>
                        <Field className="input" type="text" name="title" placeholder="Chart Title"/>
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
                            {jsonProcessor.getOptions(formProps.values.dataset)
                            .map((option)=>
                                <option key={option}>{option}</option>
                            )}
                        </Field>
                        <br/><br/>
                        <button type="submit">Submit</button>
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

export default BasicForm;