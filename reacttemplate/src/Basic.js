import React from "react";
import { render } from "react-dom";
import { Formik, Form, Field } from "formik";
import _ from "lodash";
import Rnd from 'react-rnd';

export const DisplayFormikState = props => (
    <div style={{ margin: "1rem 0" }}>
        <h3 style={{ fontFamily: "monospace" }} />
        <pre
            style={{
                background: "#f6f8fa",
                fontSize: ".65rem",
                padding: ".5rem"
            }}
        >

        </pre>
    </div>
);//strong>props/strong> = JSON.stringify(props, null, 2)}

var options = ['Sales', 'Costs', 'Forecast', 'Appointment', 'Profits'],
    MakeItem = function (X) {
        return <option>{X}</option>;
    };




const Basic = () => (
    <div className="app" >
        <Rnd style={{ border: "1px solid", height: "fit-content", align: "center" }} >

            <h1>Choose your data for the selected Chart</h1>

            <Formik
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 1000);
                }}
            >
                <Form >
                    <div style={{ 'text-align': "center" }}>
                        <label>Enter the Chart Name</label>
                        <Field
                            name="chartName"
                            validate={val => (!!val ? true : `***Please enter the chart name.`)}
                            
                        />
                        <Field
                            render={({ field, form }) => (
                                <div className="input-feedback" style={{ color: "red" }}>
                                    {form.errors && _.get(form.errors, "chartName")}
                                </div>
                            )}
                        />
                    
                    <br />

                    <label >Choose the data set  </label>
                    <select name="dataSource" style={{"margin-left": 10}}>
                        {options.map(MakeItem)}
                    </select>

                    <br />
                    <br />

                    <label name="xAixsName" >Choose the X-Axis  </label>
                    <select name="xAixs" style={{"margin-left": 10}}>
                        {options.map(MakeItem)}
                    </select>

                    <br />
                    <br />

                    <label name="yAixsName" >Choose the Y-Axis  </label>
                    <select name="yAixs" style={{"margin-left": 10}}>
                        {options.map(MakeItem)}
                    </select>

                    <br />
                    <br />
                    
                    <div style={{'text-align':"right"}}>
                    <button type="submit">Submit</button>
                    </div>
                    <Field render={props => <DisplayFormikState {...props} />} />
                    </div>
                </Form>
            </Formik>

        </Rnd></div>
);

export default Basic;