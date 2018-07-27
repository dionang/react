import React from 'react';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup'

var datasets = ['Furniture', 'Category'];
var options = ['Sales', 'Costs', 'Revenue', 'Profits'];

const FormBase = props => {
    const {
        values,
        touched,
        handleChange,
        isSubmitting 
    } = props;

    return (
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
            {/* <DisplayFormikState {...props}/> */}
        </Form>
    );
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

const BasicForm = withFormik({
    mapPropsToValues({ title, dataset, xAxis, yAxis }) {
        return {
            title: title || '',
            dataset: dataset || '',
            xAxis: xAxis || '',
            yAxis: yAxis || ''
        }
    },
    handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
        console.log(values);
        setTimeout(() => {
            setSubmitting = false;
        }, 1000)
    }
})(FormBase);

export default BasicForm;