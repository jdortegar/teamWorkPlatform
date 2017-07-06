import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { loginUser } from "../../actions/auth";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>
          <strong> {field.label}:</strong>{" "}
        </label>{" "}
        <input className="form-control" type="text" {...field.input} />{" "}
        <div className="text-help"> {touched ? error : ""} </div>{" "}
      </div>
    );
  }

  onSubmit({ email, password }) {
    console.log("Login", { email, password });
    loginUser({ email, password });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="container">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field label="Email" name="email" component={this.renderField} />{" "}
          <Field
            label="Password"
            name="password"
            component={this.renderField}
            placeholder="Password"
          />{" "}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  //Validate the inputs from values
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Enter a password!";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: "login"
})(connect(null, actions)(LoginForm));
