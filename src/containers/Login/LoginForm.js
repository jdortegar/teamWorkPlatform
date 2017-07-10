import React, { Component } from 'react';
import { func } from 'prop-types';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';

class LoginForm extends Component {
  static propTypes = {
    loginUser: func.isRequired
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ email, password }) {
    console.log('Login', { email, password });
    this.props.loginUser({ email, password });
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>
          <strong> {field.label}</strong>{' '}
        </label>{' '}
        <input className="form-control" type="text" {...field.input} />{' '}
        <div className="text-help"> {touched ? error : ''} </div>{' '}
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="container">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field label="Email" name="email" component={this.renderField} />{' '}
          <Field
            label="Password"
            name="password"
            component={this.renderField}
            placeholder="Password"
          />{' '}
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

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Enter a password!';
  }

  return errors;
}

const mapDispatchToProps = dispatch => bindActionCreators({
  loginUser
}, dispatch);

export default reduxForm({
  form: 'login',
  validate
})(connect(null, mapDispatchToProps)(LoginForm));
