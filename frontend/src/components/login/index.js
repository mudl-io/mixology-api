import React from "react";

import "./styles.scss";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  render() {
    return (
      <div className="login-form-container">
        <h1>Login</h1>
        <form className="login-form" onSubmit={this.handleSubmit}>
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
export default Login;
