import React, { Component } from 'react';
import { Form, Button } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { hablaBlackLogo } from '../../img';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';
import String from '../../translations';
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
        this.setState({
          email: values.email,
          emailSent: true
        });
      }
    });
  }

  render() {
    return (
      <div className="recoverPassword-main-container">
        <div className="recoverPassword-header">
          <Link to="/app">
            <img src={hablaBlackLogo} alt={String.t('Header.logoAlt')} className="logo" />
          </Link>
        </div>
        <div className="recoverPassword-body">
          <Form onSubmit={this.handleSubmit} layout="vertical" className="recoverPassword-form">
            {!this.state.emailSent ?
              <h1>{String.t('RecoverPassword.forgotYourPassword')}</h1>
              :
              <h1>{String.t('RecoverPassword.emailSent')} <span className="email-sent__info">{String.t('RecoverPassword.checkEmail')}</span></h1>
            }

            <div className="recoverPassword-body__main">
              {!this.state.emailSent ?
                <div className="recoverPassword__field-wrapper">
                  <p className="recoverPassword__text">
                    {String.t('RecoverPassword.infoParagraph')}
                  </p>
                  <EmailField
                    form={this.props.form}
                    noLabel
                    required
                    placeholder="Email"
                  />
                </div>
                :
                <div className="recoverPassword__field-wrapper">
                  <h2 className="recoverPassword__user-email">{this.state.email}</h2>
                  <p>{String.t('RecoverPassword.infoParagraphAfterSentImage')}</p>
                </div>
              }
            </div>
            <div className="recoverPassword__buttons">
              <Button type="primary" htmlType="submit" onClick={this.onCancel} className="recoverPassword__login-form-button disable">
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="recoverPassword__login-form-button active">
                {String.t('Buttons.next')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

RecoverPassword.propTypes = propTypes;

export default Form.create()(RecoverPassword);
