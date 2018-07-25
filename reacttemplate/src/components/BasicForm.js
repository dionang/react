import React, { Component } from 'react';
import { render } from "react-dom";
import { Formik, Form, Field } from "formik";
import ReportComponent from './ReportComponent';
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


const lineChartData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

class BasicForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // initial state has two line charts
            components: [
                { type: "line", x: 10, y: 10, height: 200, width: 300, data: lineChartData }
            ]
        }
    }

    submitData= () =>{
        let components = this.state.components;
        components.push(
            {type:"basic"}
        );
        this.setState({components});
    }


    render() {

        return (
            <div className="app" >
                <Rnd style={{ border: "1px solid", height: "fit-content", align: "center", padding: "10px", background: "white" }} >

                    <h3>Choose your data </h3>

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
                                <select name="dataSource" style={{ "margin-left": 10 }}>
                                    {options.map(MakeItem)}
                                </select>

                                <br />
                                <br />

                                <label name="xAixsName" >Choose the X-Axis  </label>
                                <select name="xAixs" style={{ "margin-left": 10 }}>
                                    {options.map(MakeItem)}
                                </select>

                                <br />
                                <br />

                                <label name="yAixsName" >Choose the Y-Axis  </label>
                                <select name="yAixs" style={{ "margin-left": 10 }}>
                                    {options.map(MakeItem)}
                                </select>

                                <br />
                                <br />

                                <div style={{ 'text-align': "right" }}>
                                    <button type="submit" onClick={this.submitData}>Submit</button>
                                    
                                </div>
                                <Field render={props => <DisplayFormikState {...props} />} />
                            </div>
                        </Form>
                    </Formik>

                </Rnd></div>)
    }
}

export default BasicForm;