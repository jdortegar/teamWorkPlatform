import React, { Component } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../../config/env';
import { getJwt } from '../../session';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';
import String from '../../translations';
import Button from '../../components/common/Button';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.object.isRequired
};

class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      sending: false,
      sentEmail: false
    };

    this.onCancel = this.onCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onCancel() {
    this.props.history.replace('/login');
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const email = values.email;
        const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
        this.setState({ sending: true, email });

        axios.post(`${config.hablaApiBaseUri}/users/forgotPassword`, { email }, axiosOptions)
          .then(() => {
            this.setState({ sending: false, emailSent: true });
            window.location.href = '/app/login';
          }).catch((error) => {
            this.setState({ sending: false, error });
          });
      }
    });
  }

  render() {
    return (
      <div className="recoverPassword-body">
        <Form onSubmit={this.handleSubmit} layout="vertical" className="recoverPassword-form">
          {!this.state.emailSent ?
            <div className="habla-big-title habla-bold-text align-center-class padding-class-b">{String.t('RecoverPassword.forgotYourPassword')}</div>
            :
            <div className="habla-big-title align-center-class padding-class-b">
              <span className="habla-bold-text">
                {String.t('RecoverPassword.emailSent')}
              </span>
              <span className="email-sent__info">
                {String.t('RecoverPassword.checkEmail')}
              </span>
            </div>
          }
          <div className="recoverPassword-body__main habla-color-lightergrey padding-class-b align-center-class">
            <div className="habla-full-content float-center-class">
              {!this.state.emailSent ?
                <div className="recoverPassword__field-wrapper">
                  <p className="recoverPassword__text">
                    {String.t('RecoverPassword.infoParagraph')}
                  </p>
                  <div className="margin-top-class-a">
                    <EmailField
                      form={this.props.form}
                      noLabel
                      required
                      placeholder="Email"
                    />
                  </div>
                </div>
                :
                <div className="recoverPassword__field-wrapper">
                  <h2 className="recoverPassword__user-email habla-big-title habla-bold-text">
                    <i className="fa fa-envelope" aria-hidden="true" /> {this.state.email}
                  </h2>
                  <p className="margin-top-class-a">{String.t('RecoverPassword.infoParagraphAfterSentImage')}</p>
                </div>
              }
            </div>
          </div>
          <div className="align-center-class margin-top-class-a">
            <Button
              disabled={this.state.sending}
              type="secondary"
              fitText
              onClick={this.onCancel}
              className="margin-right-class-a"
            >
              {String.t('Buttons.cancel')}
            </Button>
            <Button
              disabled={this.state.sending}
              type="main"
              fitText
              htmlType="submit"
            >
              {String.t('Buttons.next')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

RecoverPassword.propTypes = propTypes;

export default Form.create()(RecoverPassword);
