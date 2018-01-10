import React, { Component } from 'react';
import { Form, notification, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import SwitchField from '../../components/formFields/SwitchField';
import UserIcon from '../../components/UserIcon';
import { formShape } from '../../propTypes';
import Button from '../../components/common/Button';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateTeamRoom: PropTypes.func.isRequired,
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
        this.props.updateTeamRoom(values, teamRoomId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/teamRoom/${teamRoomId}`);
            notification.open({
              message: String.t('editTeamRoomPage.successToastTitle'),
              description: String.t('editTeamRoomPage.teamUpdated'),
              duration: 4
            });
          });
      }
    });
  }

  render() {
    const { teamRoomId } = this.props.match.params;
    const { teamRooms } = this.props;
    const teamRoom = teamRooms.teamRoomById[teamRoomId];

    return (
      <div className="EditTeamRoomPage-main">
        <SubpageHeader
          icon={<UserIcon user={teamRoom} type="team" clickable={false} />}
          breadcrumb={
            <div>
              {teamRoom.name}
            </div>
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-a">
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
