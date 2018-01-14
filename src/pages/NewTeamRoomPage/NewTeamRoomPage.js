import React, { Component } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import String from '../../translations';
import Button from '../../components/common/Button';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
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
        this.props.createTeamRoom({ name: values.name, publish: true, active: true }, teamId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}`);
          });
      }
    });
  }

  render() {
    const { teamId } = this.props.match.params;
    const team = this.props.teams.teamById[teamId];
    const subscriberOrg = this.props.subscriberOrgById[team.subscriberOrgId];

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
