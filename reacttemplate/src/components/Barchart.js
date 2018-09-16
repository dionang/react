import React, { Component } from 'react';
import request from 'request';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Label, Legend, Tooltip, ResponsiveContainer, Text } from 'recharts';
import ChartForm from './ChartForm';
import JsonProcessor from './JsonProcessor';
import Descriptive from './Descriptive';
import { callbackify } from 'util';

class Barchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.properties,
            chartData: [],
            summaryData: {},
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
        let {title, datasourceUrl, path, xAxis, yAxis, aggregate, summary} = this.props.properties;
        this.initialize(title, datasourceUrl, path, xAxis, yAxis, aggregate, summary);
    }

    initialize (title, datasourceUrl, path, xAxis, yAxis, aggregate, summary, callback) {
        let self = this;
        request.get({
            url: datasourceUrl,
        }, function (error, response, body) {
            if(body){
                let data = JSON.parse(body);

                // iterate through the path until the correct dataset is reached
                for (let subpath of path.split("/")) {
                    data = data[subpath];
                }

                // aggregate the data for the chart
                let processor = new JsonProcessor();
                let aggregatedData = processor.getAggregatedData(data, xAxis, yAxis, aggregate, summary);
                let statSummary = {
                    sum: aggregatedData.sum, 
                    avg: aggregatedData.avg,
                    min: aggregatedData.min,
                    max: aggregatedData.max,
                    median: aggregatedData.median,
                    var: aggregatedData.var
                };

                // write the cal for the variance 
                self.setState({
                    initialized: true,
                    datasourceUrl: datasourceUrl,
                    title: title,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    aggregate: aggregate,
                    chartData: aggregatedData.chartData,
                    summary: summary,
                    summaryData: statSummary,
                });

                callback();
            }
        });
    }

    initializeChart = (values) => {
        //set settings of barchart
        let self = this;
        let {title, datasourceUrl, path, xAxis, yAxis, summary} = values;
        let aggregate = "sum"; // should get from form

        this.initialize(title, datasourceUrl, path, xAxis, yAxis, aggregate, summary, function(){
            let { chartData,summaryData, ...other } = self.state;
            self.props.updateProperties(other, self.props.i);
        });
    }

    render() {
        return (
            <div className="draggable" style={{ height: "100%" }}>
                { this.state.initialized ?
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
                            <Bar dataKey={this.state.yAxis} fill="#CD5C5C" isAnimationActive={false}/>
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
                        </ResponsiveContainer>}
                        {this.state.summary ? <Descriptive summaryData={this.state.summaryData}/> : ""}
                    </div>
                    : <ChartForm initializeChart={this.initializeChart} />
                }
            </div>
        );
    }
}

export default Barchart;