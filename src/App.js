import React, { Component } from 'react';
import './App.css';
import firebase  from './Config';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';

 class App extends Component {
  constructor() {
    super();
    this.state={
      localprompts: [],
      activeprompt: '',
      activepromptdate: '',
      checked: false
    }
  };
  
  componentDidMount() {
    let allTmp = [];
        firebase.database().ref("/").on("value", snapshot => {

      snapshot.forEach(snap => {
        allTmp.push(`${snap.ref.key}: ${snap.val()}`);
      
      });
      
    });
    this.setState({ localprompts: allTmp,});
    this.saveDB();
  };

componentDidUpdate() {
  if (this.state.localprompts === []) {
    this.populateLocalDB();
  } else {
    this.saveDB();
  }
}

  saveDB() {
    const items = [];
    const getItems = (() => {
      const fieldValue = localStorage.getItem('prompts');
      // console.log(localStorage)
      if (fieldValue !== null && fieldValue !== "undefined") {
        return JSON.parse(fieldValue);
      }
    });
    
    getItems();

    for(var i = 0; i < this.state.localprompts.length; i++) {
      items.push(this.state.localprompts[i]);
    };
    
    localStorage.setItem('prompts', JSON.stringify(items));
    
    // console.log(JSON.parse(JSON.stringify(localStorage.getItem('prompts'))));
  };

  populateLocalDB() {
    let allTmp = [];
    firebase.database().ref("/").on("value", (snapshot) => {
        snapshot.forEach((snap) => {
           allTmp.push(`${snap.ref.key}: ${snap.val()}`);  
          });      
        });
       this.setState({ localprompts: allTmp});
    this.saveDB();
  };
    
  generatePrompt = () => {
      var rand = Math.floor(Math.random() * 42);
      if (this.state.checked) {
        this.deleteItem(this.state.activeprompt);
        this.setState({
          checked: false
        })
      }  
        this.setState({
          activeprompt: this.state.localprompts[rand]
        });
      // console.log(this.state.localprompts[rand]);
     };

     deleteItem(activePrompt) {
       console.log(JSON.parse(localStorage.getItem('prompts')))
      var localDB = [...JSON.parse(localStorage.getItem('prompts'))];
      for (var i = 0; i < localDB.length; i++) {
        if (localDB[i] === activePrompt) {
          localDB.splice(i, 1);
        }
      }
      localStorage.setItem('prompts', JSON.stringify(localDB));
     };

  render() {
    // console.log(this.state.localprompts);
    return (
    <div className="App">
     <h1>Literary Argument Prompt Generator</h1>
    { (this.state.activeprompt !== '')
    ?  <div className="prompt">
    {this.state.activeprompt} 
      </div>
    : <div className="placeholdertext">
      <p>
          <h3>This page can be used to generate a random Literary Argument prompt from previous College Board AP Literature exams. </h3> <br />
          A full list of prompts can be found <a href="https://docs.google.com/document/d/1H1Q8N5WpAG7sgtCROOYMcOrmRFZR4EkxoDT_MRQLPWU/edit?usp=sharing">here</a>. Alternatively, they can be found on the College Board Website <a href='https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam/past-exam-questions?course=ap-english-literature-and-composition'>here</a>. <br />
          This website has no official affiliation with College Board. They own all the rights to all of this, I just made it for fun. 
       </p>
      </div>
    }
    <div className="generatewrapper">
      <button type="submit" style={{ marginRight: '35px', height: '32px'}} onClick={() => this.generatePrompt()}> Generate a Random Prompt </button> <br /> <br />
      { (this.state.activeprompt !== '') 
      ? <FormGroup>
          <FormControlLabel
            control={
              <Switch             
                checked={this.state.checked}
                onChange={(e) => {
                  this.setState({
                    checked: e.target.checked
                  })
                }} 
              />
            } 
            label="Remove Prompt"
          />
        </FormGroup>
      : null}
    </div>
    { (this.state.activeprompt !== '') 
      ? <button onClick={() => {this.setState({  activeprompt: '' })}}> Return Home </button>
      : null}
   </div>
  )
}
 }
export default App;