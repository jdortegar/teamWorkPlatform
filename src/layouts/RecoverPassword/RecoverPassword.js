import React, { Component } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
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
            <Button type="secondary" fitText onClick={this.onCancel} className="margin-right-class-a">{String.t('Buttons.cancel')}</Button>
            <Button type="main" fitText htmlType="submit">{String.t('Buttons.next')}</Button>
          </div>
        </Form>
      </div>
    );
  }
}

RecoverPassword.propTypes = propTypes;

export default Form.create()(RecoverPassword);
