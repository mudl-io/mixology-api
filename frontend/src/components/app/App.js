import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import history from "../../history";
import Homepage from "../homepage";

function App() {
  return (
    <div className="ui container">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Homepage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
