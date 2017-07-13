import React, { Component } from 'react';
import _ from 'lodash';
import { func } from 'prop-types';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import { countries } from '../../config/config.js';
import { getAllCountries } from 'countries-and-timezones';

const timezonesByCountry = getAllCountries();

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = { timezones: [] };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ email, password }) {
    this.props.loginUser({ email, password });
  }

  renderField({ input, label, meta: { touched, error }, ...custom }) {
    return (
      <TextField floatingLabelText={label} {...custom} {...input} errorText={touched && error} name="email" />
    );
  }

  renderCountries() {
    return countries.map(({ code, name }) => {
      return (
        <MenuItem key={code} value={code} primaryText={name} />
      );
    });
  }

  renderTimezones() {
    return this.state.timezones.map((timezone) => {
      return (
        <MenuItem key={timezone} value={timezone} primaryText={timezone} />
      )
    });
  }

  onCountryChange(value) {
    console.log(this.props);
    const code = `${value[0]}${value[1]}`; //get country code by joining value[0] and value[1]
    const { timezones } = timezonesByCountry[code];

    this.setState({ timezones });
  }


  //renders select field used for countries and timezone
  renderSelectField({ input, label, meta: { touched, error }, children, ...custom }) {
    return(
      <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => { input.onChange(value) }}
        children={children}
        {...custom}
      />
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const { buttonDivStyle, imageStyle, cardDivStyle, h2Style, pStyle } = styles;

    return (
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div style={cardDivStyle}>
            <img style={imageStyle} src="http://i63.tinypic.com/2hg6clh.png" />
          </div>
          <div className="row">
            <div className="col-xs-12 text-center">
              <div className="col-xs-6 col-xs-offset-3 col-sm-offset-4 col-sm-4">
              <RaisedButton fullWidth containerElement='label' label='Upload'>
                <input type="file" style={{ display: 'none' }} />
              </RaisedButton>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <Field label="Name" name="name" hintText="John" fullWidth component={this.renderField} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <Field label="Last Name" name="lastName" hintText="Smith" fullWidth component={this.renderField} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <Field label="Display Name" name="displayName" hintText="jsmith" fullWidth component={this.renderField} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <Field label="Email" disabled name="email" hintText="jsmith@example.com" fullWidth component={this.renderField} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <Field label="Password" type="password" name="password" hintText="" fullWidth component={this.renderField} />
            </div>
            <div className="col-xs-12 col-sm-6">
              <Field label="Confirm Password" type="password" name="confirmPassword" hintText="" fullWidth component={this.renderField} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <Field label="Country" name="country" onChange={this.onCountryChange.bind(this)} fullWidth component={this.renderSelectField}>
                {this.renderCountries()}
              </Field>
            </div>
            <div className="col-xs-12 col-sm-6">
              <Field label="Timezone" name="timezone" fullWidth component={this.renderSelectField}>
                {this.renderTimezones()}
              </Field>
            </div>
          </div>
          <div>
            <div style={buttonDivStyle}>
              { !this.props.submitting ?
                <FlatButton type="submit" label="Create" primary={true} /> :
                <CircularProgress style={{ marginRight: '10px'}} />
              }
            </div>
          </div>
        </form>

    );
  }
}

const styles = {
  pStyle: {
    paddingTop: '12px',
    fontSize: '12px'
  },
  imageStyle: {
    width: '128px'
  },
  h2Style: {
    paddingTop: '12px'
  },
  buttonDivStyle: {
    textAlign: 'right',
    paddingTop: '12px'
  },
  cardDivStyle: {
    textAlign: 'center',
    padding: '24px 0px 10px'
  }
};

//input validations
function validate(values) {
  const errors = {};

  if(!values.name) { //name is required field
    errors.name = "Required"
  }
  if(!values.lastName) { //last name is required field
    errors.lastName = "Required"
  }
  if(!values.country) { //country is required
    errors.country = "Required"
  }
  if(!values.confirmPassword) { //password is required
    errors.confirmPassword = "Required"
  }
  if(!values.timezone) { //timezone is required
    errors.timezone = "Required"
  }
  if(!values.password) { //password is required
    errors.password = "Required"
  }
  else if(values.password.length <= 8) { //check password length > 6
    errors.password = "Password must be longer than 8 characters"
  }
  else if(values.password !== values.confirmPassword) { //check if passwords match
    errors.password = "Passwords do not match"
  }

  return errors;
}

export default reduxForm({
  form: 'createAccount',
  validate
})(connect(null, null)(CreateAccount));
