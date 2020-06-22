import React from 'react';
import Toolbar from './components/toolbar/Toolbar';
import Week from './components/week/Week';
import classes from './App.module.css';


import { Route, Switch } from 'react-router-dom';
import Day from './components/containers/day/Day';
import Aux from './components/hoc/auxiliary/auxiliary';


function App() {
  return (
    <Aux>
      <h3 className={classes.h2OfText}> Please enter the web page from a PC</h3>
    <div className={classes.App}>
      <Toolbar/>
      <Switch>
              <Route path="/" exact component={Week}/>
              <Route path="/day" component={Day}/>

              <Route render={()=> <h1> Not found</h1>}/>
      </Switch>



    </div>
    </Aux>
  );
}

export default App;
