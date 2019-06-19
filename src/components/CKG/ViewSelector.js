import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Tooltip } from 'antd';

import String from 'src/translations';
import { CKG_VIEWS } from 'src/redux-hablaai/actions';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  activeView: PropTypes.string,
  hideMessages: PropTypes.bool,
  hideFileAttachments: PropTypes.bool,
  searchedAttachedFiles: PropTypes.number.isRequired,
  searchedChatMessages: PropTypes.number.isRequired,
  searchedFiles: PropTypes.number.isRequired
};

const defaultProps = {
  activeView: CKG_VIEWS.FILE_LIST,
  hideMessages: false,
  hideFileAttachments: false
};

const ViewSelector = ({
  activeView,
  onChange,
  hideMessages,
  hideFileAttachments,
  searchedChatMessages,
  searchedAttachedFiles,
  searchedFiles
}) => {
  return (
    <span className="CKG__view-selector">
      <Radio.Group value={activeView} onChange={e => onChange(e.target.value)} buttonStyle="solid">
        {!hideMessages && (
          <Tooltip title={searchedChatMessages !== 0 ? String.t(`ckg.${CKG_VIEWS.MESSAGES}`) : String.t('noResults')}>
            <Radio.Button value={CKG_VIEWS.MESSAGES} disabled={searchedChatMessages === 0}>
              <i className="far fa-comment-dots" title={String.t(`ckg.${CKG_VIEWS.MESSAGES}`)} />
            </Radio.Button>
          </Tooltip>
        )}
        <Tooltip title={searchedFiles !== 0 ? String.t(`ckg.${CKG_VIEWS.FILE_LIST}`) : String.t('noResults')}>
          <Radio.Button value={CKG_VIEWS.FILE_LIST} disabled={searchedFiles === 0}>
            <i className="fa fa-list-ul" title={String.t(`ckg.${CKG_VIEWS.FILE_LIST}`)} />
          </Radio.Button>
        </Tooltip>
        <Tooltip title={searchedFiles !== 0 ? String.t(`ckg.${CKG_VIEWS.TIME_ACTIVITY}`) : String.t('noResults')}>
          <Radio.Button value={CKG_VIEWS.TIME_ACTIVITY} disabled={searchedFiles === 0}>
            <i className="fa fa-chart-area" title={String.t(`ckg.${CKG_VIEWS.TIME_ACTIVITY}`)} />
          </Radio.Button>
        </Tooltip>
        {!hideFileAttachments && (
          <Tooltip
            title={searchedAttachedFiles !== 0 ? String.t(`ckg.${CKG_VIEWS.FILE_ATTACHMENTS}`) : String.t('noResults')}
          >
            <Radio.Button value={CKG_VIEWS.FILE_ATTACHMENTS} disabled={searchedAttachedFiles === 0}>
              <i className="fa fa-paperclip" title={String.t(`ckg.${CKG_VIEWS.FILE_ATTACHMENTS}`)} />
            </Radio.Button>
          </Tooltip>
        )}
      </Radio.Group>
    </span>
  );
};

ViewSelector.propTypes = propTypes;
ViewSelector.defaultProps = defaultProps;

export default ViewSelector;
