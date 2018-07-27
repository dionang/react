import React from 'react';
import { withFormik, Form, Field } from 'formik';
import Rnd from 'react-rnd';
import Yup from 'yup'

var datasources = [];
var options = ['Sales', 'Costs', 'Forecast', 'Appointment', 'Profits'];

const App = props => {
    const {
        values,
        touched,
        handleChange,
        isSubmitting 
    } = props;

    return (
        <Form>
            <label className="label">Chart Title</label>
            <Field className="input" type="text" name="title" placeholder="Chart Title"/><br/>
            <label className="checkbox">Join our newsletter?</label>
            <Field type="checkbox" name="newsletter" checked={values.newsletter}/><br/>
                
            <Field component="select" name="editor" >
              <option value="atom">Atom</option>
              <option value="sublime">Sublime Text</option>
            </Field>
            {console.log(props)}
            <label className="label">Do you test your code?</label>
            <button disabled={isSubmitting}>Submit</button>
            <DisplayFormikState {...props} />
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
    </div>;

const FormikApp = withFormik({
    mapPropsToValues({ email, password, newsletter, editor, test }) {
        return {
            email: email || '',
            password: password || '',
            newsletter: newsletter || false,
            editor: editor || 'atom',
            test: test || ''
        }
    },

    handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
        setTimeout(() => {
            if (values.email === 'yomi@gmail.io') {
                setErrors({ email: 'That email is already taken' })
            } else {
                resetForm()
            }
            setSubmitting(false)
        }, 2000)
    }
})(App)

export default FormikApp