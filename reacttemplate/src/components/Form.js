import React, {Component} from 'react';
import { Formik, Form, Field } from 'formik';
import Yup from 'yup'

var datasets = ['Furniture', 'Category'];
var options = ['Sales', 'Costs', 'Revenue', 'Profits'];

class BasicForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Formik onSubmit={this.props.initializeChart}>
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
                        {options.map((option)=>
                            <option key={option}>{option}</option>
                        )}
                    </Field>
                    <br/><br/>
                    <label>Choose the Y-Axis</label> 
                    <Field component="select" name="yAxis">
                        {options.map((option)=>
                            <option key={option}>{option}</option>
                        )}
                    </Field>
                    <br/><br/>
                    <button type="submit">Submit</button>
                    {/* <DisplayFormikState {...this.props}/> */}
                </Form>
            </Formik>
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