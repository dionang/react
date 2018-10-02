import React, {Component} from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from 'react-bootstrap';
import request from 'request';
import '../bootstrap.css';

// hard coded for now
let api = 'http://localhost:8084/';

class ChartForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datasources: [],
            datasets: [],
            listOptions: []
        }
    }

    componentDidMount() {
        this.loadDatasource();
    }

    loadDatasource(){
        let self = this;
        request.post({
            url: api + 'loadDatasource',
            json: true,
            body: { operation: "loadDatasource", companyId: 1 }
        }, function (error, response, body) {
            if (body) {
                let datasources = body.datasource;
                if (datasources.length > 0) {
                    self.loadDataset(datasources[0].id, {values:{}});
                }
                self.setState({ datasources });
            }
        });
    }

    loadDataset(datasourceId, formProps){
        let self = this;
        request.post({
            url: api + 'loadDataset',
            json: true,
            body: { operation: "loadDataset", datasourceId: datasourceId }
        }, function (error, response, body) {
            if (body) {
                let datasets = body.dataset;
                if (datasets.length > 0) {
                    formProps.values.path = datasets[0].path;
                    self.loadListOptions(datasets[0].id, formProps);
                }

                for (let datasource of self.state.datasources) {
                    // assign the correct datasourceUrl to formProps upon changing
                    if (datasource.id == datasourceId) {
                        formProps.values.datasourceUrl = datasource.url;
                        break;
                    }
                }
                self.setState({ datasets });
            }
        });
    }

    loadListOptions(datasetId, formProps){
        let self = this;
        request.post({
            url: api + 'loadListOptions',
            json: true,
            body: { operation: "loadListOptions", datasetId: datasetId }
        }, function (error, response, body) {
            if (body) {
                let listOptions = body.list;
                let initXAxis = false;
                let initYAxis = false;
                for (let listOption of listOptions) {
                    // assign the correct datasourceUrl to formProps upon changing
                    if (listOption.infoType === "categorical" && !initXAxis) {
                        formProps.values.xAxis = listOption.value;
                        initXAxis = true;
                    } else if (listOption.infoType === "numerical" && !initYAxis) {
                        formProps.values.yAxis = listOption.value;
                        initYAxis = true;
                    }

                    if(initXAxis && initYAxis) {
                        break;
                    }
                }
                
                self.setState({ listOptions });
            }
        });
    }

    render() {
        let self = this;
        return (
            <Formik 
                // initialize values to use in form
                initialValues={{
                    title:'', 
                    path: '',
                    summary:false,
                }}

                // pass values to the charts
                onSubmit={this.props.initializeChart}

                // render form
                render={formProps=>(
                    <Form className="form-horizontal draggable" style={{ height:"100%", width:"100%", backgroundColor:"white"}}>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Chart Title</label>
                            <div className="col-md-7">
                                <Field className="form-control nonDraggable" type="text" name="title" placeholder="Chart Title" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Choose the datasource</label>
                            <div className="col-md-7">
                                <Field className="form-control" component="select" name="datasource" onChange={(e)=>this.loadDataset(e.target.value, formProps)}>
                                    {self.state.datasources.map((datasource)=>
                                        <option key={"datasource" + datasource.id} value={datasource.id}>{datasource.name}</option>
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Choose the dataset</label>
                            <div className="col-md-7">
                                <Field className="form-control" component="select" name="path" onChange={(e)=>this.loadListOptions(e.target.value, formProps)}>
                                    {self.state.datasets.map((dataset)=>
                                        <option key={"path" + dataset.id} value={dataset.id}>{dataset.name}</option>
                                    )}  
                                </Field>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Choose the X&#8209;Axis</label>
                            <div className="col-md-7">
                                <Field className="form-control" component="select" name="xAxis">
                                    {/* gets the option based on selected dataset */}
                                    {self.state.listOptions.map((listOption)=>
                                        {if(listOption.infoType === "categorical") {
                                            return <option key={"listOption" + listOption.value} value={listOption.value}>{listOption.name}</option>
                                        }}
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-3 control-label">Choose the Y&#8209;Axis</label>
                            <div className="col-md-7">
                                <Field className="form-control" component="select" name="yAxis">
                                    {self.state.listOptions.map((listOption)=>
                                        {if(listOption.infoType === "numerical") {
                                            return <option key={"listOption" + listOption.value} value={listOption.value}>{listOption.name}</option>
                                        }}
                                    )}
                                </Field>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-md-offset-3 col-md-7">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" name="summary" onChange={function(){
                                            formProps.values.summary = !formProps.values.summary;
                                        }}/> Show Summary Statistics
                                    </label>
                                </div>
                            </div>
                        </div>
                        <Button className="col-md-offset-5 col-md-2" type="submit">Submit</Button>
                        
                        {/* <DisplayFormikState {...this.props}/> */}
                    </Form>
                )}
            />
        );
    }
}

export default ChartForm;