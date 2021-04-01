import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { NotificationContainer } from "react-notifications";

import "./App.scss";
import history from "../../history";

import Homepage from "../homepage";
import Login from "../login";
import Signup from "../signup";
import PrimaryNavigationBar from "../primary-navigation-bar";
import CreateCocktailForm from "../create-cocktail-form";
import SavedCocktailsDisplay from "../saved-cocktails-display";
import CreatedCocktailsDisplay from "../created-cocktails-display";
import DynamicCocktailDisplayContainer from "../dynamic-cocktail-display-container";

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
            <Route
              exact
              path="/"
              component={() => (
                <Homepage isSignedIn={this.props.user ? true : false} />
              )}
            />
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
            <Route
              exact
              path="/saved-cocktails/"
              component={SavedCocktailsDisplay}
            />
            <Route
              exact
              path="/created-cocktails/"
              component={CreatedCocktailsDisplay}
            />
            <Route
              exact
              path="/cocktail/:id"
              component={DynamicCocktailDisplayContainer}
            />
          </Switch>
        </Router>

        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.users;
  return { user: user };
};

export default connect(mapStateToProps)(App);
