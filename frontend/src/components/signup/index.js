import React from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { NotificationManager } from "react-notifications";

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
      confirmPassword: "",
      email: "",
      hasAttemptedSubmit: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ hasAttemptedSubmit: true });

    try {
      const response = await axiosInstance.post("/user/create/", {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      });

      if (response.status === 207) {
        NotificationManager.error(response.data, "Signup Error", 3000);
        return;
      }

      this.props.dispatch(loginUser(response.data));
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  validateInput = () => {
    if (!this.state.hasAttemptedSubmit) {
      return true;
    }

    const passwordsMatch = this.state.confirmPassword === this.state.password;
    const passwordLengthValid = this.state.password.trim().length > 7;
    const isValid = passwordsMatch && passwordLengthValid;

    return isValid;
  };

  render() {
    return (
      <div className="signup-form-container">
        <h1>Signup</h1>
        <form className="signup-form" onSubmit={this.handleSubmit}>
          <label>
            <TextField
              required
              className={this.state.passwordError ? "invalid" : ""}
              label="Username"
              name="username"
              variant="outlined"
              onChange={this.handleChange}
            />
          </label>
          <label>
            <TextField
              required
              className={this.state.passwordError ? "invalid" : ""}
              label="Email"
              name="email"
              variant="outlined"
              onChange={this.handleChange}
            />
          </label>
          <label>
            <TextField
              required
              className={this.state.passwordError ? "invalid" : ""}
              error={!this.validateInput()}
              helperText="Please make sure your password is at least 8 characters long."
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              onChange={this.handleChange}
            />
          </label>
          <label>
            <TextField
              required
              className={this.state.confirmPasswordError ? "invalid" : ""}
              error={!this.validateInput()}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
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
