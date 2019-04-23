import React from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';

import { Tooltip, message } from 'antd';
import imageSrcFromFileExtension from 'src/lib/imageFiles';

const propTypes = {
  text: PropTypes.string.isRequired,
  file: PropTypes.object,
  caseSensitive: PropTypes.bool.isRequired,
  highlightSearch: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  keywords: PropTypes.array,
  showCopyIcon: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  createMessage: PropTypes.func.isRequired
};

const defaultProps = {
  keywords: [],
  file: {},
  showCopyIcon: false
};

export const ItemTypes = {
  FILE: 'file'
};

const FileDnD = ({
  text,
  file,
  caseSensitive,
  highlightSearch,
  keywords,
  isDragging,
  connectDragSource,
  showCopyIcon
}) => {
  const opacity = isDragging ? 0.4 : 1;
  // Add ellipsis to FileName if has more than 35 characters
  let textToRender = text;
  if (text.length > 35) {
    textToRender = `${text.substr(0, 20)}... ${text.substr(text.length - 10, text.length)}`;
  }

  const dropEffect = showCopyIcon ? 'copy' : 'move';

  const ToolTipRender = (
    <div className="habla-lighter-text">
      <div>{text}</div>
    </div>
  );

  return (
    <Tooltip placement="top" title={ToolTipRender} overlayClassName="FileListView__results__tooltip">
      {connectDragSource(
        <a
          style={{ opacity, padding: '10px' }}
          className="FileListView__results__link"
          href={file.resourceUri}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={imageSrcFromFileExtension(file.fileExtension)}
            className="FileListView__results__fileIcon"
            alt=""
            width={32}
            height={32}
          />
          <Highlighter
            className="FileListView__results__fileName"
            highlightClassName="FileListView__results-highlighted"
            searchWords={highlightSearch ? keywords : []}
            textToHighlight={textToRender}
            caseSensitive={caseSensitive}
            autoEscape
          />
        </a>,
        { dropEffect }
      )}
    </Tooltip>
  );
};

FileDnD.propTypes = propTypes;
FileDnD.defaultProps = defaultProps;

export default DragSource(
  ItemTypes.FILE,
  {
    beginDrag: props => ({ file: props.file }),
    endDrag(props, monitor) {
      const item = monitor.getItem();

      const dropResult = monitor.getDropResult();
      if (dropResult) {
        const { conversationId } = dropResult;
        const text = `${item.file.fileName} - ${item.file.resourceUri}`;
        try {
          props.createMessage({
            conversationId: conversationId.id || conversationId,
            text
          });
        } catch (error) {
          message.error(error.message);
        }
      }
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(FileDnD);
