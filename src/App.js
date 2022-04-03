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
      checked: false,
      lastprompt: '',
    }
  };
  
  componentDidMount() {
    let allTmp = [];
        firebase.database().ref("/").on("value", snapshot => {

      snapshot.forEach(snap => {
        allTmp.push(`${snap.ref.key}: ${snap.val()}`);      
      });
      
    });
    this.setState({ localprompts: allTmp });
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
    this.setState({ localprompts: allTmp });
    this.saveDB();
  };
    
    generatePrompt = () => {
      var rand = Math.floor(Math.random() * this.state.localprompts.length);
      if (this.state.checked) {
        this.deleteItem(this.state.activeprompt);
      } else {
        this.setState({
          activeprompt: this.state.localprompts[rand]
        });
      }
    };

     deleteItem(activePrompt) {
      // Make a temporary copy of our state DB of prompts
      var localDB = [...this.state.localprompts];
      // Check if the current prompt exists in localStorage
      if (localStorage.prompts.includes(activePrompt)) {
        // If it does, save the item's DB location (index)
        var deleteIndex = localDB.indexOf(activePrompt);
      
        // Remove the item in localDB
        localDB.splice(deleteIndex, 1);

        var rand = 0;
        if (localDB.length > 1) {
          rand = Math.floor(Math.random() * localDB.length);
        }
        // Set localStorage to the updated DB
        localStorage.setItem('prompts', JSON.stringify(localDB));
        // Overwrite the component state to use the updated DB
        this.setState({ localprompts: localDB, activeprompt: localDB[rand] });
      }
    }

    renderContent() {
      if (this.state.localprompts === [] || ( this.state.activeprompt === undefined && this.state.localprompts.length === 0 )) {
        return (<div className="prompt"> Hi! So ya broke it huh? No worries, let's go ahead and reset the database and start fresh :).</div>);
      } 
      if (this.state.activeprompt !== '' && this.state.localprompts !== [] && this.state.activeprompt !== undefined) {
        return (<div className="prompt">
          {this.state.activeprompt} 
        </div>);
      } else {
        return (<div className="placeholdertext">
        <span>
          <h3>This page can be used to generate a random Literary Argument prompt from previous College Board AP Literature exams. </h3> <br />
          A full list of prompts can be found <a href="https://docs.google.com/document/d/1H1Q8N5WpAG7sgtCROOYMcOrmRFZR4EkxoDT_MRQLPWU/edit?usp=sharing">here</a>. Alternatively, they can be found on the College Board Website <a href='https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam/past-exam-questions?course=ap-english-literature-and-composition'>here</a>. <br />
          This website has no official affiliation with College Board. They own all the rights to all of this, I just made it for fun. 
        </span>
        </div>);
      }
    }

    resetDB() {
      this.setState({ checked: false, activeprompt: '' }, () => {
        this.populateLocalDB();
      });
    }

  render() {
    return (
    <div className="App">
     <h1>Literary Argument Prompt Generator</h1>
    {this.renderContent()}
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
        ? <div
            style={{
              marginTop: '16px',
              height: '32px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }} 
          > 
            <button onClick={() => {this.setState({  activeprompt: '' })}}> Return Home </button>
          </div>
        : null
      }
    <div
      style={{
        marginTop: '16px',
        height: '32px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }} 
    >
      <button
        type="submit"
        onClick={() => {
          this.resetDB();
        }
      }> Reset Database </button>
    </div>
   </div>
  )
}
 }
export default App;