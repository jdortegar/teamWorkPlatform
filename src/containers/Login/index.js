import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';

class LoginForm extends Component {
  static propTypes = {
    history: object.isRequired,
    loginUser: func.isRequired
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ email, password }) {
    const targetRoute = this.props.history.location.state.from.pathname;
    this.props.loginUser({ email, password, targetRoute });
  }

  renderField({ input, label, meta: { touched, error }, ...custom }) {
    return (
      <TextField floatingLabelText={label} {...custom} {...input} errorText={touched && error} name="email" />
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
          <Field label="Email" name="email" hintText="jsmith@example.com" fullWidth component={this.renderField} />
          <Field label="Password" name="password" fullWidth component={this.renderField}/>
          <div style={buttonDivStyle}>
            { !this.props.submitting ?
              <FlatButton type="submit" label="Log In" primary={true} /> :
              <CircularProgress style={{ marginRight: '10px'}} />
            }
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

function mapStateToProps(state) {
  return { submitting: state.registerReducer.submitting };
}

export default reduxForm({
  form: 'login',
  validate
})(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
