import React from 'react';
import PropTypes from 'prop-types';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Link } from 'react-router-dom';

import { Modal, Form, Input, Select, Button, message, Checkbox } from 'antd';
import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { hablaGrayLogo } from 'src/img';
import countriesObj from './countries';

require('@babel/polyfill');

const propTypes = {
  stripe: PropTypes.object,
  form: formShape.isRequired,
  visible: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  showPaymentModal: PropTypes.func.isRequired,
  paymentData: PropTypes.object.isRequired,
  updateSubscription: PropTypes.func.isRequired,
  subscriptionEmail: PropTypes.string
};

const defaultProps = {
  stripe: null,
  subscriptionEmail: null
};

const FormItem = Form.Item;
const { Option } = Select;

const countries = countriesObj.map(({ name, code }) => (
  <Option key={code} value={code}>
    {name}
  </Option>
));

class StripeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCancel = () => {
    this.props.showModal();
    this.props.showPaymentModal(false);
  };

  async handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { paymentData } = this.props;
        this.setState({ loading: true });

        const { token } = await this.props.stripe.createToken({
          name: values.cardName,
          email: values.email,
          country: values.country,
          address1: values.address1,
          address2: values.address2,
          zipCode: values.zipCode,
          city: values.city,
          state: values.state
        });

        const valuesToSend = {
          subscriptionId: paymentData.subscriptionId,
          subscriberOrgId: paymentData.subscriberOrgId,
          promocode: paymentData.promocode,
          users: paymentData.users,
          subscriptionType: paymentData.subscriptionType,
          amount: paymentData.payAmount,
          customerId: paymentData.customerId,
          token: token.id,
          cancel_at_period_end: false
        };

        this.props
          .updateSubscription(valuesToSend)
          .then(() => {
            this.setState({ loading: false });
            this.props.showPaymentModal(false);
            message.success(String.t('paymentModal.subscriptionPaid'));
          })
          .catch(error => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { paymentData, subscriptionEmail } = this.props;

    return (
      <div>
        <Modal visible={visible} footer={null} closable={false}>
          <div className="Payment_Modal_container">
            <div className="Modal_header">
              <img src={hablaGrayLogo} alt={String.t('Header.logoAlt')} className="img HablaGrayLogo" />
              <h5 className="Modal_title">
                <span className="habla-bold-text">{String.t('paymentModal.title')}</span>
              </h5>
            </div>
            <Form onSubmit={this.handleSubmit} layout="vertical">
              <div className="Modal_body">
                <div className="subscription_Options">
                  <div className="label">{String.t('paymentModal.informationTitle')}</div>

                  <FormItem>
                    {getFieldDecorator('email', { initialValue: subscriptionEmail, rules: [{ required: true }] })(
                      <Input placeholder={String.t('paymentModal.email')} />
                    )}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('cardName', {
                      rules: [{ required: true }]
                    })(<Input placeholder={String.t('paymentModal.cardName')} />)}
                  </FormItem>

                  <FormItem className="Stripe__Card_input">
                    <CardElement />
                  </FormItem>
                  <div className="label">{String.t('paymentModal.addressTitle')}</div>

                  <FormItem>
                    {getFieldDecorator('country', {
                      rules: [{ required: true }]
                    })(
                      <Select placeholder={String.t('paymentModal.country')} optionFilterProp="children">
                        {countries}
                      </Select>
                    )}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('address1', {
                      rules: [{ required: true }]
                    })(<Input placeholder={String.t('paymentModal.address1')} />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('address2')(<Input placeholder={String.t('paymentModal.address2')} />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('zipCode', {
                      rules: [{ required: true }]
                    })(<Input placeholder={String.t('paymentModal.zipCode')} />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('city', {
                      rules: [{ required: true }]
                    })(<Input placeholder={String.t('paymentModal.city')} />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('state', {
                      rules: [{ required: true }]
                    })(<Input placeholder={String.t('paymentModal.state')} />)}
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator('terms', {
                      valuePropName: 'checked',
                      initialValue: false,
                      rules: [
                        {
                          required: true,
                          transform: value => value || undefined, // Those two lines
                          type: 'boolean', // Do the magic
                          message: 'Please agree the Terms and Conditions.'
                        }
                      ]
                    })(
                      <Checkbox>
                        {String.t('paymentModal.termsStart')}{' '}
                        <Link to="https://habla.ai/privacy-policy.html">{String.t('paymentModal.privacyPolicy')}</Link>{' '}
                        {String.t('paymentModal.termsEnd')}{' '}
                        <Link to="https://habla.ai/user-terms-of-service.html">{String.t('paymentModal.terms')}</Link>
                      </Checkbox>
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Modal_footer">
                <div className="Action_buttons">
                  <Button className="Cancel_button" onClick={() => this.handleCancel()}>
                    {String.t('paymentModal.back')}
                  </Button>
                  <Button className="Confirm_button" onClick={this.handleSubmit} loading={this.state.loading}>
                    {String.t('paymentModal.payButton', { amount: paymentData.payAmount })}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

StripeForm.propTypes = propTypes;
StripeForm.defaultProps = defaultProps;

export default injectStripe(StripeForm);
