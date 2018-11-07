import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Modal, Form, Input, InputNumber, Select, Tag, Row, Col, Button, message } from 'antd';

import String from 'src/translations';
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
  updateSubscription: PropTypes.func.isRequired
};

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

const defaultProps = {
  subscription: {},
  subscriptionCoupons: {}
};

const PRICES = {
  ANNUALLY: 2990,
  MONTHLY: 3990
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
      discountCode: ''
    };
  }

  componentDidMount() {
    const { stripeSubscriptionId } = this.props.subscriberOrg || {};
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

  cancelSubscription = () => {
    const { subscriberOrg, subscription } = this.props;
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
        this.props
          .updateSubscription({ subscriptionId: subscriberOrg.stripeSubscriptionId, cancel_at_period_end: true })
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
          .updateSubscription({ subscriptionId: subscriberOrg.stripeSubscriptionId, cancel_at_period_end: false })
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

  handleCancel = () => {
    this.props.showModal();
  };

  handleSubmit() {
    const { stripeSubscriptionId } = this.props.subscriberOrg;
    const { subscriptionUsers, subscriptionPlanAmount, discountCode } = this.state;
    this.setState({ loading: true });
    const valuesToSend = {
      subscriptionId: stripeSubscriptionId,
      users: subscriptionUsers,
      subscriptionType: subscriptionPlanAmount === 3990 ? 'monthly' : 'annually',
      promocode: discountCode
    };
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
  }

  render() {
    const { visible, subscription } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      subscriptionPlanAmount,
      subscriptionLoaded,
      subscriptionUsers,
      subscriptionBilling,
      discountApplied
    } = this.state;

    const amount = ((subscriptionPlanAmount * subscriptionUsers * discountApplied) / 100).toFixed(2);

    return (
      <div>
        <Modal visible={visible && subscriptionLoaded} footer={null} closable={false}>
          <div className="Subscription_Modal_container">
            <div className="Modal_header">
              <img src={hablaGrayLogo} alt={String.t('Header.logoAlt')} className="img HablaGayLogo" />
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

                  <div className="suscriptionDate">
                    {String.t('subscriptionModal.SubscriptionDate', {
                      startDate: moment(subscription.current_period_start * 1000).format('LL'),
                      renewalDate: moment(subscription.current_period_end * 1000).format('LL')
                    })}
                  </div>
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
                            type: subscriptionPlanAmount === 3990 ? 'Monthly' : 'Annually'
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
                  <div className="Cancel_subscription_button" onClick={() => this.cancelSubscription()}>
                    {String.t('subscriptionModal.cancelSubscription')}
                  </div>
                )}
                <div className="Action_buttons">
                  <Button className="Cancel_button" onClick={() => this.handleCancel()}>
                    {String.t('subscriptionModal.close')}
                  </Button>
                  {!subscription.cancel_at_period_end && (
                    <Button className="Confirm_button" onClick={() => this.handleSubmit()} loading={this.state.loading}>
                      {String.t('subscriptionModal.changePlan')}
                    </Button>
                  )}
                  {subscription.cancel_at_period_end && (
                    <Button
                      className="Confirm_button"
                      onClick={() => this.reactivateSubscription()}
                      loading={this.state.loading}
                    >
                      {String.t('subscriptionModal.reactivateSubscription')}
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

SubscriptionModal.propTypes = propTypes;
SubscriptionModal.defaultProps = defaultProps;

export default Form.create()(SubscriptionModal);
