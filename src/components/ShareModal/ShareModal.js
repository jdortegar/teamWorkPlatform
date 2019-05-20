import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Form, Modal, Button, Menu, Input, Icon, Checkbox, message as msg } from 'antd';
import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { AvatarWithLabel } from 'src/components';
import { AvatarWrapper, ChatMessage } from 'src/containers';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  visible: PropTypes.bool.isRequired,
  showShareModal: PropTypes.func.isRequired,
  cancelButton: PropTypes.bool,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  user: PropTypes.object,
  dataforShare: PropTypes.object,
  createConversation: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  teams: PropTypes.array,
  sharePT: PropTypes.bool,
  conversationIdsByMember: PropTypes.object
};

const defaultProps = {
  cancelButton: true,
  dataforShare: {},
  teams: [],
  sharePT: false,
  user: false,
  conversationIdsByMember: {}
};

class ShareModal extends React.Component {
  constructor(props) {
    super(props);

    const { user, subscribers, subscribersPresences, dataforShare, teams } = this.props;
    const orgUsers = [];

    Object.values(subscribers).forEach(userEl => {
      if (
        userEl.userId === user.userId ||
        (dataforShare.content[0].type === 'userId' && userEl.userId === dataforShare.content[0].text)
      )
        return;
      orgUsers.push({
        ...userEl,
        online: _.some(_.values(subscribersPresences[userEl.userId]), { presenceStatus: 'online' })
      });
    });

    this.state = {
      orgUsers,
      orgUsersFiltered: orgUsers,
      orgTeamsFiltered: teams,
      shareTeams: [],
      shareUsers: [],
      loading: false
    };
  }

  getConversationId = async userId => {
    const { user, subscribers, conversationIdsByMember } = this.props;

    if (conversationIdsByMember[userId]) return conversationIdsByMember[userId];

    const member = subscribers.find(userEl => userEl.userId === userId);
    const data = await this.props.createConversation({
      members: [user.userId, member.userId],
      title: `${user.firstName}, ${member.firstName}`,
      description: `Conversation between ${user.firstName} and ${member.firstName}`
    });

    return data.id;
  };

  getTeamConversationId = async teamId => {
    const { teams } = this.props;
    const team = teams.find(teamEl => teamEl.teamId === teamId);
    return team.conversationId;
  };

  createMessage = async conversationId => {
    const { dataforShare } = this.props;
    try {
      await this.props.createMessage({
        conversationId,
        dataforShare
      });
    } catch (error) {
      msg.error(error.message);
    }
  };

  handleSubmit = () => {
    const { shareUsers, shareTeams } = this.state;
    const { sharePT } = this.props;
    this.setState({ loading: true });

    this.props.form.validateFields(async err => {
      if (err) return;
      try {
        let conversationIds;
        if (sharePT) {
          const teamsIds = Object.keys(shareTeams);
          conversationIds = await Promise.all(teamsIds.map(this.getTeamConversationId));
        } else {
          const userIds = Object.keys(shareUsers);
          conversationIds = await Promise.all(userIds.map(this.getConversationId));
        }

        await Promise.all(conversationIds.map(this.createMessage));
        this.setState({ loading: false });
        msg.success(String.t('shareModal.dataSharedSuccefully'));
        this.props.form.resetFields();
        this.props.showShareModal();
      } catch (error) {
        this.setState({ loading: false });
        msg.error(error.message);
      }
    });
  };

  onChangeUser = user => {
    const shareUsers = { ...this.state.shareUsers };
    if (this.state.shareUsers[user.userId]) {
      // found, so remove member
      delete shareUsers[user.userId];
    } else {
      // not found, so add member
      shareUsers[user.userId] = true;
    }
    this.setState({
      shareUsers
    });
  };

  onChangeTeam = team => {
    const shareTeams = { ...this.state.shareTeams };
    if (this.state.shareTeams[team.teamId]) {
      // found, so remove member
      delete shareTeams[team.teamId];
    } else {
      // not found, so add member
      shareTeams[team.teamId] = true;
    }
    this.setState({
      shareTeams
    });
  };

