import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, isEmpty } from 'lodash';
import { message as msg } from 'antd';

import String from 'src/translations';
import { Bookmark } from 'src/containers';
import { messageAction } from 'src/components/ChatMessage/ChatMessage';
import { SimpleCardContainer, PageHeader } from 'src/components';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
  bookmarks: PropTypes.array,
  fetchBookmarks: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired
};

const defaultProps = {
  bookmarks: []
};

class BookmarksPage extends Component {
  componentDidMount() {
    this.props.fetchBookmarks();
  }

  onMessageAction = (payload, action) => {
    const { message } = payload;
    switch (action) {
      case messageAction.delete:
        this.props
          .deleteMessage(message)
          .then(() => {
            msg.success(String.t('message.messageDeleted'));
          })
          .catch(error => {
            msg.error(error.message);
          });
        break;
      default:
        break;
    }
  };

  renderBookmark = message => {
    if (!message) return null;

    const { subscribers } = this.props;
    const { id, createdBy, deleted } = message;
    const sender = find(subscribers, { userId: createdBy });
    if (!sender || deleted) return null;

    return <Bookmark key={id} message={message} sender={sender} onMessageAction={this.onMessageAction} />;
  };

  render() {
    const { bookmarks } = this.props;

    return (
      <div>
        <PageHeader pageBreadCrumb={{ routes: [{ title: String.t('bookmarksPage.title') }] }} backButton settingsIcon />
        {isEmpty(bookmarks) && (
          <div className="habla__placeholder-centered-container">
            <div className="habla__placeholder-centered-text">{String.t('bookmarksPage.noBookmarks')}</div>
          </div>
        )}
        {!isEmpty(bookmarks) && (
          <SimpleCardContainer className="team__messages">{bookmarks.map(this.renderBookmark)}</SimpleCardContainer>
        )}
      </div>
    );
  }
}

BookmarksPage.propTypes = propTypes;
BookmarksPage.defaultProps = defaultProps;

export default BookmarksPage;
