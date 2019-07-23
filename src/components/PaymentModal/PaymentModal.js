import React from 'react';
import PropTypes from 'prop-types';
import { Elements, StripeProvider } from 'react-stripe-elements';
import config from 'src/config/env';

import { Form } from 'antd';
import { formShape } from 'src/propTypes';

import './styles/style.css';
import StripeForm from './StripeForm';

const propTypes = {
  form: formShape.isRequired,
  updateSubscription: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  showPaymentModal: PropTypes.func.isRequired,
  paymentData: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  paypalSubscription: PropTypes.object,
  cancelPaypalSubscription: PropTypes.func.isRequired
};

const defaultProps = {
  paypalSubscription: {}
};

const PaymentModal = props => (
  <StripeProvider apiKey={config.stripe}>
    <Elements>
      <StripeForm
        subscriptionEmail={props.currentUser.email}
        form={props.form}
        paymentData={props.paymentData}
        showModal={props.showModal}
        updateSubscription={props.updateSubscription}
        showPaymentModal={props.showPaymentModal}
        visible={props.visible}
        cancelPaypalSubscription={props.cancelPaypalSubscription}
        paypalSubscription={props.paypalSubscription}
      />
    </Elements>
  </StripeProvider>
);

PaymentModal.propTypes = propTypes;
PaymentModal.defaultProps = defaultProps;

export default Form.create()(PaymentModal);
