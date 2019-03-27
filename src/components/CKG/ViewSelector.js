import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Tooltip } from 'antd';

import String from 'src/translations';
import { CKG_VIEWS } from 'src/redux-hablaai/actions';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  activeView: PropTypes.string,
  ignoreMessages: PropTypes.bool
};

const defaultProps = {
  activeView: CKG_VIEWS.FILE_LIST,
  ignoreMessages: false
};

const ViewSelector = ({ activeView, onChange, ignoreMessages }) => {
  return (
    <span className="CKG__view-pickers">
      <Radio.Group value={activeView} onChange={e => onChange(e.target.value)} buttonStyle="solid">
        {!ignoreMessages && (
          <Tooltip title={String.t(`ckg.${CKG_VIEWS.MESSAGES}`)}>
            <Radio.Button value={CKG_VIEWS.MESSAGES}>
              <i className="far fa-comment-dots" title={String.t(`ckg.${CKG_VIEWS.MESSAGES}`)} />
            </Radio.Button>
          </Tooltip>
        )}
        <Tooltip title={String.t(`ckg.${CKG_VIEWS.FILE_LIST}`)}>
          <Radio.Button value={CKG_VIEWS.FILE_LIST}>
            <i className="fa fa-list-ul" title={String.t(`ckg.${CKG_VIEWS.FILE_LIST}`)} />
          </Radio.Button>
        </Tooltip>
        <Tooltip title={String.t(`ckg.${CKG_VIEWS.TIME_ACTIVITY}`)}>
          <Radio.Button value={CKG_VIEWS.TIME_ACTIVITY}>
            <i className="fa fa-chart-area" title={String.t(`ckg.${CKG_VIEWS.TIME_ACTIVITY}`)} />
          </Radio.Button>
        </Tooltip>
        <Tooltip title={String.t(`ckg.${CKG_VIEWS.FILE_ATTACHMENTS}`)}>
          <Radio.Button value={CKG_VIEWS.FILE_ATTACHMENTS}>
            <i className="fa fa-paperclip" title={String.t(`ckg.${CKG_VIEWS.FILE_ATTACHMENTS}`)} />
          </Radio.Button>
        </Tooltip>
      </Radio.Group>
    </span>
  );
};

ViewSelector.propTypes = propTypes;
ViewSelector.defaultProps = defaultProps;

export default ViewSelector;
