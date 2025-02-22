import React, { Component } from 'react';
import { Form, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

import { buildApiUrl } from 'src/lib/api';
import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { Button, EmailField } from 'src/components';
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
      emailSent: false
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
        const { email } = values;
        this.setState({ sending: true, email });

        // TODO: Move this to Redux
        axios
          .post(buildApiUrl('users/forgotPassword'), { email })
          .then(() => {
            this.setState({ sending: false, emailSent: true });
          })
          .catch(error => {
            this.setState({ sending: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    return (
      <div className="recoverPassword-body">
        <Form onSubmit={this.handleSubmit} layout="vertical" className="recoverPassword-form">
          {!this.state.emailSent ? (
            <div className="habla-big-title habla-bold-text align-center-class padding-class-b">
              {String.t('RecoverPassword.forgotYourPassword')}
            </div>
          ) : (
            <div className="habla-big-title align-center-class padding-class-b">
              <span className="habla-bold-text">{String.t('RecoverPassword.emailSent')}</span>
              <span className="email-sent__info">{String.t('RecoverPassword.checkEmail')}</span>
            </div>
          )}
          <div className="recoverPassword-body__main habla-color-lightergrey padding-class-b align-center-class">
            <div className="habla-full-content float-center-class">
              {!this.state.emailSent ? (
                <div className="recoverPassword__field-wrapper">
                  <p className="recoverPassword__text">{String.t('RecoverPassword.infoParagraph')}</p>
                  <div className="margin-top-class-a">
                    <EmailField
                      form={this.props.form}
                      noLabel
                      required
                      placeholder="Email"
                      initialValue={sessionStorage.getItem('habla-user-email')}
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div className="recoverPassword__field-wrapper">
                  <h2 className="recoverPassword__user-email habla-big-title habla-bold-text">
                    <i className="fa fa-envelope" aria-hidden="true" /> {this.state.email}
                  </h2>
                  <p className="margin-top-class-a">{String.t('RecoverPassword.infoParagraphAfterSentImage')}</p>
                </div>
              )}
            </div>
          </div>
          {this.state.sending ? (
            <div className="align-center-class margin-top-class-a">
              <Spin size="large" />
            </div>
          ) : (
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
              {!this.state.emailSent && (
                <Button disabled={this.state.sending} type="main" fitText htmlType="submit">
                  {String.t('Buttons.next')}
                </Button>
              )}
            </div>
          )}
        </Form>
      </div>
    );
  }
}

RecoverPassword.propTypes = propTypes;

export default Form.create()(RecoverPassword);
