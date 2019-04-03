import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { message as msg } from 'antd';

import String from 'src/translations';
import { ChatMessage } from 'src/containers';
import { messageAction } from 'src/components/ChatMessage/ChatMessage';
import { SimpleCardContainer, PageHeader, Spinner } from 'src/components';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  saveBookmark: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired
};

const filterOption = {
  all: 'all',
  sent: 'sent',
  received: 'received'
};

export default class BookmarksPage extends Component {
  constructor(props) {
    super(props);

    this.state = { filterBy: filterOption.all };

    this.onMessageAction = this.onMessageAction.bind(this);
    this.onBookmarkClick = this.onBookmarkClick.bind(this);
  }

  onMessageAction(payload, action) {
    const { message, bookmark, extraInfo } = payload;
    const { user, subscriberOrgs } = this.props;
    switch (action) {
      case messageAction.replyTo:
        // TODO: Add code to reply
        break;
      case messageAction.bookmark:
        this.props
          .saveBookmark(user, subscriberOrgs.currentSubscriberOrgId, bookmark, extraInfo.setBookmark)
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

  onBookmarkClick(bookmark) {
    const { teamId, messageId } = bookmark;
    this.props.history.push(`/app/team/${teamId}`, { gotoMessage: messageId });
  }

  renderBookmark(bookmark) {
    const { user, subscribers, subscribersPresences } = this.props;
    if (!bookmark || !user) return null;

    const { createdBy, deleted, messageId, teamId } = bookmark;
    const member = _.find(subscribers, { userId: createdBy });
    if (!member) return null;
    const sender = {
      ...member,
      online: _.some(_.values(subscribersPresences[member.userId]), { presenceStatus: 'online' })
    };

    if (deleted || !teamId) return null;

    return (
      <div key={messageId} onClick={() => this.onBookmarkClick(bookmark)}>
        <ChatMessage message={bookmark} sender={sender} teamId={teamId} onMessageAction={this.onMessageAction} />
      </div>
    );
  }

  renderByFilter(orgBookmarks, keys, emptyMessage) {
    if (keys.length === 0) {
      return (
        <div className="habla__placeholder-centered-container">
          <div className="habla__placeholder-centered-text">{emptyMessage}</div>
        </div>
      );
    }
    const sortedKeys = keys.sort((aKey, bKey) => {
      if (orgBookmarks[aKey].created === orgBookmarks[bKey].created) return 0;
      return orgBookmarks[aKey].created < orgBookmarks[bKey].created ? 1 : -1;
    });

    return (
      <SimpleCardContainer className="team__messages">
        {sortedKeys.map(key => this.renderBookmark(orgBookmarks[key]))}
      </SimpleCardContainer>
    );
  }

  render() {
    const { match, subscribers, subscriberOrgs, subscribersPresences, user } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      !subscriberOrgs ||
      !subscribers ||
      !subscribers.length ||
      !user ||
      !subscribersPresences
    ) {
      return <Spinner />;
    }

    const { subscriberOrgId } = match.params;
    if (subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId) {
      this.props.history.replace('/app');
      return null;
    }

    const orgBookmarks = user.bookmarks[subscriberOrgId] ? user.bookmarks[subscriberOrgId].messageIds : {};
    const allKeys = Object.keys(orgBookmarks);
    const { filterBy } = this.state;
    const menuOptionAll = classNames({ 'habla-tab__item': true, active: filterBy === filterOption.all });
    const menuOptionSent = classNames({ 'habla-tab__item': true, active: filterBy === filterOption.sent });
    const menuOptionReceived = classNames({ 'habla-tab__item': true, active: filterBy === filterOption.received });
    const sentKeys = allKeys.filter(key => orgBookmarks[key].createdBy === user.userId);
    const receivedKeys = allKeys.filter(key => orgBookmarks[key].createdBy !== user.userId);

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('bookmarksPage.title')
        }
      ]
    };

    return (
      <div>
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          backButton
          optionalButtons={{
            enabled: true,
            content: (
              <div className="habla-main-content-filters-links">
                <div onClick={() => this.setState({ filterBy: filterOption.all })} className={menuOptionAll}>
                  {String.t('bookmarksPage.menu.all')}{' '}
                  {String.t('bookmarksPage.filterCount', { count: allKeys.length })}
                </div>
                <div onClick={() => this.setState({ filterBy: filterOption.sent })} className={menuOptionSent}>
                  {String.t('bookmarksPage.menu.sent')}{' '}
                  {String.t('bookmarksPage.filterCount', { count: sentKeys.length })}
                </div>
                <div onClick={() => this.setState({ filterBy: filterOption.received })} className={menuOptionReceived}>
                  {String.t('bookmarksPage.menu.received')}{' '}
                  {String.t('bookmarksPage.filterCount', { count: receivedKeys.length })}
                </div>
              </div>
            )
          }}
        />
        {filterBy === filterOption.all &&
          this.renderByFilter(orgBookmarks, allKeys, String.t('bookmarksPage.noBookmarks'))}
        {filterBy === filterOption.sent &&
          this.renderByFilter(orgBookmarks, sentKeys, String.t('bookmarksPage.noSentBookmarks'))}
        {filterBy === filterOption.received &&
          this.renderByFilter(orgBookmarks, receivedKeys, String.t('bookmarksPage.noReceivedBookmarks'))}
      </div>
    );
  }
}

BookmarksPage.propTypes = propTypes;
