import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "./App.scss";
import history from "../../history";

import Homepage from "../homepage";
import Login from "../login";
import Signup from "../signup";
import PrimaryNavigationBar from "../primary-navigation-bar";
import CreateCocktailForm from "../create-cocktail-form";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app-container">
        <Router history={history}>
          <PrimaryNavigationBar user={this.props.user} />
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/login/">
              {this.props.user ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route exact path="/signup/">
              {this.props.user ? <Redirect to="/" /> : <Signup />}
            </Route>
            <Route
              exact
              path="/create-cocktail/"
              component={CreateCocktailForm}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.users;
  return { user: user };
};

export default connect(mapStateToProps)(App);
