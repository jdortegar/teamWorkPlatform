import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Tooltip } from 'antd';
import String from 'src/translations';

const propTypes = {
  onReply: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  onDeleteConfirmed: PropTypes.func.isRequired,
  handleShareProfile: PropTypes.func.isRequired,
  handleEditMessage: PropTypes.func.isRequired,
  bookmarked: PropTypes.bool,
  showOptions: PropTypes.bool
};

const defaultProps = {
  bookmarked: false,
  showOptions: false
};

const MessageOptions = ({
  bookmarked,
  showOptions,
  onReply,
  onBookmark,
  onDeleteConfirmed,
  handleShareProfile,
  handleEditMessage
}) => (
  <div className="message__options hide">
    <Tooltip placement="topLeft" title={String.t('message.tooltipReply')}>
      <a
        className="message__icons"
        onClick={e => {
          e.stopPropagation();
          onReply();
        }}
      >
        <i className="fas fa-reply" />
      </a>
    </Tooltip>
    {showOptions && (
      <Popconfirm
        placement="topRight"
        title={String.t('message.deleteConfirmationQuestion')}
        okText={<span className="message__delete_buttons">{String.t('okButton')}</span>}
        cancelText={<span className="message__delete_buttons">{String.t('cancelButton')}</span>}
        onConfirm={onDeleteConfirmed}
      >
        <a className="message__icons">
          <i className="fas fa-trash-alt" />
        </a>
      </Popconfirm>
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
          onBookmark(!bookmarked);
        }}
      >
        <i className="fas fa-bookmark" />
      </a>
    </Tooltip>
  </div>
);

MessageOptions.propTypes = propTypes;
MessageOptions.defaultProps = defaultProps;

export default MessageOptions;
