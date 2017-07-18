import React, { Component } from "react";
import { Card } from 'material-ui/Card';
import { Field, reduxForm } from "redux-form";
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from "react-redux";
import * as actions from "../../actions";
import { registerUser } from "../../actions/auth";

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  renderField({ input, label, meta: { touched, error }, ...custom }) {
    return (
      <TextField floatingLabelText={label} {...custom} {...input} errorText={touched && error} name="email" />
    );
  }

  onSubmit({ email }) {
    this.props.registerUser({ email });
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    const { buttonDivStyle, imageStyle, cardDivStyle, cardStyle, h2Style, pStyle } = styles;

    return (
      <div>
        <div className="front">
          <Card style={cardStyle}>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div style={cardDivStyle}>
                <img style={imageStyle} src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" />
                <h2 style={h2Style}>Habla AI</h2>
              </div>
              <Field name="email" hintText="jsmith@example.com" label="Email" fullWidth component={this.renderField} />
              <p style={pStyle}>By clicking on sign up, you agree to our <i><Link target="_blank" to="http://www.habla.ai/terms-of-service">terms</Link></i> and <i><Link to="http://www.habla.ai/privacy">privacy policy</Link></i></p>
              <div style={buttonDivStyle}>
                { !this.props.submitting ?
                  <FlatButton type="submit" label="Sign Up" primary={true} /> :
                  <CircularProgress style={{ marginRight: '10px'}} />
                }
              </div>
            </form>
          </Card>
        </div>
        <div className="back">
            <Card style={cardStyle}>
              <div style={cardDivStyle}>
                <img style={imageStyle} src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" />
                <h2 style={h2Style}>Habla AI</h2>
              </div>
              <div className="text-center" style={{ paddingTop: '20px' }}>
                <h4>Thank you for joining Habla AI! To finish signing up, please check your email to verify your account.</h4>
              </div>
            </Card>
        </div>
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

  return errors;
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
  cardStyle: {
    padding: '0 20px 12px'
  },
  cardDivStyle: {
    textAlign: 'center',
    padding: '24px 0px 10px'
  }
};

function mapStateToProps (state) {
  return { submitting: state.registerReducer.submitting };
}

export default reduxForm({
  validate,
  form: "register"
})(connect(mapStateToProps, actions)(RegisterForm));
