import React from "react";
import { connect } from "react-redux";

import axiosInstance from "../../axiosApi";
import "./styles.scss";

// redux actions
import { loginUser } from "../../features/users/usersSlice";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("/user/create/", {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      });
      this.props.dispatch(loginUser(response.data));
      return response;
    } catch (error) {
      console.log(error.stack);
    }
  }

  render() {
    return (
      <div className="signup-form-container">
        <h1>Signup</h1>
        <form className="signup-form" onSubmit={this.handleSubmit}>
          <label>
            <div>Username:</div>
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </label>
          <label>
            <div>Email:</div>
            <input
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>
          <label>
            <div>Password:</div>
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label>
          <input
            className="signup-submit-button"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    );
  }
}

export default connect()(Signup);
