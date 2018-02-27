import React, { Component } from 'react';
import { Form, message, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Spinner from '../../components/Spinner';
import TextField from '../../components/formFields/TextField';
import SwitchField from '../../components/formFields/SwitchField';
import { formShape } from '../../propTypes';
import Button from '../../components/common/Button';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateTeamRoom: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teamRooms: PropTypes.object.isRequired
};

class EditTeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { teamRoomId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const valuesToSend = { ...values };
        valuesToSend.name = values.name.trim();
        this.props.updateTeamRoom(valuesToSend, teamRoomId).then(() => {
          this.setState({ loading: false });
          this.props.history.push(`/app/teamRoom/${teamRoomId}`);
          message.success(String.t('editTeamRoomPage.teamRoomUpdated'));
        }).catch((error) => {
          this.setState({ loading: false });
          if (error.response && error.response.status === 409) {
            message.error(String.t('editTeamRoomPage.errorNameAlreadyTaken'));
          } else {
            message.error(error.message);
          }
        });
      }
    });
  }

  render() {
    const { match, teamRooms, teams, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.teamRoomId || !teams || !teamRooms || !subscriberOrgById) {
      return <Spinner />;
    }

    const { teamRoomId } = this.props.match.params;
    const teamRoom = teamRooms.teamRoomById[teamRoomId];
    if (!teamRoom) {
      this.props.history.replace('/app');
      return null;
    }
    const team = teams.teamById[teamRoom.teamId];
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    return (
      <div className="EditTeamRoomPage-main">
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
                  link: `/app/team/${teamRoom.teamId}`
                },
                {
                  title: teamRoom.name,
                  link: `/app/teamRoom/${teamRoom.teamRoomId}`
                }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-b">
              <div className="Edit-team__container">
                <h1 className="Edit-team__title">{String.t('editTeamRoomPage.teamName')}</h1>
                <TextField
                  componentKey="name"
                  initialValue={teamRoom.name}
                  inputClassName="Edit-team__add-textfield"
                  form={this.props.form}
                  hasFeedback={false}
                  label=""
                  required
                />
              </div>
              <div className="Edit-team__icon-container">
                <div className="Edit-team__switch-container">
                  <Tooltip placement="top" title={teamRoom.active ? String.t('editTeamRoomPage.setInactive') : String.t('editTeamRoomPage.setActive')}>
                    <SwitchField
                      disabled={teamRoom.primary}
                      checkedChildren={String.t('editTeamRoomPage.activeState')}
                      unCheckedChildren={String.t('editTeamRoomPage.inactiveState')}
                      form={this.props.form}
                      componentKey="active"
                      initialValue={teamRoom.active}
                      valuePropName="checked"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/teamRoom/${teamRoomId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button
                type="main"
                fitText
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                {String.t('editTeamRoomPage.saveButtonLabel')}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

EditTeamRoomPage.propTypes = propTypes;

export default Form.create()(EditTeamRoomPage);
