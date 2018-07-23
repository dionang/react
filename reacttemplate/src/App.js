import React, { Component } from 'react';
import { withFormik } from 'formik';
import Basic from './Basic';

class App extends React.Component {
  


  render () {
    

    return (
      <div style={{ border: "1px solid", height: "fit-content", width: "fit-content" }}><Basic/></div>
     
    );
  }
}



export default App;
