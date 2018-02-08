import React, { Component } from 'react';
import _ from 'lodash';
import { Form, Tooltip } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formShape } from '../../propTypes';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import Spinner from '../../components/Spinner';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import UserIcon from '../../components/UserIcon';
import Avatar from '../../components/common/Avatar';
import PreviewBar from '../../components/PreviewBar';
import Message from '../../components/Message';
import { getJwt, getResourcesUrl } from '../../session';
import String from '../../translations';
import getInitials from '../../utils/helpers';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  form: formShape.isRequired,
  fetchTeamRoomMembersByTeamRoomId: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  fetchTranscript: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teamRoomMembers: PropTypes.array.isRequired,
  teamRoomMembersObj: PropTypes.object.isRequired,
  teamRoomMembersPresences: PropTypes.object.isRequired,
  teamRooms: PropTypes.shape({
    teamRoomById: PropTypes.shape({
      teamRoomId: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        teamRoomId: PropTypes.string
      })
    }),
    teamRoomIdsByTeamId: PropTypes.shape({
      ids: PropTypes.array
    })
  }).isRequired,
  teams: PropTypes.shape({
    teamById: PropTypes.shape({
      teamId: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        subscriberOrgId: PropTypes.string
      })
    })
  }).isRequired,
  conversations: PropTypes.shape({
    conversationId: PropTypes.string.isRequired,
    transcript: PropTypes.array
  }).isRequired,
  unreadMessagesCount: PropTypes.number,
  membersTyping: PropTypes.object,
  createMessage: PropTypes.func.isRequired,
  iAmTyping: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired
};

const defaultProps = {
  files: [],
  readMessages: null,
  unreadMessagesCount: 0,
  membersTyping: null
};


function getPercentOfRequest(total, loaded) {
  const percent = (loaded * 100) / total;
  return Math.round(percent);
}

class TeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamRoomMembersLoaded: false,
      conversationsLoaded: false,
      teamRoomMembers: [],
      activeLink: String.t('teamRoomPage.all'),
      replyTo: null,
      showPreviewBox: false,
      barPercent: 0,
      file: null
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onReplyTo = this.onReplyTo.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.typingTimer = null;
  }

  componentDidMount() {
    const teamRoomId = this.props.match.params.teamRoomId;

    this.props.fetchTeamRoomMembersByTeamRoomId(teamRoomId)
      .then(() => this.setState({
        teamRoomMembersLoaded: true,
        teamRoomMembers: this.props.teamRoomMembers
      }));
    this.props.fetchConversations(teamRoomId)
      .then((response) => {
        if (response.data.conversations) {
          const { conversationId } = response.data.conversations[0];

          this.props.fetchTranscript(conversationId)
            .then(() => this.setState({
              conversationsLoaded: true
            }));
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const nextTeamRoomId = nextProps.match.params.teamRoomId;
    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
    if (this.props.match.params.teamRoomId !== nextTeamRoomId) {
      this.setState({ teamRoomMembersLoaded: false, conversationsLoaded: false });

      this.props.fetchTeamRoomMembersByTeamRoomId(nextTeamRoomId)
        .then(() => this.setState({
          teamRoomMembersLoaded: true,
          teamRoomMembers: this.props.teamRoomMembers
        }));

      this.props.fetchConversations(nextTeamRoomId)
        .then((response) => {
          if (response.data.conversations) {
            const { conversationId } = response.data.conversations[0];

            this.props.fetchTranscript(conversationId)
              .then(() => this.setState({
                conversationsLoaded: true
              }));
          }
          if (response.data === 'STALE') {
            this.setState({
              conversationsLoaded: true
            });
          }
        });
    }
  }

  componentDidUpdate() {
    const chatDiv = document.getElementsByClassName('team-room__messages')[0];
    if (chatDiv && (chatDiv.scrollHeight - chatDiv.scrollTop) < 500) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
    if (chatDiv && chatDiv.scrollTop === 0) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }

  onCancelReply() {
    if (this.props.files.length > 0) {
      this.props.clearFileList();
    }
    this.setState({ replyTo: null, showPreviewBox: false });
  }

  onReplyTo(replyObj) {
    this.setState({ showPreviewBox: true, replyTo: replyObj });
  }

  onFileChange(event) {
    const { files } = event.target;
    if (files) {
      this.props.updateFileList(files);
      this.setState({ showPreviewBox: true });
    }
  }

  createResource(file) {
    const fileSource = file.src.split('base64,')[1] || file.src;
    const teamRoomId = this.props.match.params.teamRoomId;
    const teamId = this.props.teamRooms.teamRoomById[teamRoomId].teamId;
    const subscriberOrgId = this.props.teams.teamById[teamId].subscriberOrgId;
    if (!teamRoomId || !teamId || !subscriberOrgId) {
      // Todo throw error invalid team, team room or subscriberOrg
      throw new Error();
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length,
        'x-hablaai-teamroomid': teamRoomId,
        'x-hablaai-teamid': teamId,
        'x-hablaai-subscriberorgid': subscriberOrgId
      },
      onUploadProgress: (progressEvent) => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${getResourcesUrl()}/${file.name}`, fileSource, requestConfig);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { conversationId } = this.props.conversations;
        const postBody = { content: [] };
        const { message } = values;

        this.props.form.resetFields();
        this.stopTyping();
        this.clearTypingTimer();

        if (this.props.files && this.props.files.length > 0) {
          const resources = this.props.files.map(file => this.createResource(file));
          Promise.all(resources)
            .then((res) => {
              postBody.content = res.map((createdResource, index) => {
                return {
                  type: this.props.files[index].type,
                  resourceId: createdResource.data.resourceId,
                  meta: {
                    fileName: this.props.files[index].name,
                    fileSize: this.props.files[index].size,
                    lastModified: this.props.files[index].lastModifiedDate
                  }
                };
              });
              if (message) {
                postBody.content.push({ type: 'text/plain', text: message });
              }
              if (this.state.replyTo) {
                const { messageId } = this.state.replyTo;
                postBody.replyTo = messageId;
                this.setState({ replyTo: null, showPreviewBox: false });
              }
              this.props.createMessage(postBody, conversationId);
              this.setState({ showPreviewBox: false, file: null });
              this.props.clearFileList();
            });
        } else if (message) {
          postBody.content.push({ type: 'text/plain', text: message });
          if (this.state.replyTo) {
            const { messageId } = this.state.replyTo;
            postBody.replyTo = messageId;
            this.setState({ replyTo: null, showPreviewBox: false });
          }
          this.props.createMessage(postBody, conversationId);
        }
      }
    });
  }

  handleHeaderClick(value) {
    this.setState({ activeLink: value });
  }

  handleSearch(value) {
    const teamRoomId = this.props.match.params.teamRoomId;
    const filteredTeamMembers = this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId].filter(({ displayName }) => {
      return displayName.toLowerCase().includes(value.toLowerCase());
    });

    this.setState({ teamRoomMembers: filteredTeamMembers });
  }

  handleTyping = () => {
    const { conversationId } = this.props.conversations;
    this.clearTypingTimer();
    this.typingTimer = setTimeout(this.stopTyping, 5000);
    this.props.iAmTyping(conversationId, true);
  }

  stopTyping = () => {
    const { conversationId } = this.props.conversations;
    this.props.iAmTyping(conversationId, false);
  }

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  }

  renderMessages() {
    return this.props.conversations.transcript.map((message) => {
      const user = this.props.teamRoomMembersObj[message.createdBy];
      const teamRoomId = this.props.match.params.teamRoomId;
      const teamId = this.props.teamRooms.teamRoomById[teamRoomId].teamId;
      const subscriberOrgId = this.props.teams.teamById[teamId].subscriberOrgId;
      return (
        <Message
          message={message}
          user={user}
          key={message.messageId}
          replyTo={this.onReplyTo}
          hide={false}
          teamRoomMembersObj={this.props.teamRoomMembersObj}
          onFileChange={this.onFileChange}
          subscriberOrgId={subscriberOrgId}
          teamId={teamId}
          teamRoomId={teamRoomId}
        />
      );
    });
  }

  renderTeamRoomMembers() {
    const { teamRoomMembers } = this.state;
    const { teamRoomMembersPresences, user } = this.props;

    const members = teamRoomMembers.map(member => ({
      ...member,
      online: _.some(_.values(teamRoomMembersPresences[member.userId]), { presenceStatus: 'online' })
    }));
    const currentUser = _.find(members, { userId: user.userId });
    const otherMembers = _.reject(members, { userId: user.userId });
    const orderedMembers = _.orderBy(otherMembers, ['online', 'firstName', 'lastName', 'displayName'], ['desc', 'asc', 'asc', 'asc']);

    return [currentUser, ...orderedMembers].map(({ firstName, lastName, userId, preferences, icon }) => {
      const initials = getInitials(`${firstName} ${lastName}`);
      if (icon) {
        return <Tooltip placement="top" title={`${firstName} ${lastName}`}><Avatar size="small" src={`data:image/jpeg;base64, ${icon}`} className="mr-05" /></Tooltip>;
      }
      return (
        <Tooltip placement="top" title={`${firstName} ${lastName}`}><Avatar size="small" ey={userId} color={preferences.iconColor} className="mr-05">{initials}</Avatar></Tooltip>
      );
    });
  }

  renderMembersTyping() {
    const { teamRoomMembers, membersTyping } = this.props;
    if (!membersTyping) return null;

    const findUser = userId => _.find(teamRoomMembers, { userId });
    const members = _.compact(_.map(membersTyping, (typing, userId) => typing && findUser(userId)));
    if (members.length === 0) return null;

    const lastIndex = members.length - 1;
    const getSuffix = (index) => {
      if (index === lastIndex) return ' ';
      if (index === lastIndex - 1) return String.t('typingActivityMultipleMemberLastSeparator');
      return String.t('typingActivityMultipleMemberSeparator');
    };

    return (
      <div>
        {members.map((member, index) => (
          <span key={member.userId}>
            <span className="team-room__members-typing-name">
              {String.t('fullName', { firstName: member.firstName, lastName: member.lastName })}
            </span>
            {getSuffix(index)}
          </span>
        ))}
        {String.t('typingActivityTyping', { count: members.length })}
      </div>
    );
  }

  render() {
    const { teamRoomMembersLoaded, conversationsLoaded } = this.state;
    if (teamRoomMembersLoaded && conversationsLoaded) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { teamRooms, user, teamRoomMembers, unreadMessagesCount } = this.props;
      const teamRoomId = this.props.match.params.teamRoomId;
      const teamRoom = teamRooms.teamRoomById[teamRoomId];
      const team = this.props.teams.teamById[teamRoom.teamId];
      const subscriberOrg = this.props.subscriberOrgById[team.subscriberOrgId];
      const className = classNames({
        'team-room-chat': true,
        'team-room__main-container--opacity': this.state.isDraggingOver
      });

      const teamRoomMemberFoundByUser = _.find(teamRoomMembers, { userId: user.userId });
      const isAdmin = teamRoomMemberFoundByUser.teamRooms[teamRoomId].role === 'admin';

      const editButton = {
        showButton: true,
        isAdmin,
        url: `/app/editTeamRoom/${teamRoomId}`
      };
      const menuOptionAll = classNames({
        'notification-menu__item': true,
        active: this.state.all
      });
      const menuOptionReplies = classNames({
        'notification-menu__item': true,
        active: this.state.new
      });
      const menuOptionBookmarked = classNames({
        'notification-menu__item': true,
        active: this.state.bookmarked
      });
      return (
        <div className={className}>
          <div className="team-room__top-page-container">
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
                    { title: teamRoom.name }
                  ]}
                />
              }
              editButton={editButton}
            />
            <SimpleHeader
              type="node"
              text={
                <div className="team-room__member-cards-container">
                  <span className="team-room__member-cards-span habla-label">{String.t('teamRoomPage.membersHeader', { count: numberOfTeamRoomMembers })}</span>
                  {this.renderTeamRoomMembers()}
                  <Tooltip placement="top" title={String.t('teamRoomPage.addTeamMember')}><Avatar size="small" color="#ccc" className="teamRoomInviteMembers">+</Avatar></Tooltip>
                </div>
              }
            />
            <div className="habla-main-content-filters-links teamRoomFilters padding-class-a">
              <div onClick={() => this.onMenuItemClick(true, false, false, false)} className={menuOptionAll}>{String.t('teamRoomPage.menu.all')}</div>
              <div onClick={() => this.onMenuItemClick(false, true, false, false)} className={menuOptionReplies}>{String.t('teamRoomPage.menu.replies')}</div>
              <div onClick={() => this.onMenuItemClick(false, false, true, false)} className={menuOptionBookmarked}>{String.t('teamRoomPage.menu.bookmarks')}</div>
            </div>
          </div>

          {unreadMessagesCount > 0 && (
            <SimpleCardContainer className="team-room__unread-messages border-top-lighter padding-class-a">
              <div className="team-room__unread-messages-count">
                {String.t('teamRoomPage.unreadMessagesCount', { count: unreadMessagesCount })}
              </div>
            </SimpleCardContainer>
          )}

          <SimpleCardContainer className="team-room__messages border-top-lighter">
            {this.renderMessages()}
          </SimpleCardContainer>

          <SimpleCardContainer className="team-room__chat-container">
            { this.state.showPreviewBox &&
              <PreviewBar
                files={this.props.files}
                fileWithPercent={this.state.file}
                updateFiles={this.updateFiles}
                removeFileFromList={this.props.removeFileFromList}
                onCancelReply={this.onCancelReply}
                addBase={this.props.addBase}
                replyTo={this.state.replyTo}
                user={user}
                isDraggingOver={this.props.isDraggingOver}
              />
            }
            <div className="team-room__chat-input">
              <div className="team-room__chat-input__image-wrapper">
                <UserIcon user={user} type="user" minWidth="2.5em" width="2.5em" height="2.5em" key={user.userId} />
              </div>
              <div className="team-room__chat-input-wrapper">
                <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
                  <TextField
                    componentKey="message"
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder={String.t('teamRoomPage.replyPlaceholder')}
                    label=""
                    className="team-room__chat-input-form-item"
                    inputClassName="team-room__chat-input-textfield"
                    onChange={this.handleTyping}
                  />
                </Form>
              </div>
              <div className="team-room__chat-col-icons">
                <a className="team-room__icons" role="button" tabIndex={0} onClick={this.handleSubmit}>
                  <i className="fa fa-paper-plane-o" />
                </a>
                <div>
                  <input
                    id="fileupload"
                    className="team-room__file-upload-input"
                    type="file"
                    onChange={this.onFileChange}
                    multiple
                  />
                  <label htmlFor="fileupload" className="team-room__icons"><i className="fa fa-folder-o" /></label>
                </div>
              </div>
            </div>
            <div className="team-room__members-typing">
              {this.renderMembersTyping()}
            </div>

          </SimpleCardContainer>

        </div>
      );
    }

    return <Spinner />;
  }
}

TeamRoomPage.propTypes = propTypes;
TeamRoomPage.defaultProps = defaultProps;

export default Form.create()(TeamRoomPage);
