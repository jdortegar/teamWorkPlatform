import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import String from 'src/translations';

const propTypes = {
  onReply: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleShareProfile: PropTypes.func.isRequired,
  handleEditMessage: PropTypes.func.isRequired,
  onAddReaction: PropTypes.func.isRequired,
  bookmarked: PropTypes.bool,
  showOptions: PropTypes.bool,
  attachments: PropTypes.array.isRequired,
  showReply: PropTypes.bool
};

const defaultProps = {
  bookmarked: false,
  showOptions: false,
  showReply: true
};

const MessageOptions = ({
  bookmarked,
  showOptions,
  onReply,
  onBookmark,
  onDelete,
  handleShareProfile,
  handleEditMessage,
  onAddReaction,
  attachments,
  showReply
}) => (
  <div className="message__options hide">
    {showReply && (
      <Tooltip placement="topLeft" title={String.t('message.tooltipReply')}>
        <a
          className="message__icons"
          onClick={e => {
            e.stopPropagation();
            onReply(true);
          }}
        >
          <i className="fas fa-reply" />
        </a>
      </Tooltip>
    )}
    <Tooltip placement="topLeft" title={String.t('message.tooltipAddReaction')}>
      <a
        className="message__icons"
        onClick={e => {
          e.stopPropagation();
          onAddReaction();
        }}
      >
        <i className="far fa-smile" />
      </a>
    </Tooltip>
    {showOptions && (
      <Tooltip placement="topLeft" title={String.t('message.tooltipDelete')} arrowPointAtCenter>
        <a
          className="message__icons"
          onClick={e => {
            e.stopPropagation();
            onDelete(true);
          }}
        >
          <i className="fas fa-trash-alt" />
        </a>
      </Tooltip>
    )}
    {showOptions && (
      <Tooltip placement="topLeft" title={String.t('message.tooltipEdit')} arrowPointAtCenter>
        <a
          className="message__icons"
          onClick={e => {
            e.stopPropagation();
            handleEditMessage(true);
          }}
        >
          <i className="fas fa-edit" />
        </a>
      </Tooltip>
    )}
    <Tooltip placement="topLeft" title={String.t('shareUser')} arrowPointAtCenter>
      <a
        className="message__icons"
        onClick={e => {
          e.stopPropagation();
          handleShareProfile(false);
        }}
      >
        <i className="fas fa-user" />
      </a>
    </Tooltip>
    <Tooltip placement="topLeft" title={String.t('sharePT')} arrowPointAtCenter>
      <a
        className="message__icons"
        onClick={e => {
          e.stopPropagation();
          handleShareProfile(true);
        }}
      >
        <i className="fas fa-users" />
      </a>
    </Tooltip>
    <Tooltip
      placement="topLeft"
      title={String.t(bookmarked ? 'message.tooltipBookmarkRemove' : 'message.tooltipBookmarkSet')}
      arrowPointAtCenter
    >
      <a
        className={bookmarked ? 'message__icons message__icons-selected' : 'message__icons'}
        onClick={e => {
          e.stopPropagation();
          onBookmark(bookmarked);
        }}
      >
        <i className="fas fa-bookmark" />
      </a>
    </Tooltip>
    {attachments.length > 0 && (
      <Tooltip
        placement="topLeft"
        title={String.t(bookmarked ? 'message.tooltipBookmarkRemove' : 'message.tooltipDownloadFile')}
        arrowPointAtCenter
      >
        <a
          className="message__icons"
          download={attachments[0].meta.fileName}
          href={attachments[0] ? attachments[0].meta.fileUrl : ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fas fa-download" />
        </a>
      </Tooltip>
    )}
  </div>
);

MessageOptions.propTypes = propTypes;
MessageOptions.defaultProps = defaultProps;

export default MessageOptions;
