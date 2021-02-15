import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import history from "../../history";
import Homepage from "../homepage";
import Login from "../login";
import Signup from "../signup";

function App() {
  return (
    <div className="ui container">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/login/" component={Login} />
          <Route exact path="/signup/" component={Signup} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
