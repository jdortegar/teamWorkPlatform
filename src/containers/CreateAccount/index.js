import React, { Component } from 'react';
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

const items = [
  <MenuItem key={1} value={1} primaryText="United States" />,
  <MenuItem key={2} value={2} primaryText="Canada" />,
  <MenuItem key={3} value={3} primaryText="Mexico" />,
];

class CreateAccount extends Component {
  constructor(props) {
    super(props);

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

  //renders select field used for countries and timezone
  renderSelectField({ input, label, meta: { touched, error }, children, ...custom }) {
    return(
      <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
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
            <img style={imageStyle} src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" />
            <h2 style={h2Style}>Habla AI</h2>
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
              <Field label="Country" name="country" fullWidth component={this.renderSelectField}>
                {items}
              </Field>
            </div>
            <div className="col-xs-12 col-sm-6">
              <Field label="Timezone" name="country" fullWidth component={this.renderSelectField}>
                {items}
              </Field>
            </div>
          </div>
          <div className="row" style={{ paddingTop: '24px' }}>
            <div className="col-xs-12 col-sm-6">
              <RaisedButton fullWidth containerElement='label' label='Upload Icon'>
                <input type="file" style={{ display: 'none' }} />
              </RaisedButton>
            </div>
            <div className="col-xs-12 col-sm-6">

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
  if(!values.password) { //password is required
    errors.password = "Required"
  }
  else if(values.password.length <= 6) { //check password length > 6
    errors.password = "Password must be longer than 6 characters"
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
