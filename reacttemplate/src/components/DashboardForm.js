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

class DashboardForm extends Component {
    render() {
        return (
            
            <Formik 
                // initialize values to use in form
                initialValues={{
                    dataset: datasets[0],
                    datasourceUrl: datasourceUrl,
                    processor:jsonProcessor,
                    
                }}

                // pass values to the charts
                onSubmit={this.props.initialiseBreakdown}

               
                // render form
                render={formProps=>(
                    <Form name="title" className="draggable" style={{ zIndex: 100,height:"100%",width:"700px"}}>
                       
                        <label style={{fontFamily:'Georgia', textAlign:"center", fontSize:20, marginRight:"20px", marginTop:"10px" }}>Choose the dataset</label>
                        <Field component="select" name="dataset" style={{textAlign:"center",  marginRight:"20px",'border-radius': '20px', fontSize:"15px", width:"200px"}}>
                            {datasets.map((dataset)=>
                                <option key={dataset}>{dataset}</option>
                            )}
                        </Field>
                        <Button type="submit" bsStyle="warning" style={{backgroundColor:'#FF4500', font:"white"}}>Save the View</Button>
                        {/* <DisplayFormikState {...this.props}/> */}
                    </Form>
                )}
            />
        );
    }
}

export default DashboardForm;