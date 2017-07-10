import React, { Component } from 'react';
import LoginForm from './LoginForm';
import styles from './styles.scss';
import cssModules from "react-css-modules";

export default class Login extends Component {
  submit = values => {
    // print the form values to the console
    console.log("Login: ", values);
  };
  render() {
    return <LoginForm onSubmit={this.submit} />;
  }
}

//export default cssModules(Login, styles, { allowMultiple: true });
