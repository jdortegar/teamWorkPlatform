import React, { Component } from 'react';
import { Form, message } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import String from '../../translations';
import Button from '../../components/common/Button';
import Spinner from '../../components/Spinner';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  createTeamRoom: PropTypes.func.isRequired
};

class NewTeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.props.createTeamRoom({ name: values.name.trim(), active: true }, teamId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}`);
            message.success(String.t('newTeamRoomPage.teamRoomAddedToast'));
          })
          .catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { match, subscriberOrgById, teams } = this.props;
    if (!match || !match.params || !match.params.teamId || !teams || !subscriberOrgById) {
      return <Spinner />;
    }
    const { teamId } = match.params;
    const team = teams.teamById[teamId];
    if (!team) {
      this.props.history.replace('/app');
      return null;
    }
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    return (
      <div>
        <SubpageHeader
          subscriberOrgId={subscriberOrg.subscriberOrgId}
          history={this.props.history}
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                {
                  title: team.name,
                  link: `/app/team/${team.teamId}`
                },
                { title: String.t('newTeamRoomPage.breadcrumb') }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="New-team-room__container padding-class-a">
              <h1 className="New-team-room__title">{String.t('newTeamRoomPage.title')}</h1>
              <TextField
                componentKey="name"
                inputClassName="New-team-room__add-textfield"
                form={this.props.form}
                hasFeedback={false}
                placeholder=" "
                label=""
                required
                autoFocus
              />
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/team/${teamId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button
                type="main"
                fitText
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                {String.t('newTeamRoomPage.createNewTeamRoomButtonLabel')}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

NewTeamRoomPage.propTypes = propTypes;

export default Form.create()(NewTeamRoomPage);
