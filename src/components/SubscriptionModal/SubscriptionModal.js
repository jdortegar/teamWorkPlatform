import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import config from 'src/config/env';

import { Modal, Form, Input, InputNumber, Select, Tag, Row, Col, Button, message } from 'antd';

import String from 'src/translations';
import { PaymentModal } from 'src/components';
import { formShape } from 'src/propTypes';
import { hablaGrayLogo } from 'src/img';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  form: formShape.isRequired,
  subscriberOrg: PropTypes.object.isRequired,
  subscription: PropTypes.object,
  fetchSubscription: PropTypes.func.isRequired,
  fetchSubscriptionCoupons: PropTypes.func.isRequired,
  subscriptionCoupons: PropTypes.object,
  updateSubscription: PropTypes.func.isRequired,
  cancelButton: PropTypes.bool,
  doPaypalSubscription: PropTypes.func.isRequired,
  paypalSubscription: PropTypes.object,
  cancelPaypalSubscription: PropTypes.func.isRequired,
  fetchPaypalSubscription: PropTypes.func.isRequired
};

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

const defaultProps = {
  subscription: {},
  paypalSubscription: {},
  subscriptionCoupons: {},
  cancelButton: true
};

const PRICES = {
  ANNUALLY: 1200,
  MONTHLY: 1500
};

class SubscriptionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      subscriptionLoaded: false,
      subscriptionCouponsLoaded: false,
      subscriptionUsers: 0,
      subscriptionBilling: 'monthly',
      discountApplied: 1,
      subscriptionPlanAmount: 0,
      discountCode: '',
      paymentModalVisible: false
    };
  }

  componentDidMount() {
    const { stripeSubscriptionId, paypalSubscriptionId } = this.props.subscriberOrg || {};
    if (stripeSubscriptionId) {
      this.props.fetchSubscription(stripeSubscriptionId).then(() => {
        const { subscription } = this.props;
        const subscriptionBilling = subscription.plan.interval === 'year' ? 'annually' : 'monthly';
        const subscriptionPlanAmount = subscription.plan.amount / (subscriptionBilling === 'annually' ? 12 : 1);
        this.setState({
          subscriptionLoaded: true,
          subscriptionUsers: subscription.quantity,
          subscriptionBilling,
          subscriptionPlanAmount
        });
      });
    }

    if (paypalSubscriptionId) {
      this.props
        .fetchPaypalSubscription(paypalSubscriptionId)
        .then(() => {
          const { paypalSubscription } = this.props;
          const subscriptionBilling =
            paypalSubscription.plan.payment_definitions[0].frequency === 'Year' ? 'annually' : 'monthly';
          const paypalSubscriptionPlanAmount =
            (paypalSubscription.plan.payment_definitions[0].amount.value * 100) /
            (subscriptionBilling === 'annually' ? 12 : 1);
          const paypalUsers =
            paypalSubscriptionPlanAmount / (subscriptionBilling === 'annually' ? PRICES.ANNUALLY : PRICES.MONTHLY);
          this.setState({
            subscriptionLoaded: true,
            subscriptionUsers: paypalUsers,
            subscriptionBilling,
            subscriptionPlanAmount: paypalSubscriptionPlanAmount / paypalUsers
          });
        })
        .catch(error => {
          this.setState({ subscriptionLoaded: true });
          if (error.response && error.response.status === 500) {
            message.error(String.t('editTeamPage.subscriptionError'));
          } else {
            message.error(error.message);
          }
        });
    }

    this.props.fetchSubscriptionCoupons().then(() => this.setState({ subscriptionCouponsLoaded: true }));
  }

  handleNumberChange = users => {
    this.setState({
      subscriptionUsers: users
    });
  };

  handleBilling = billing => {
    let planAmount;
    if (billing === 'annually') {
      planAmount = PRICES.ANNUALLY;
    } else {
      planAmount = PRICES.MONTHLY;
    }

    this.setState({
      subscriptionPlanAmount: planAmount
    });
  };

  handlePromoCode = e => {
    if (this.state.subscriptionCouponsLoaded) {
      const { subscriptionCoupons } = this.props;
      let discountApplied = 1;
      let discountCode = '';
      subscriptionCoupons.data.find(coupon => {
        if (coupon.metadata.keyword === e.target.value) {
          discountApplied = (100 - coupon.percent_off) / 100;
          discountCode = coupon.id;
        }
        return false;
      });
      this.setState({
        discountApplied,
        discountCode
      });
    }
  };

  showModal = () => {
    if (!this.state.loading) {
      this.props.showModal();
    }
  };

  showPaymentModal = () => {
    this.props.showModal();
    this.setState({
      paymentModalVisible: !this.state.paymentModalVisible
    });
  };

  cancelSubscription = () => {
    const { subscriberOrg, subscription, paypalSubscription } = this.props;
    this.setState({ loading: true });
    confirm({
      title: (
        <span>
          {String.t('subscriptionModal.cancelSubscriptionStart')}
          <span className="habla-bold-text">{String.t('subscriptionModal.cancelSubscriptionMiddle')}</span>
          {String.t('subscriptionModal.cancelSubscriptionEnd', {
            endDate: moment(subscription.current_period_end * 1000).format('LL')
          })}
        </span>
      ),
      content: String.t('subscriptionModal.cancelMessage'),
      okText: String.t('yes'),
      cancelText: String.t('no'),
      className: 'Confirm_Modal',
      iconType: '',
      onOk: () => {
        if (paypalSubscription) {
          return this.props
            .cancelPaypalSubscription(paypalSubscription.id)
            .then(() => {
              let paypalPeriodEnd;
              if (paypalSubscription.plan.payment_definitions[0].frequency === 'Month') {
                paypalPeriodEnd = moment(paypalSubscription.start_date).add(1, 'M');
              } else {
                paypalPeriodEnd = moment(paypalSubscription.start_date).add(1, 'Y');
              }
              message.success(
                String.t('subscriptionModal.confirmCancel', {
                  daysLeft: moment(paypalPeriodEnd).diff(moment(), 'days')
                })
              );
              this.setState({ loading: false });
            })
            .catch(error => {
              this.setState({ loading: false });
              if (error.response && error.response.status === 400) {
                message.error(String.t('subscriptionModal.subscriptionAlreadyCancelled'));
              } else {
                message.error(error.message);
              }
            });
        }

        return this.props
          .updateSubscription({
            subscriptionId: subscriberOrg.stripeSubscriptionId,
            subscriberOrgId: subscriberOrg.subscriberOrgId,
            cancel_at_period_end: true
          })
          .then(() => {
            message.success(
              String.t('subscriptionModal.confirmCancel', {
                daysLeft: moment(subscription.current_period_end * 1000).diff(moment(), 'days')
              }),
              6
            );
            this.setState({ loading: false });
          })
          .catch(error => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  };

  reactivateSubscription = () => {
    const { subscriberOrg, subscription } = this.props;
    this.setState({ loading: true });
    confirm({
      content: String.t('subscriptionModal.reactivateMessage'),
      okText: String.t('yes'),
      cancelText: String.t('no'),
      className: 'Confirm_Modal',
      iconType: '',
      onOk: () => {
        this.props
          .updateSubscription({
            subscriptionId: subscriberOrg.stripeSubscriptionId,
            subscriberOrgId: subscriberOrg.subscriberOrgId,
            cancel_at_period_end: false
          })
          .then(() => {
            message.success(
              String.t('subscriptionModal.confirmReactivate', {
                daysLeft: moment(subscription.current_period_end * 1000).diff(moment(), 'days')
              })
            );
            this.setState({ loading: false });
          })
          .catch(error => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  };

  handlePaypalSubscription = () => {
    const { subscriptionPlanAmount, subscriptionUsers, discountApplied } = this.state;
    const { subscriberOrg, paypalSubscription } = this.props;
    const amount = ((subscriptionPlanAmount * subscriptionUsers * discountApplied) / 100).toFixed(2);
    const payAmount = subscriptionPlanAmount === PRICES.ANNUALLY ? amount * 12 : amount;
    const frequency = subscriptionPlanAmount === PRICES.ANNUALLY ? 'year' : 'month';

    this.setState({ loading: true });

    if (paypalSubscription) {
      this.props.cancelPaypalSubscription(paypalSubscription.id);
    }

    const paypalPaymentObject = {
      userLimit: subscriptionUsers,
      billingPlanAttributes: {
        name: 'Habla AI Bronze Subscription',
        description: `$${payAmount} USD ${frequency}ly subscription`,
        merchant_preferences: {
          auto_bill_amount: 'yes',
          cancel_url: `${config.apiRoot}/v2/subscriptions/paypal/cancel`,
          initial_fail_amount_action: 'continue',
          max_fail_attempts: '1',
          return_url: `${config.apiRoot}/v2/subscriptions/paypal/processagreement?orgId=${
            subscriberOrg.subscriberOrgId
          }`
        },
        payment_definitions: [
          {
            amount: {
              currency: 'USD',
              value: payAmount
            },
            cycles: '0',
            frequency,
            frequency_interval: '1',
            name: `${frequency}ly`,
            type: 'REGULAR'
          }
        ],
        type: 'INFINITE'
      }
    };

    this.props.doPaypalSubscription(paypalPaymentObject);
  };

  handleSubmit = () => {
    const { stripeSubscriptionId, subscriberOrgId } = this.props.subscriberOrg;
    const { subscription } = this.props;
    const { subscriptionUsers, subscriptionPlanAmount, discountCode } = this.state;
    this.setState({ loading: true });
    const valuesToSend = {
      subscriptionId: stripeSubscriptionId,
      subscriberOrgId,
      users: subscriptionUsers,
      subscriptionType: subscriptionPlanAmount === PRICES.MONTHLY ? 'monthly' : 'annually',
      promocode: discountCode
    };

    const interval = subscription.plan && subscription.plan.interval === 'year' ? 'annually' : 'monthly';

    if (valuesToSend.users === subscription.quantity && valuesToSend.subscriptionType === interval) {
      this.setState({ loading: false });
      message.success(String.t('subscriptionModal.planChanges'));
      return;
    }

    this.props
      .updateSubscription(valuesToSend)
      .then(() => {
        this.setState({ loading: false });
        this.props.showModal();
        message.success(String.t('subscriptionModal.planUpdated'));
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  };

  handleSubscriptionPeriod = () => {
    const { subscription, paypalSubscription } = this.props;
    if (paypalSubscription) {
      let paypalPeriodEnd;
      if (paypalSubscription.plan.payment_definitions[0].frequency === 'Month') {
        paypalPeriodEnd = moment(paypalSubscription.start_date).add(1, 'M');
      } else {
        paypalPeriodEnd = moment(paypalSubscription.start_date).add(1, 'Y');
      }

      return String.t('subscriptionModal.SubscriptionDate', {
        startDate: moment(paypalSubscription.start_date).format('LL'),
        renewalDate: moment(paypalPeriodEnd).format('LL')
      });
    }

    return String.t('subscriptionModal.SubscriptionDate', {
      startDate: moment(subscription.current_period_start * 1000).format('LL'),
      renewalDate: moment(subscription.current_period_end * 1000).format('LL')
    });
  };

  render() {
    const { visible, subscription, cancelButton, paypalSubscription } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      subscriptionPlanAmount,
      subscriptionLoaded,
      subscriptionUsers,
      subscriptionBilling,
      discountApplied,
      discountCode
    } = this.state;

    const amount = ((subscriptionPlanAmount * subscriptionUsers * discountApplied) / 100).toFixed(2);

    const payAmount = subscriptionPlanAmount === PRICES.ANNUALLY ? amount * 12 : amount;

    const { stripeSubscriptionId, subscriberOrgId } = this.props.subscriberOrg;

    const paymentData = {
      subscriptionId: stripeSubscriptionId,
      subscriberOrgId,
      customerId: subscription.customer,
      users: subscriptionUsers,
      subscriptionType: subscriptionPlanAmount === PRICES.MONTHLY ? 'monthly' : 'annually',
      promocode: discountCode,
      payAmount
    };

    return (
      <div>
        <Modal visible={visible && subscriptionLoaded} footer={null} closable={false} width={620}>
          <div className="Subscription_Modal_container">
            <div className="Modal_header">
              <img src={hablaGrayLogo} alt={String.t('Header.logoAlt')} className="img HablaGrayLogo" />
              <h5 className="Modal_title">
                <span className="habla-bold-text">
                  {subscription.cancel_at_period_end
                    ? String.t('subscriptionModal.canceledPlanTitle')
                    : String.t('subscriptionModal.changePlanTitle')}
                </span>
              </h5>
            </div>
            <Form onSubmit={this.handleSubmit} layout="vertical">
              <div className="Modal_body">
                <div className="Modal_subtitle">
                  <Tag className="habla_subscription_tag habla_subscription_tag_bronze">
                    {String.t('subscriptionPlans.bronze')}
                  </Tag>
                  <div className="suscriptionDate">{this.handleSubscriptionPeriod()}</div>
                </div>
                {!subscription.cancel_at_period_end && (
                  <div className="subscription_Options">
                    <div className="label">{String.t('subscriptionModal.formTitle')}</div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <h1 className="Form_input_label habla-bold-text">{String.t('subscriptionModal.users')}</h1>
                        <FormItem>
                          {getFieldDecorator('users', { initialValue: subscriptionUsers })(
                            <InputNumber
                              size="large"
                              min={1}
                              style={{ width: '100%' }}
                              onChange={this.handleNumberChange}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <h1 className="Form_input_label habla-bold-text">{String.t('subscriptionModal.billing')}</h1>
                        <FormItem>
                          {getFieldDecorator('billing', {
                            initialValue: subscriptionBilling
                          })(
                            <Select size="large" onChange={this.handleBilling}>
                              <Option value="monthly">{String.t('subscriptionModal.monthly')}</Option>
                              <Option value="annually">{String.t('subscriptionModal.annually')}</Option>
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <h1 className="Form_input_label habla-bold-text">{String.t('subscriptionModal.promoCode')}</h1>
                        <FormItem>{getFieldDecorator('promoCode')(<Input onChange={this.handlePromoCode} />)}</FormItem>
                      </Col>
                    </Row>

                    <div className="bottom-block">
                      <div className="label">{String.t('subscriptionModal.pricePerMonth')}</div>
                      <div className="Modal_Plan_Price">
                        {String.t('subscriptionModal.amount', { amount })}{' '}
                        <span className="habla-lighter-text">
                          {' '}
                          {String.t('subscriptionModal.billingType', {
                            type: subscriptionPlanAmount === PRICES.MONTHLY ? 'Monthly' : 'Annually'
                          })}{' '}
                          {discountApplied < 1 && String.t('subscriptionModal.discountApplied')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="Modal_footer">
                {!subscription.cancel_at_period_end && (
                  <div className="Cancel_subscription_button" onClick={this.cancelSubscription}>
                    {String.t('subscriptionModal.cancelSubscription')}
                  </div>
                )}
                <div className="Action_buttons">
                  {cancelButton ? (
                    <Button className="Cancel_button" onClick={this.showModal}>
                      {String.t('subscriptionModal.close')}
                    </Button>
                  ) : (
                    <Button className="Cancel_button" onClick={this.showModal}>
                      {String.t('subscriptionModal.back')}
                    </Button>
                  )}
                  {subscription.cancel_at_period_end && (
                    <Button
                      className="Confirm_button"
                      onClick={this.reactivateSubscription}
                      loading={this.state.loading}
                    >
                      {String.t('subscriptionModal.reactivateSubscription')}
                    </Button>
                  )}
                  {subscription.status === 'trialing' && !paypalSubscription ? (
                    <Button className="Confirm_button" onClick={this.showPaymentModal}>
                      {String.t('subscriptionModal.paySubscription', {
                        amount: parseFloat(payAmount).toFixed(2)
                      })}
                    </Button>
                  ) : (
                    !subscription.cancel_at_period_end &&
                    !paypalSubscription && (
                      <Button className="Confirm_button" onClick={this.handleSubmit} loading={this.state.loading}>
                        {String.t('subscriptionModal.changePlan')}
                      </Button>
                    )
                  )}
                  {subscription.status !== 'active' && (
                    <Button
                      className="paypalbutton"
                      onClick={this.handlePaypalSubscription}
                      loading={this.state.loading}
                    >
                      Pay with{' '}
                      <img
                        className="paypal-button-logo"
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTAwIDMyIiB4bWxucz0iaHR0cDomI3gyRjsmI3gyRjt3d3cudzMub3JnJiN4MkY7MjAwMCYjeDJGO3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pbllNaW4gbWVldCI+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSAxMiA0LjkxNyBMIDQuMiA0LjkxNyBDIDMuNyA0LjkxNyAzLjIgNS4zMTcgMy4xIDUuODE3IEwgMCAyNS44MTcgQyAtMC4xIDI2LjIxNyAwLjIgMjYuNTE3IDAuNiAyNi41MTcgTCA0LjMgMjYuNTE3IEMgNC44IDI2LjUxNyA1LjMgMjYuMTE3IDUuNCAyNS42MTcgTCA2LjIgMjAuMjE3IEMgNi4zIDE5LjcxNyA2LjcgMTkuMzE3IDcuMyAxOS4zMTcgTCA5LjggMTkuMzE3IEMgMTQuOSAxOS4zMTcgMTcuOSAxNi44MTcgMTguNyAxMS45MTcgQyAxOSA5LjgxNyAxOC43IDguMTE3IDE3LjcgNi45MTcgQyAxNi42IDUuNjE3IDE0LjYgNC45MTcgMTIgNC45MTcgWiBNIDEyLjkgMTIuMjE3IEMgMTIuNSAxNS4wMTcgMTAuMyAxNS4wMTcgOC4zIDE1LjAxNyBMIDcuMSAxNS4wMTcgTCA3LjkgOS44MTcgQyA3LjkgOS41MTcgOC4yIDkuMzE3IDguNSA5LjMxNyBMIDkgOS4zMTcgQyAxMC40IDkuMzE3IDExLjcgOS4zMTcgMTIuNCAxMC4xMTcgQyAxMi45IDEwLjUxNyAxMy4xIDExLjIxNyAxMi45IDEyLjIxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSAzNS4yIDEyLjExNyBMIDMxLjUgMTIuMTE3IEMgMzEuMiAxMi4xMTcgMzAuOSAxMi4zMTcgMzAuOSAxMi42MTcgTCAzMC43IDEzLjYxNyBMIDMwLjQgMTMuMjE3IEMgMjkuNiAxMi4wMTcgMjcuOCAxMS42MTcgMjYgMTEuNjE3IEMgMjEuOSAxMS42MTcgMTguNCAxNC43MTcgMTcuNyAxOS4xMTcgQyAxNy4zIDIxLjMxNyAxNy44IDIzLjQxNyAxOS4xIDI0LjgxNyBDIDIwLjIgMjYuMTE3IDIxLjkgMjYuNzE3IDIzLjggMjYuNzE3IEMgMjcuMSAyNi43MTcgMjkgMjQuNjE3IDI5IDI0LjYxNyBMIDI4LjggMjUuNjE3IEMgMjguNyAyNi4wMTcgMjkgMjYuNDE3IDI5LjQgMjYuNDE3IEwgMzIuOCAyNi40MTcgQyAzMy4zIDI2LjQxNyAzMy44IDI2LjAxNyAzMy45IDI1LjUxNyBMIDM1LjkgMTIuNzE3IEMgMzYgMTIuNTE3IDM1LjYgMTIuMTE3IDM1LjIgMTIuMTE3IFogTSAzMC4xIDE5LjMxNyBDIDI5LjcgMjEuNDE3IDI4LjEgMjIuOTE3IDI1LjkgMjIuOTE3IEMgMjQuOCAyMi45MTcgMjQgMjIuNjE3IDIzLjQgMjEuOTE3IEMgMjIuOCAyMS4yMTcgMjIuNiAyMC4zMTcgMjIuOCAxOS4zMTcgQyAyMy4xIDE3LjIxNyAyNC45IDE1LjcxNyAyNyAxNS43MTcgQyAyOC4xIDE1LjcxNyAyOC45IDE2LjExNyAyOS41IDE2LjcxNyBDIDMwIDE3LjQxNyAzMC4yIDE4LjMxNyAzMC4xIDE5LjMxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwMzA4NyIgZD0iTSA1NS4xIDEyLjExNyBMIDUxLjQgMTIuMTE3IEMgNTEgMTIuMTE3IDUwLjcgMTIuMzE3IDUwLjUgMTIuNjE3IEwgNDUuMyAyMC4yMTcgTCA0My4xIDEyLjkxNyBDIDQzIDEyLjQxNyA0Mi41IDEyLjExNyA0Mi4xIDEyLjExNyBMIDM4LjQgMTIuMTE3IEMgMzggMTIuMTE3IDM3LjYgMTIuNTE3IDM3LjggMTMuMDE3IEwgNDEuOSAyNS4xMTcgTCAzOCAzMC41MTcgQyAzNy43IDMwLjkxNyAzOCAzMS41MTcgMzguNSAzMS41MTcgTCA0Mi4yIDMxLjUxNyBDIDQyLjYgMzEuNTE3IDQyLjkgMzEuMzE3IDQzLjEgMzEuMDE3IEwgNTUuNiAxMy4wMTcgQyA1NS45IDEyLjcxNyA1NS42IDEyLjExNyA1NS4xIDEyLjExNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA2Ny41IDQuOTE3IEwgNTkuNyA0LjkxNyBDIDU5LjIgNC45MTcgNTguNyA1LjMxNyA1OC42IDUuODE3IEwgNTUuNSAyNS43MTcgQyA1NS40IDI2LjExNyA1NS43IDI2LjQxNyA1Ni4xIDI2LjQxNyBMIDYwLjEgMjYuNDE3IEMgNjAuNSAyNi40MTcgNjAuOCAyNi4xMTcgNjAuOCAyNS44MTcgTCA2MS43IDIwLjExNyBDIDYxLjggMTkuNjE3IDYyLjIgMTkuMjE3IDYyLjggMTkuMjE3IEwgNjUuMyAxOS4yMTcgQyA3MC40IDE5LjIxNyA3My40IDE2LjcxNyA3NC4yIDExLjgxNyBDIDc0LjUgOS43MTcgNzQuMiA4LjAxNyA3My4yIDYuODE3IEMgNzIgNS42MTcgNzAuMSA0LjkxNyA2Ny41IDQuOTE3IFogTSA2OC40IDEyLjIxNyBDIDY4IDE1LjAxNyA2NS44IDE1LjAxNyA2My44IDE1LjAxNyBMIDYyLjYgMTUuMDE3IEwgNjMuNCA5LjgxNyBDIDYzLjQgOS41MTcgNjMuNyA5LjMxNyA2NCA5LjMxNyBMIDY0LjUgOS4zMTcgQyA2NS45IDkuMzE3IDY3LjIgOS4zMTcgNjcuOSAxMC4xMTcgQyA2OC40IDEwLjUxNyA2OC41IDExLjIxNyA2OC40IDEyLjIxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5MC43IDEyLjExNyBMIDg3IDEyLjExNyBDIDg2LjcgMTIuMTE3IDg2LjQgMTIuMzE3IDg2LjQgMTIuNjE3IEwgODYuMiAxMy42MTcgTCA4NS45IDEzLjIxNyBDIDg1LjEgMTIuMDE3IDgzLjMgMTEuNjE3IDgxLjUgMTEuNjE3IEMgNzcuNCAxMS42MTcgNzMuOSAxNC43MTcgNzMuMiAxOS4xMTcgQyA3Mi44IDIxLjMxNyA3My4zIDIzLjQxNyA3NC42IDI0LjgxNyBDIDc1LjcgMjYuMTE3IDc3LjQgMjYuNzE3IDc5LjMgMjYuNzE3IEMgODIuNiAyNi43MTcgODQuNSAyNC42MTcgODQuNSAyNC42MTcgTCA4NC4zIDI1LjYxNyBDIDg0LjIgMjYuMDE3IDg0LjUgMjYuNDE3IDg0LjkgMjYuNDE3IEwgODguMyAyNi40MTcgQyA4OC44IDI2LjQxNyA4OS4zIDI2LjAxNyA4OS40IDI1LjUxNyBMIDkxLjQgMTIuNzE3IEMgOTEuNCAxMi41MTcgOTEuMSAxMi4xMTcgOTAuNyAxMi4xMTcgWiBNIDg1LjUgMTkuMzE3IEMgODUuMSAyMS40MTcgODMuNSAyMi45MTcgODEuMyAyMi45MTcgQyA4MC4yIDIyLjkxNyA3OS40IDIyLjYxNyA3OC44IDIxLjkxNyBDIDc4LjIgMjEuMjE3IDc4IDIwLjMxNyA3OC4yIDE5LjMxNyBDIDc4LjUgMTcuMjE3IDgwLjMgMTUuNzE3IDgyLjQgMTUuNzE3IEMgODMuNSAxNS43MTcgODQuMyAxNi4xMTcgODQuOSAxNi43MTcgQyA4NS41IDE3LjQxNyA4NS43IDE4LjMxNyA4NS41IDE5LjMxNyBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5NS4xIDUuNDE3IEwgOTEuOSAyNS43MTcgQyA5MS44IDI2LjExNyA5Mi4xIDI2LjQxNyA5Mi41IDI2LjQxNyBMIDk1LjcgMjYuNDE3IEMgOTYuMiAyNi40MTcgOTYuNyAyNi4wMTcgOTYuOCAyNS41MTcgTCAxMDAgNS42MTcgQyAxMDAuMSA1LjIxNyA5OS44IDQuOTE3IDk5LjQgNC45MTcgTCA5NS44IDQuOTE3IEMgOTUuNCA0LjkxNyA5NS4yIDUuMTE3IDk1LjEgNS40MTcgWiI+PC9wYXRoPjwvc3ZnPg=="
                        alt="paypal"
                      />
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </Modal>
        <PaymentModal
          visible={this.state.paymentModalVisible}
          showModal={this.showModal}
          showPaymentModal={this.showPaymentModal}
          paymentData={paymentData}
          form={this.props.form}
          updateSubscription={this.props.updateSubscription}
          amount={amount}
        />
      </div>
    );
  }
}

SubscriptionModal.propTypes = propTypes;
SubscriptionModal.defaultProps = defaultProps;

export default Form.create()(SubscriptionModal);
