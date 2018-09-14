import React, { Component } from 'react';
import request from 'request';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label, Legend, Tooltip, ResponsiveContainer, Text } from 'recharts';
import ChartForm from './ChartForm';
import JsonProcessor from './JsonProcessor';
import Descriptive from './Descriptive';

class Barchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData: [],
            summaryData: '',
            variance:0,
            median:[]
        }
    }

    // update state of initialized when props change
    componentWillReceiveProps(nextProps) {
        if (nextProps.properties.initialized != this.state.initialized) {
            this.setState({ initialized: nextProps.properties.initialized });
        }
    }

    // do API call to render chartData upon loading of component from DB
    componentWillMount() {
        let self = this;
        let url = this.props.properties.datasourceUrl;
        let aggregate = this.props.properties.aggregate;
        if (url) {
            request.get({
                url: url,
            }, function (error, response, body) {
                let data = JSON.parse(body);
                let chartData = data[self.props.properties.dataset];
                let xAxis = self.props.properties.xAxis;
                let yAxis = self.props.properties.yAxis;
                if (aggregate === "") {
                    chartData.sort((a, b) => a[xAxis] - b[xAxis]);
                } else {
                    chartData = new JsonProcessor().getAggregatedData(chartData, xAxis, yAxis, aggregate);
                }
                self.setState({ chartData });
            });
        }
    }

    initializeChart = (values) => {
        //set settings of barchart
        let self = this;
        let processor = values.processor;
        let datasourceUrl = values.datasourceUrl;
        let dataset = values.dataset;
        let data = processor.getDataset(dataset);


        let title = values.title;
        let xAxis = values.xAxis;
        let yAxis = values.yAxis;
        let aggregate = "";

        // if x-axis is non-categorical, 
        // sort data in ascending order by x-axis
        if (processor.getType(dataset, xAxis) !== "string") {
            data.sort((a, b) => a[xAxis] - b[xAxis]);
        } else {
            aggregate = "sum";
            data = processor.getAggregatedData(data, xAxis, yAxis, aggregate);
        }

        let summaryData = processor.getDetails(dataset, yAxis);
        let average = summaryData.average;
        
        let finalVariance = 0; 
        for (let obj of processor.getDataset(dataset)){
            finalVariance += (obj[yAxis]-average)*(obj[yAxis]-average);
        }

        finalVariance = finalVariance.toFixed(4);

        var collectArr =[];
        
        let check = false;
        let num = 0;
        let i = 0;
        for (let obj of processor.getDataset(dataset)){
            num = obj[yAxis];
            
            for( i = 0; i < collectArr.length; i++){
                if(collectArr[i][0]==num){
                    collectArr[i][1]++;
                    check = true;
                } 
            }
            if(check == false){
                collectArr.push([num,1]);
            } else {
                check = false;
            }
            
        }

        
        let maxCount = 0;
        var medianArr = [];
        for(i=0; i < collectArr.length;i++){
            
            if(maxCount<collectArr[i][1]){
                maxCount=collectArr[i][1];
                medianArr=[];
                medianArr.push(collectArr[i][0]);
            } else if(maxCount==collectArr[i][1]){
                medianArr.push(collectArr[i][0]);
            }
        }


        // write the cal for the variance 
        this.setState({
            initialized: true,
            datasourceUrl: datasourceUrl,
            dataset: dataset,
            title: title,
            xAxis: xAxis,
            yAxis: yAxis,
            aggregate: aggregate,
            chartData: data,
            summary: values.summary,
            summaryData: summaryData,
            variance: finalVariance,
            median:medianArr
        })

        let { chartData, ...other } = this.state;
        this.props.updateProperties(other, this.props.i);
    }

    render() {
        return (
            <div className="draggable" style={{ height: "100%" }}>
                {this.state.initialized ?
                    <div style={{ height: "calc(62.5% + 100px)" }}>
                        <p style={{ fontFamily: 'Georgia', textAlign: "center", fontSize: 20, }}> {this.state.title} </p>

                        {this.state.facetype ?
                            

                                <BarChart data={this.state.chartData} width={650} height={250} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={this.state.xAxis}>
                                        <Label value={this.state.xAxis} offset={-5} position="insideBottom" />
                                    </XAxis>
                                    <YAxis dataKey={this.state.yAxis}>
                                        <Label value={this.state.yAxis} offset={-10} position="insideLeft" angle={-90} />
                                    </YAxis>
                                    <Tooltip />
                                    <Bar dataKey={this.state.yAxis} fill="#CD5C5C" />
                                    {/* <Bar dataKey="neutral" fill="orange" /> */}
                                    {/* <Bar dataKey="negative" fill="grey" /> */}

                                    <Legend verticalAlign="top" height={20} />
                                </BarChart>

                            
                            :
                            
                                <ResponsiveContainer style={{height:"100%"}}>
                                    <BarChart data={this.state.chartData} width={730} height={250} margin={{ top: 1, right: 30, left: 20, bottom: 30 }}>
                                        <CartesianGrid strokeDa1sharray="3 3" />
                                        <XAxis dataKey={this.state.xAxis}>
                                            <Label value={this.state.xAxis} offset={-5} position="insideBottom" />
                                        </XAxis>
                                        <YAxis dataKey={this.state.yAxis}>
                                            <Label value={this.state.yAxis} offset={-10} position="insideLeft" angle={-90} />
                                        </YAxis>
                                        <Tooltip />
                                        <Bar dataKey={this.state.yAxis} fill="#CD5C5C" />
                                        {/* <Bar dataKey="neutral" fill="orange" /> */}
                                        {/* <Bar dataKey="negative" fill="grey" /> */}

                                        <Legend verticalAlign="top" height={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            

                        }
                    </div>

                    : <ChartForm initializeChart={this.initializeChart} />
                }
                <div style={{ marginTop: "20px" }} >
                    {this.state.summary ? <div>
                        <Descriptive summaryData={this.state.summaryData} variance = {this.state.variance} median = {this.state.median}></Descriptive> </div> : ""}
                    {/* summary={this.props.properties.summary} summaryData = {this.state.summaryData} */}
                </div>
            </div>
        );
    }
}

export default Barchart;