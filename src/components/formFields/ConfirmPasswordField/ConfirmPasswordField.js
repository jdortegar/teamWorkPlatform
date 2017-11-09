import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Popover, Col, Row } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import {
  antValidate,
  equalityI18N, passwordI18N
} from '../../../validations';
import { formShape, layoutShape } from '../../../propTypes';
import BaseInput from '../BaseInput';
import PasswordRequirements from '../PasswordRequirements';
import messages from './messages';

const FormItem = Form.Item;

class ConfirmPasswordField extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: formShape.isRequired,
    componentKey: PropTypes.string,
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    layout: layoutShape,
    required: PropTypes.bool,
    missingMessage: PropTypes.string
  };

  static defaultProps = {
    componentKey: 'passwordConfirm',
    initialValue: null,
    placeholder: null,
    required: true,
    missingMessage: null,
    layout: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      isPopoverVisible: false
    };

    this.showPopover = this.updateStateWith({ isPopoverVisible: true });
    this.hidePopover = this.updateStateWith({ isPopoverVisible: false });
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateStateWith(state) {
    return () => this.setState(state);
  }

  updatePassword(event) {
    const value = event.target.value;
    this.setState({ password: value });
  }

  renderPasswordField() {
    const { componentKey, form, layout, placeholder, missingMessage, intl, ...rest } = this.props;
    const translatedPlaceHolder = placeholder || messages.password;
    const translatedMissingMessage = missingMessage || messages.passwordMissing;

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey,
      type: 'password',
      extraRules: [
        { validator: antValidate(passwordI18N(intl)) }
      ],
      onChange: this.updatePassword,
      onFocus: this.showPopover,
      onBlur: this.hidePopover,
      missingMessage: translatedMissingMessage,
      placeholder: translatedPlaceHolder
    });

    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={messages.password}
        hasFeedback
      >
        {decoratedInput}
        <Popover
          title={messages.passwordRequirement}
          placement="right"
          content={<PasswordRequirements password={this.state.password} />}
          visible={this.state.isPopoverVisible}
        />
      </FormItem>
    );
  }

  renderConfirmPasswordField() {
    const { componentKey, form, layout, intl, ...rest } = this.props;

    const comparator = value => value === form.getFieldValue(componentKey);
    const message = messages.passwordNoMatch;

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey: `${componentKey}Confirm`,
      type: 'password',
      extraRules: [
        { validator: antValidate(equalityI18N(intl, comparator, { equality: message })) }
      ],
      placeholder: messages.confirmPassword,
      missingMessage: messages.confirmPasswordMissing
    });

    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={messages.confirmPassword}
        hasFeedback
      >
        {decoratedInput}
      </FormItem>
    );
  }

  render() {
    return (
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          {this.renderPasswordField()}
        </Col>
        <Col className="gutter-row" span={12}>
          {this.renderConfirmPasswordField()}
        </Col>
      </Row>
    );
  }
}

export default injectIntl(ConfirmPasswordField);
