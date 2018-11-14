import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import classNames from 'classnames';
import moment from 'moment';

import String from 'src/translations';
import formatSize from 'src/lib/formatSize';
import imageSrcFromFileExtension from 'src/lib/imageFiles';
import { integrationKeyFromFile, integrationLabelFromKey, integrationImageFromKey } from 'src/utils/dataIntegrations';
import { AvatarWrapper, ResultsList } from 'src/components';

const PAGE_SIZE = 20;

const formatTime = date =>
  String.t('timeActivityGraph.displayTime', {
    displayDate: moment(date).format(String.t('timeActivityGraph.dateFormat')),
    displayTime: moment(date).format(String.t('timeActivityGraph.timeFormat'))
  });

const findUserByFile = (users, file) => users.find(({ userId }) => userId === file.fileOwnerId) || {};

const getColumns = (keywords, caseSensitive, owners) => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <a className="SearchPage__results__link" href={file.resourceUri} target="_blank" rel="noopener noreferrer">
        <img
          src={imageSrcFromFileExtension(file.fileExtension)}
          className="SearchPage__results__fileIcon"
          alt=""
          width={32}
          height={32}
        />
        <Highlighter
          className="SearchPage__results__fileName"
          highlightClassName="SearchPage__results-highlighted"
          searchWords={keywords}
          textToHighlight={text}
          caseSensitive={caseSensitive}
          autoEscape
        />
      </a>
    )
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    key: 'lastModified',
    sorter: (a, b) => moment(a.lastModified) - moment(b.lastModified),
    render: x => formatTime(x)
  },
  {
    title: 'Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: x => formatSize(x)
  },
  {
    title: 'Owner',
    dataIndex: 'fileOwnerId',
    key: 'fileOwnerId',
    sorter: (a, b) => {
      const nameA = findUserByFile(owners, a).fullName;
      const nameB = findUserByFile(owners, b).fullName;
      return nameA.localeCompare(nameB);
    },
    render: (text, file) => {
      const user = findUserByFile(owners, file);
      return (
        <div>
          <AvatarWrapper user={user} size="small" hideStatusTooltip />
          <span className="SearchPage__results__fileOwnerName">{user.fullName}</span>
        </div>
      );
    }
  },
  {
    title: 'Source',
    dataIndex: 'fileSource',
    key: 'fileSource',
    sorter: (a, b) => a.fileSource.localeCompare(b.fileSource),
    render: (text, file) => (
      <div>
        <div className="SearchPage__results__integrationIcon">
          <img src={integrationImageFromKey(integrationKeyFromFile(file))} width={26} height={26} alt="" />
        </div>
        <span className="SearchPage__results__integrationLabel">
          {integrationLabelFromKey(integrationKeyFromFile(file))}
        </span>
      </div>
    )
  }
];

class FileListView extends Component {
  state = { page: 1 };

  render() {
    const { files, keywords, caseSensitive, owners, loading } = this.props;
    const { page } = this.state;

    return (
      <div className="FileListView">
        <div className={classNames('SearchPage__results', { loading })}>
          <ResultsList
            columns={getColumns(keywords, caseSensitive, owners)}
            dataSource={files}
            loading={loading}
            rowKey="fileId"
            pagination={{
              className: 'hidden',
              pageSize: PAGE_SIZE,
              current: page
            }}
          />
        </div>
      </div>
    );
  }
}

FileListView.propTypes = {
  files: PropTypes.array,
  keywords: PropTypes.array,
  owners: PropTypes.array,
  caseSensitive: PropTypes.bool,
  loading: PropTypes.bool
};

FileListView.defaultProps = {
  files: [],
  keywords: [],
  owners: [],
  caseSensitive: false,
  loading: false
};

export default FileListView;
