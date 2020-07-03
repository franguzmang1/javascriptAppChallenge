import React from "react";
import Toolbar from "./components/toolbar/Toolbar";
import Week from "./components/containers/week/Week";
import classes from "./App.module.css";
import { Route, Switch } from "react-router-dom";
import Day from "./components/containers/day/Day";
import Aux from "./components/hoc/auxiliary/auxiliary";

function App() {
  return (
    <Aux>
      {/*Text displayed only if the width of the page is less than 700px */}
      <h3 className={classes.h2OfText}> Please enter the web page from a PC</h3>
      <div className={classes.App}>
        <Toolbar />
        <Switch>
          {/*Route for displaying the week (all days of the week)*/}
          <Route path="/" exact component={Week} />

          {/*Route for display a day*/}
          <Route path="/day" component={Day} />

          {/* Route for requests that are not in the above links*/}
          <Route
            render={() => <h1 className={classes.h1here}> Not found</h1>}
          />
        </Switch>
      </div>
    </Aux>
  );
}

export default App;
