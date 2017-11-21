import React, { Component } from 'react';
import { Row, Col, Form, Button, notification, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import SwitchField from '../../components/formFields/SwitchField';
import UserIcon from '../../components/UserIcon';
import { formShape } from '../../propTypes';
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
      <div>
        <SubpageHeader
          icon={<UserIcon user={teamRoom} type="team" clickable={false} />}
          breadcrumb={
            <div>
              {teamRoom.name}
            </div>
          }
        />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
                <div className="Edit-team__icon-container">
                  <UploadImageField text={String.t('editTeamRoomPage.changeAvatarTitle')} image={teamRoom.icon} />
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
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 16 }}>
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
                <div>
                  <Button
                    type="primary"
                    className="Edit-team__button New-team__button--margin-right"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                  >
                    {String.t('editTeamRoomPage.saveButtonLabel')}
                  </Button>
                  <Button
                    type="primary"
                    className="Edit-team__button"
                    onClick={() => this.props.history.push(`/app/teamRoom/${teamRoomId}`)}
                  >
                    {String.t('cancelButton')}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

EditTeamRoomPage.propTypes = propTypes;

export default Form.create()(EditTeamRoomPage);
