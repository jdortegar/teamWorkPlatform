import React, { Component } from "react";
import RegisterForm from "./RegisterForm";
import styles from "./styles.scss";
import cssModules from "react-css-modules";

class Register extends Component {
  submit = values => {
    // print the form values to the console
    console.log("Register: ", values);
  };
  render() {
    return <RegisterForm onSubmit={this.submit} />;
  }
}

export default cssModules(Register, styles, { allowMultiple: true });
