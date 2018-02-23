import React, { Component } from 'react';
import { Form, notification } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import Spinner from '../../components/Spinner';
import String from '../../translations';
import Button from '../../components/common/Button';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  createTeam: PropTypes.func.isRequired
};

class NewTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const valuesToSend = { ...values };
        valuesToSend.name = values.name.trim();
        this.setState({ loading: true });
        this.props.createTeam(valuesToSend, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}`);
          })
          .catch((error) => {
            this.setState({ loading: false });
            notification.open({
              message: String.t('errorToastTitle'),
              description: error.message,
              duration: 4
            });
          });
      }
    });
  }

  render() {
    const { match, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !subscriberOrgById) {
      return <Spinner />;
    }

    const { subscriberOrgId } = match.params;
    const subscriberOrg = subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    return (
      <div>
        <SubpageHeader
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                { title: String.t('newTeamPage.breadcrumb') }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="New-team__container padding-class-b">
              <div className="New-team__title habla-secon">{String.t('newTeamPage.chooseTeamName')}</div>
              <TextField
                componentKey="name"
                inputClassName="New-team__add-textfield"
                form={this.props.form}
                hasFeedback={false}
                placeholder=" "
                label=""
                required
              />
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button
                type="main"
                fitText
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                {String.t('newTeamPage.createNewTeamButtonLabel')}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

NewTeamPage.propTypes = propTypes;

export default Form.create()(NewTeamPage);
