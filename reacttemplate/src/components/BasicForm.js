import React, { Component } from 'react';
import { Formik, Form, Field } from "formik";
import _ from "lodash";

var options = ['Sales', 'Costs', 'Forecast', 'Appointment', 'Profits'],
    MakeItem = function (X) {
        return <option>{X}</option>;
    };

var options2 = ['Sales2', 'Costs2', 'Forecast2', 'Appointment2', 'Profits2'],
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
        }
    }

    render() {
        return (
            <Formik
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 1000);
                }}
            >
                <Form style={{ textAlign: "center" }}>
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
                    <select name="dataSource" style={{ marginLeft: 10 }}>
                        {options.map(MakeItem)}
                    </select>

                    <br />
                    <br />

                    
                   
                    <div style={{ textAlign: "right" }}>
                        <button type="submit" onClick={this.onSubmit}>Submit</button>

                    </div>
                </Form>
            </Formik>
        )
    }
}

export default BasicForm;