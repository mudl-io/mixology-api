import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dropdown, DropdownButton } from "react-bootstrap";

import "./styles.scss";
import axiosInstance from "../../axiosApi";

// redux actions
import { logoutUser } from "../../features/users/usersSlice";

class PrimaryNavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = async () => {
    let response;
    try {
      response = await axiosInstance.post("/blacklist/", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      axiosInstance.defaults.headers["Authorization"] = null;

      this.props.dispatch(logoutUser());
    } catch (e) {
      console.log(e);
    } finally {
      return response;
    }
  };

  leftNavContent = () => {
    let content;

    if (this.props.user) {
      content = (
        <span className="cocktail-options-buttons">
          <Link className="nav-link" to="/create-cocktail/">
            Create a Cocktail
          </Link>
        </span>
      );
    }

    return content;
  };

  rightNavContent = () => {
    let content;

    if (this.props.user) {
      content = (
        <DropdownButton
          className="user-options-dropdown"
          variant="Secondary"
          title={this.props.user.username}
        >
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item as={Link} to={"/saved-cocktails/"}>
            Saved Cocktails
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={"/created-cocktails/"}>
            Created Cocktails
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
        </DropdownButton>
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
          {this.leftNavContent()}
          {this.rightNavContent()}
        </nav>
      </div>
    );
  }
}
export default connect()(PrimaryNavigationBar);
