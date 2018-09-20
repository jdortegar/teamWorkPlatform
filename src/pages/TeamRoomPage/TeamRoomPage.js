import React, { Component } from 'react';
import _ from 'lodash';
import { Form, Tooltip, message as msg } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { sortByFirstName } from 'src/redux-hablaai/selectors/helpers';
import { messageAction } from 'src/components/Message/Message';
import {
  BreadCrumb,
  SubpageHeader,
  SimpleHeader,
  Spinner,
  SimpleCardContainer,
  TextField,
  Avatar,
  AvatarWrapper,
  PreviewBar,
  Message
} from 'src/components';

import './styles/style.css';

const filterOption = {
  all: 'all',
  unread: 'unread',
  bookmarked: 'bookmarked'
};

const BOTTOM_SCROLL_LIMIT = 200;

const propTypes = {
  history: PropTypes.object.isRequired,
  files: PropTypes.array,
  form: formShape.isRequired,
  fetchTeamRoomMembersByTeamRoomId: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  fetchTranscript: PropTypes.func.isRequired,
  saveBookmark: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.object.isRequired,
  resourcesUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  teamRoomMembers: PropTypes.array.isRequired,
  teamRoomMembersObj: PropTypes.object.isRequired,
  teamRoomMembersPresences: PropTypes.object.isRequired,
  teamRooms: PropTypes.shape({
    teamRoomById: PropTypes.shape({
      teamRoomId: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        teamId: PropTypes.string,
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
  }),
  unreadMessagesCount: PropTypes.number,
  membersTyping: PropTypes.object,
  createMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  readMessage: PropTypes.func.isRequired,
  iAmTyping: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired
};

const defaultProps = {
  conversations: {},
  files: [],
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
      lastSubmittedMessage: null,
      teamRoomMembersLoaded: false,
      conversationsLoaded: false,
      teamRoomMembers: [],
      replyTo: null,
      showPreviewBox: false,
      file: null,
      filterBy: filterOption.all
    };

    this.onCancelReply = this.onCancelReply.bind(this);
    this.onMessageAction = this.onMessageAction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.typingTimer = null;
  }

  componentDidMount() {
    const { teamRoomId } = this.props.match.params;

    // TODO: What do we do if the fetch fails???
    this.props
      .fetchTeamRoomMembersByTeamRoomId(teamRoomId)
      .then(() =>
        this.setState({
          teamRoomMembersLoaded: true,
          teamRoomMembers: this.props.teamRoomMembers
        })
      )
      .catch(() => this.props.history.replace('/app'));

    this.props
      .fetchConversations(teamRoomId)
      .then(response => {
        if (response.data.conversations) {
          const { conversationId } = response.data.conversations[0];

          this.props
            .fetchTranscript(conversationId)
            .then(() =>
              this.setState({
                conversationsLoaded: true
              })
            )
            .then(this.scrollToBottom);
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      })
      .catch(() => this.props.history.replace('/app'));
  }

  componentWillReceiveProps(nextProps) {
    const nextTeamRoomId = nextProps.match.params.teamRoomId;
    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
    if (this.props.match.params.teamRoomId !== nextTeamRoomId) {
      this.setState({ teamRoomMembersLoaded: false, conversationsLoaded: false });

      this.props.fetchTeamRoomMembersByTeamRoomId(nextTeamRoomId).then(() =>
        this.setState({
          teamRoomMembersLoaded: true,
          teamRoomMembers: this.props.teamRoomMembers
        })
      );

      this.props.fetchConversations(nextTeamRoomId).then(response => {
        if (response.data.conversations) {
          const { conversationId } = response.data.conversations[0];

          this.props.fetchTranscript(conversationId).then(() =>
            this.setState({
              conversationsLoaded: true
            })
          );
        }
        if (response.data === 'STALE') {
          this.setState({
            conversationsLoaded: true
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { conversations, user } = this.props;
    if (!prevProps.conversations || !conversations) return;
    if (prevProps.conversations.transcript.length === conversations.transcript.length) return;

    const ownMessage = _.last(conversations.transcript).createdBy === user.userId;
    if (ownMessage || this.isNearBottom()) this.scrollToBottom();
  }

  onCancelReply() {
    if (this.props.files.length > 0) {
      this.props.clearFileList();
    }
    this.setState({ replyTo: null, showPreviewBox: false });
  }

  onMessageAction(payload, action) {
    const { message, bookmark, extraInfo } = payload;
    const { match, teamRooms, teams, user } = this.props;
    const { teamRoomId } = match.params;
    const { teamId } = teamRooms.teamRoomById[teamRoomId];
    const { subscriberOrgId } = teams.teamById[teamId];

    switch (action) {
      case messageAction.replyTo:
        this.setState({ showPreviewBox: true, replyTo: extraInfo });
        break;
      case messageAction.bookmark:
        this.props
          .saveBookmark(user, subscriberOrgId, bookmark, extraInfo.setBookmark)
          .then(() => {
            msg.success(String.t(extraInfo.setBookmark ? 'message.bookmarkSetToast' : 'message.bookmarkRemovedToast'));
          })
          .catch(error => {
            msg.error(error.message);
          });
        break;
      case messageAction.delete:
        this.props
          .deleteMessage(message.messageId, message.conversationId)
          .then(() => {
            msg.success(String.t('message.deleteSuccessToast'));
          })
          .catch(error => {
            msg.error(error.message);
          });
        break;
      default:
        break;
    }
  }

  onFileChange(event) {
    const { files } = event.target;
    if (files) {
      this.props.updateFileList(files);
      this.setState({ showPreviewBox: true });
    }
  }

  getTeamMembersObjFromSubscribers() {
    const { teamRoomMembersObj, subscribers } = this.props;
    const members = subscribers.filter(mem => teamRoomMembersObj[mem.userId]);
    const membersObj = {};
    members.forEach(mem => {
      membersObj[mem.userId] = mem;
    });
    return membersObj;
  }

  isNearBottom = () => {
    const messagesContainer = document.getElementsByClassName('team-room__messages')[0];
    if (!messagesContainer) return false;

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < BOTTOM_SCROLL_LIMIT;
  };

  scrollToBottom = () => {
    const messagesContainer = document.getElementsByClassName('team-room__messages')[0];
    if (!messagesContainer) return;

    const { clientHeight, scrollHeight } = messagesContainer;
    if (clientHeight < scrollHeight) {
      messagesContainer.scrollTop = scrollHeight;
    }
  };

  handleTyping = () => {
    const { conversationId } = this.props.conversations;
    this.clearTypingTimer();
    this.typingTimer = setTimeout(this.stopTyping, 5000);
    this.props.iAmTyping(conversationId, true);
  };

  stopTyping = () => {
    const { conversationId } = this.props.conversations;
    this.props.iAmTyping(conversationId, false);
  };

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  };

  shouldDisableConversation() {
    const teamRoom = this.props.teamRooms.teamRoomById[this.props.match.params.teamRoomId];
    const team = this.props.teams.teamById[teamRoom.teamId];
    return !teamRoom.active || !team.active;
  }

  shouldDisableSubmit() {
    const textOrig = this.props.form.getFieldValue('message');
    if (!textOrig) return false;
    const text = textOrig.trim();
    const { files } = this.props;
    return !(files && files.length) && !(text && text.length);
  }

  handleSubmit(e) {
    if (this.shouldDisableSubmit() || this.shouldDisableConversation()) {
      return;
    }

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { conversationId } = this.props.conversations;
        const postBody = { content: [] };
        const message = values.message.trim();

        this.stopTyping();
        this.clearTypingTimer();

        if (this.props.files && this.props.files.length > 0) {
          const resources = this.props.files.map(file => this.createResource(file));
          Promise.all(resources)
            .then(res => {
              this.props.form.resetFields();
              postBody.content = res.map((createdResource, index) => ({
                type: this.props.files[index].type,
                resourceId: createdResource.data.resourceId,
                meta: {
                  fileName: this.props.files[index].name,
                  fileSize: this.props.files[index].size,
                  lastModified: this.props.files[index].lastModifiedDate
                }
              }));
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
            })
            .catch(error => {
              this.props.updateFileList(this.props.files);
              this.setState({ file: null });
              msg.error(error.message);
            });
        } else if (message) {
          postBody.content.push({ type: 'text/plain', text: message });
          if (this.state.replyTo) {
            const { messageId } = this.state.replyTo;
            postBody.replyTo = messageId;
            this.setState({ replyTo: null, showPreviewBox: false });
          }
          this.props
            .createMessage(postBody, conversationId)
            .then(({ data }) => {
              this.setState({ lastSubmittedMessage: data.message });
              this.props.form.resetFields();
            })
            .catch(error => {
              msg.error(error.message);
            });
        }
      }
    });
  }

  handleSearch(value) {
    const { teamRoomId } = this.props.match.params;
    const filteredTeamMembers = this.props.teamRoomMembers.teamRoomMembersByTeamRoomId[teamRoomId].filter(
      ({ displayName }) => displayName.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ teamRoomMembers: filteredTeamMembers });
  }

  createResource(file) {
    const fileSource = file.src.split('base64,')[1] || file.src;
    const { teamRoomId } = this.props.match.params;
    const { teamId } = this.props.teamRooms.teamRoomById[teamRoomId];
    const { subscriberOrgId } = this.props.teams.teamById[teamId];
    if (!teamRoomId || !teamId || !subscriberOrgId) {
      // Todo throw error invalid team, team room or subscriberOrg
      throw new Error();
    }

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length,
        'x-hablaai-teamroomid': teamRoomId,
        'x-hablaai-teamid': teamId,
        'x-hablaai-subscriberorgid': subscriberOrgId
      },
      onUploadProgress: progressEvent => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${this.props.resourcesUrl}/${file.name}`, fileSource, requestConfig);
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  }

  renderMessages(isAdmin) {
    const { match, teamRooms, teams, conversations, teamRoomMembersObj, user } = this.props;
    const { lastSubmittedMessage } = this.state;
    const currentPath = lastSubmittedMessage ? lastSubmittedMessage.path : null;
    const disableConversation = this.shouldDisableConversation();
    const { teamRoomId } = match.params;
    const { teamId } = teamRooms.teamRoomById[teamRoomId];
    const { subscriberOrgId } = teams.teamById[teamId];
    const membersObj = this.getTeamMembersObjFromSubscribers();

    return conversations.transcript.map(message => {
      if (message.deleted) return null;
      return (
        <Message
          conversationDisabled={disableConversation}
          message={message}
          user={teamRoomMembersObj[message.createdBy]}
          currentUser={user}
          key={message.messageId}
          onMessageAction={this.onMessageAction}
          hide={false}
          currentPath={currentPath}
          teamRoomMembersObj={membersObj}
          onFileChange={this.onFileChange}
          subscriberOrgId={subscriberOrgId}
          teamId={teamId}
          teamRoomId={teamRoomId}
          isAdmin={isAdmin}
          onLoadImages={this.scrollToBottom}
        />
      );
    });
  }

  renderTeamRoomMembers() {
    const { teamRoomMembersPresences, user } = this.props;

    const membersObj = this.getTeamMembersObjFromSubscribers();
    const members = Object.keys(membersObj).map(key => {
      const member = membersObj[key];
      return {
        ...member,
        online: _.some(_.values(teamRoomMembersPresences[member.userId]), { presenceStatus: 'online' })
      };
    });

    const currentUser = _.find(members, { userId: user.userId });
    const otherMembers = _.reject(members, { userId: user.userId });
    //  const orderedMembers = _.orderBy(otherMembers, ['online', 'firstName', 'lastName', 'displayName'], ['desc', 'asc', 'asc', 'asc']);
    const orderedMembers = otherMembers.sort(sortByFirstName);

    return [currentUser, ...orderedMembers].map(member => {
      const { firstName, lastName, userId } = member;
      const fullName = String.t('fullName', { firstName, lastName });
      return (
        <Tooltip key={userId} placement="top" title={fullName}>
          <div className="mr-05">
            <AvatarWrapper size="small" user={member} />
          </div>
        </Tooltip>
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
    const getSuffix = index => {
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
    const { teamRoomMembersLoaded, conversationsLoaded, filterBy } = this.state;
    const {
      match,
      teamRooms,
      user,
      teamRoomMembers,
      teamRoomMembersObj,
      unreadMessagesCount,
      conversations,
      subscribers,
      subscriberOrgById
    } = this.props;
    if (
      match &&
      match.params &&
      match.params.teamRoomId &&
      teamRoomMembersLoaded &&
      conversationsLoaded &&
      teamRoomMembers &&
      subscribers &&
      teamRoomMembersObj &&
      this.state.teamRoomMembers &&
      conversations &&
      subscriberOrgById
    ) {
      const numberOfTeamRoomMembers = this.state.teamRoomMembers.length;
      const { conversationId } = conversations;
      const lastMessage = _.last(conversations.transcript) || {};
      const { teamRoomId } = match.params;
      const teamRoom = teamRooms.teamRoomById[teamRoomId];
      const team = this.props.teams.teamById[teamRoom.teamId];
      const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
      const className = classNames({
        'team-room-chat': true,
        'team-room__main-container--opacity': this.state.isDraggingOver
      });
      const disableConversation = this.shouldDisableConversation();

      const teamRoomMemberFoundByUser = _.find(teamRoomMembers, { userId: user.userId });
      const isAdmin = teamRoomMemberFoundByUser.teamRooms[teamRoomId].role === 'admin';

      const editButton = {
        showButton: true,
        isAdmin,
        url: `/app/editTeamRoom/${teamRoomId}`
      };
      const menuOptionAll = classNames({
        'habla-tab__item': true,
        active: filterBy === filterOption.all
      });
      const menuOptionUnread = classNames({
        'habla-tab__item': true,
        active: filterBy === filterOption.unread
      });
      const menuOptionBookmarked = classNames({
        'habla-tab__item': true,
        active: filterBy === filterOption.bookmarked
      });
      return (
        <div className={className}>
          <div className="team-room__top-page-container border-bottom-lighter">
            <SubpageHeader
              subscriberOrgId={subscriberOrg.subscriberOrgId}
              ckgLink={{ teamId: team.teamId, teamRoomId }}
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
                  <span className="team-room__member-cards-span habla-label">
                    {String.t('teamRoomPage.membersHeader', { count: numberOfTeamRoomMembers })}
                  </span>
                  {this.renderTeamRoomMembers()}
                  {isAdmin &&
                    teamRoom.active &&
                    team.active && (
                      <Tooltip placement="top" title={String.t('teamRoomPage.addTeamMember')}>
                        <Link to={`/app/inviteToTeamRoom/${teamRoomId}`}>
                          <Avatar size="small" color="#ccc" className="teamRoomInviteMembers">
                            +
                          </Avatar>
                        </Link>
                      </Tooltip>
                    )}
                </div>
              }
            />
            <div className="habla-main-content-filters-links teamRoomFilters padding-class-a">
              <div
                onClick={() => this.setState({ filterBy: filterOption.bookmarked })}
                className={menuOptionBookmarked}
              >
                {String.t('teamRoomPage.menu.bookmarked')}
              </div>
              <div onClick={() => this.setState({ filterBy: filterOption.unread })} className={menuOptionUnread}>
                {String.t('teamRoomPage.menu.unread')}
              </div>
              <div onClick={() => this.setState({ filterBy: filterOption.all })} className={menuOptionAll}>
                {String.t('teamRoomPage.menu.all')}
              </div>
            </div>
          </div>

          {unreadMessagesCount > 0 && (
            <SimpleCardContainer className="team-room__unread-messages padding-class-a">
              <div
                className="team-room__unread-messages-link"
                onClick={() => this.props.readMessage(lastMessage.messageId, conversationId)}
              >
                {String.t('teamRoomPage.markAllAsRead')}
              </div>
              <div className="team-room__unread-messages-dot">&middot;</div>
              <div className="team-room__unread-messages-count">
                {String.t('teamRoomPage.unreadMessagesCount', { count: unreadMessagesCount })}
              </div>
            </SimpleCardContainer>
          )}

          <SimpleCardContainer className="team-room__messages">{this.renderMessages(isAdmin)}</SimpleCardContainer>

          <SimpleCardContainer className="team-room__chat-container">
            {this.state.showPreviewBox && (
              <PreviewBar
                files={this.props.files}
                fileWithPercent={this.state.file}
                updateFiles={this.updateFiles}
                removeFileFromList={this.props.removeFileFromList}
                onCancelReply={this.onCancelReply}
                addBase={this.props.addBase}
                replyTo={this.state.replyTo}
                user={teamRoomMemberFoundByUser}
                isDraggingOver={this.props.isDraggingOver}
              />
            )}
            <div className="team-room__chat-input">
              <div className="team-room__chat-input__image-wrapper">
                <AvatarWrapper size="large" user={teamRoomMemberFoundByUser} />
              </div>
              <div className="team-room__chat-input-wrapper">
                <Form
                  onSubmit={this.handleSubmit}
                  className="login-form"
                  autoComplete="off"
                  disabled={disableConversation}
                >
                  <TextField
                    disabled={disableConversation}
                    componentKey="message"
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder={String.t('teamRoomPage.replyPlaceholder')}
                    label=""
                    className="team-room__chat-input-form-item"
                    inputClassName="team-room__chat-input-textfield"
                    onChange={this.handleTyping}
                    autoFocus
                  />
                </Form>
              </div>
              <div className="team-room__chat-col-icons">
                <a
                  className="team-room__icons"
                  role="button"
                  tabIndex={0}
                  disabled={this.shouldDisableSubmit() || disableConversation}
                  onClick={this.handleSubmit}
                >
                  <i className="fas fa-paper-plane" />
                </a>
                <div>
                  <input
                    id="fileupload"
                    disabled={disableConversation}
                    className="team-room__file-upload-input"
                    type="file"
                    onChange={this.onFileChange}
                    multiple
                  />
                  <label htmlFor="fileupload" className="team-room__icons">
                    <Tooltip placement="top" title={String.t('teamRoomPage.tooltipAttachments')} arrowPointAtCenter>
                      <i className="fas fa-paperclip" />
                    </Tooltip>
                  </label>
                </div>
              </div>
            </div>
            <div className="team-room__members-typing">{this.renderMembersTyping()}</div>
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
