function JsonProcessor(json) {
    // to prevent scope errors of the this keyword
    if (!(this instanceof JsonProcessor)){
        return new JsonProcessor(json);
    }

    if (json === undefined) {
        return;
    }
    
    this.json = json;
    this.result = {datasets:{}};

    //initialize result object
    for (let key in json) {
        let value = json[key];
        
        //props is an object that stores the properties of the particular key of the json data
        let props = {};

        // if value is an array
        if(typeof(value) === "object" && value.length !== undefined){

            props.type = "list";
            props.length = value.length;

            // get the first object of the list
            if (value.length > 0 && typeof(value[0]) === "object") {
                let firstObj = value[0];
                props.options = []

                // for each property in the first object
                for (let objKey in firstObj){
                    let objValue = firstObj[objKey];

                    // create an array of fields that are choosable
                    props.options.push(objKey);
                    let newObj = {};

                    if (typeof(objValue) === "number"){
                        newObj.type = "number";
                        newObj.min = objValue;
                        newObj.max = objValue;
                        newObj.total = 0;
                        props[objKey] = newObj;
                    } else {
                        let date = parseDate(objValue);
                        if(date !== null) {
                            newObj.type = "date";
                            newObj.min = objValue;
                            newObj.minTime = date.getTime();
                            newObj.max = objValue;
                            newObj.maxTime = date.getTime();
                            props[objKey] = newObj;
                        } else {
                            newObj.type = "string";
                            newObj.categories = {};
                            props[objKey] = newObj;
                        }
                    }
                }
            }

            // iterate through objects in the list
            for(let obj of value){
                // for each option in the options list
                for(let option of props.options) {
                    // update props min and max
                    let objectField = props[option];
                    let currValue = obj[option];
                    
                    if (objectField.type === "number")  {
                        objectField.total += currValue;
                        if(currValue < objectField.min){
                            objectField.min = currValue;
                        } else if (currValue > objectField.max){
                            objectField.max = currValue;
                        }
                    } else if (objectField.type === "string"){
                        if(currValue in objectField.categories){
                            objectField.categories[currValue] += 1;
                        } else {
                            objectField.categories[currValue] = 1;
                        }
                    } else if (objectField.type === "date"){
                        let currTime = parseDate(currValue).getTime();
                        if (currTime < objectField.minTime) {
                            objectField.min = currValue;
                            objectField.minTime = currTime;
                        } else {
                            objectField.max = currValue;
                            objectField.maxTime = currTime;
                        }
                    }
                }
            }

            // calculate the average of each props that is a number
            for(let option of props.options) {
                // update props min and max
                let objectField = props[option];
                if (objectField.type === "number")  {
                    objectField.average = objectField.total / props.length;
                }
            }
            
            //add object to dataset
            this.result.datasets[key] = props;

        } else {
            props.type = typeof(value);
            
            //add object to result
            this.result[key] = props;
        }
    }
}

JsonProcessor.prototype.getDatasetNames = function(){
    let result = [];
    for (let datasetName in this.result.datasets){
        // get the name of the dataset and add it to result
        result.push(datasetName);
    }
    return result;
};

JsonProcessor.prototype.getDataset = function(datasetName){
    return this.json[datasetName];
};

JsonProcessor.prototype.getOptions = function(dataset){
    let ds = this.result.datasets[dataset];
    if (ds === undefined){
        return [];
    } else {
        return ds.options;
    }
};

JsonProcessor.prototype.getNumericalOptions = function(dataset){
    let ds = this.result.datasets[dataset];
    if (ds === undefined){
        return [];
    } else {
        let options = [];
        for (let option of ds.options) {
            if (this.getDetails(dataset, option).type === "number") {
                options.push(option);
            }
        }
        return options;
    }
};

JsonProcessor.prototype.getTypes = function(dataset){
    let list = this.result.datasets[dataset];
    let result = {};
    for(let option of list.options){
        result[option] = list[option].type;
    }
    return result;
};

JsonProcessor.prototype.getType = function(dataset, option){
    return this.result.datasets[dataset][option].type;
};

JsonProcessor.prototype.getDetails = function(dataset, option){
    return this.result.datasets[dataset][option];
};

JsonProcessor.prototype.getAggregatedData = function(data, xAxis, yAxis, operation){
    let aggregatedData = {};
    // add value to the appropriate categpry
    for (let obj of data){
        let category = obj[xAxis];
        let value = obj[yAxis];
        if (aggregatedData[category] === undefined) {
            aggregatedData[category] = [];
        }
        aggregatedData[category].push(value);
    }

    // do appropriate aggregation
    let newData = [];
    for (let category in aggregatedData) {
        let values = aggregatedData[category];
        let obj = {};
        obj[xAxis] = category;
        if (operation === "sum"){
            console.log("sum");
            obj[yAxis] = values.reduce((prev, curr) => prev + curr);
        } else if (operation === "avg"){
            obj[yAxis] = values.reduce((prev, curr) => prev + curr) / values.length;
        } else if (operation === "max") {
            obj[yAxis] = Math.max(...values);
        } else if (operation === "min") {
            obj[yAxis] = Math.min(...values);
        } else if (operation === "median") {
            // sort numbers in ascending order, because JS inbuilt sort doesn't sort numbers correctly
            values.sort((a, b) => a - b);
            let half = Math.floor(values.length/2);
            if(values.length % 2) {
                obj[yAxis] = values[half];
            } else {
                obj[yAxis] = (values[half-1] + values[half]) / 2;
            }
        } else if(operation==="variance"){
            console.log("variance");
            console.log("variance");
            let avg = values.reduce((prev, curr) => prev + curr) / values.length;
            console.log(avg);
            obj[yAxis] = values.reduce((prev,curr)=>(prev-avg)*(prev-avg)+(curr-avg)*(curr-avg))
        }
        newData.push(obj);
    }
    return newData;
}

function parseDate(dateString){
    var m = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
}

export default JsonProcessor;