import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "./App.scss";
import history from "../../history";
import axiosInstance from "../../axiosApi";

import Homepage from "../homepage";
import Login from "../login";
import Signup from "../signup";
import PrimaryNavigationBar from "../primary-navigation-bar";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: localStorage.getItem("access_token") ? true : false,
    };
  }

  login = async (username, password) => {
    let response;
    try {
      response = await axiosInstance.post("/token/obtain/", {
        username: username,
        password: password,
      });

      axiosInstance.defaults.headers["Authorization"] =
        "JWT " + response.data.access;
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
    } catch (error) {
      throw error;
    } finally {
      this.setState({ isLoggedIn: true });
      return response.data;
    }
  };

  logout = async () => {
    let response;
    try {
      response = await axiosInstance.post("/blacklist/", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      axiosInstance.defaults.headers["Authorization"] = null;
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoggedIn: false });
      return response;
    }
  };

  render() {
    return (
      <div className="ui container">
        <Router history={history}>
          <PrimaryNavigationBar
            logout={this.logout}
            isLoggedIn={this.state.isLoggedIn}
          />
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/login/">
              {this.state.isLoggedIn ? (
                <Redirect to="/" />
              ) : (
                <Login login={this.login} />
              )}
            </Route>
            <Route exact path="/signup/" component={Signup} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
