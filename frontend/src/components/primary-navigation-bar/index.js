import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

import "./styles.scss";
import axiosInstance from "../../axiosApi";

class PrimaryNavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  rightNavContent = () => {
    let content;

    if (this.props.isLoggedIn) {
      content = (
        <Button
          variant="contained"
          className="logout-button"
          onClick={this.props.logout}
        >
          Logout
        </Button>
      );
    } else {
      content = (
        <span className="login-signup-buttons">
          <Link className="nav-link" to="/login/">
            Login
          </Link>
          <Link className="nav-link" to="/signup/">
            Sign Up
          </Link>
        </span>
      );
    }

    return content;
  };

  render() {
    return (
      <div className="primary-navigation-bar">
        <nav>
          <Link className="nav-link homepage" to="/">
            <img className="site-logo-nav" src="/defaultimg.png" />
            <span>Mixed In</span>
          </Link>
          {this.rightNavContent()}
        </nav>
      </div>
    );
  }
}
export default PrimaryNavigationBar;