  handleSearch = e => {
    const { value } = e.target;
    const { sharePT } = this.props;
    if (sharePT) {
      if (value === '') {
        this.setState({ orgTeamsFiltered: this.props.teams });
      } else {
        const orgTeamsFiltered = this.props.teams.filter(el =>
          el.name.toLowerCase().includes(value.toLowerCase().trim())
        );
        this.setState({ orgTeamsFiltered });
      }
    } else if (value === '') {
      this.setState({ orgUsersFiltered: this.state.orgUsers });
    } else {
      const orgUsersFiltered = this.state.orgUsers.filter(el =>
        el.fullName.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ orgUsersFiltered });
    }
  };

  renderOrgMembers = () => {
    const { orgUsersFiltered } = this.state;

    let orgUserOrdered = orgUsersFiltered.sort(sortByName);

    orgUserOrdered = orgUserOrdered.length === 0 && orgUserOrdered[0] === undefined ? [] : primaryAtTop(orgUserOrdered);

    return orgUserOrdered.map(userEl => (
      <Menu.Item key={userEl.userId}>
        <Checkbox onChange={() => this.onChangeUser(userEl)} checked={this.state.shareUsers[userEl.userId]}>
          <div className="habla-left-navigation-team-list">
            <div className="habla-left-navigation-team-list-item">
              <div className="habla-left-navigation-team-list-subitem">
                <AvatarWrapper size="default" user={userEl} hideStatusTooltip showDetails={false} />
                <span className="habla-left-navigation-item-label">{userEl.fullName}</span>
              </div>
            </div>
          </div>
        </Checkbox>
      </Menu.Item>
    ));
  };

  renderOrgTeams = () => {
    const { orgTeamsFiltered } = this.state;

    let orgTeamsOrdered = orgTeamsFiltered.sort(sortByName);

    orgTeamsOrdered =
      orgTeamsOrdered.length === 0 && orgTeamsOrdered[0] === undefined ? [] : primaryAtTop(orgTeamsOrdered);

    return orgTeamsOrdered.map(teamEl => (
      <Menu.Item key={teamEl.teamId}>
        <Checkbox onChange={() => this.onChangeTeam(teamEl)} checked={this.state.shareTeams[teamEl.teamId]}>
          <div className="habla-left-navigation-team-list">
            <div className="habla-left-navigation-team-list-item">
              <div className="habla-left-navigation-team-list-subitem">
                <AvatarWithLabel item={teamEl} enabled={teamEl.active} />
              </div>
            </div>
          </div>
        </Checkbox>
      </Menu.Item>
    ));
  };

  render() {
    const { visible, cancelButton, sharePT, dataforShare } = this.props;
    return (
      <div>
        <Modal visible={visible} footer={null} width="400px" closable={false} maskClosable destroyOnClose>
          <div className="Share_Modal">
            <div className="Modal_body">
              <div className="Forwarded_Message_Container">
                <ChatMessage
                  message={dataforShare}
                  key={dataforShare.id}
                  conversationId={dataforShare.conversationId}
                  conversationDisabled
                  showDetailsOnAvatar={false}
                />
              </div>
              <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
                <div className="Modal_subtitle">
                  <div>{String.t('shareModal.title')}</div>
                </div>
                <div className="Share_Modal_list">
                  <div className="Habla_Input">
                    <Input
                      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      onChange={this.handleSearch}
                    />
                  </div>
                  <Menu mode="inline" className="habla-left-navigation-list habla-left-navigation-organization-list">
                    {sharePT ? this.renderOrgTeams() : this.renderOrgMembers()}
                  </Menu>
                </div>
              </Form>
            </div>
            <div className="Modal_footer">
              <div className="Action_buttons">
                {cancelButton && (
                  <Button className="Cancel_button" onClick={this.props.showShareModal}>
                    {String.t('subscriptionModal.close')}
                  </Button>
                )}
                <Button className="Confirm_button" loading={this.state.loading} onClick={this.handleSubmit}>
                  {String.t('shareModal.share')}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ShareModal.propTypes = propTypes;
ShareModal.defaultProps = defaultProps;

export default Form.create()(ShareModal);
