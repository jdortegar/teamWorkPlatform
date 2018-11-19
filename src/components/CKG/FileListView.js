import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import classNames from 'classnames';
import { Pagination } from 'antd';
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
      <a className="FileListView__results__link" href={file.resourceUri} target="_blank" rel="noopener noreferrer">
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
          searchWords={keywords}
          textToHighlight={text}
          caseSensitive={caseSensitive}
          autoEscape
        />
      </a>
    )
  },
  {
    title: 'File Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: x => formatSize(x)
  },
  {
    title: 'File Type',
    dataIndex: 'fileExtension',
    key: 'fileExtension',
    sorter: (a, b) => a.fileExtension.localeCompare(b.fileExtension),
    render: text => <span className="FileListView__results__fileType">{text}</span>
  },
  {
    title: 'Modified Time',
    dataIndex: 'lastModified',
    key: 'lastModified',
    sorter: (a, b) => moment(a.lastModified) - moment(b.lastModified),
    render: x => formatTime(x)
  },
  {
    title: 'Habla AI User',
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
          <span className="FileListView__results__fileOwnerName">{user.fullName}</span>
        </div>
      );
    }
  },
  {
    title: 'File Owner',
    dataIndex: 'fileOwnerName',
    key: 'fileOwnerName',
    sorter: (a, b) => a.fileOwnerName.localeCompare(b.fileOwnerName),
    render: text => <span className="FileListView__results__fileOwnerName">{text}</span>
  },
  {
    title: 'Data Source',
    dataIndex: 'fileSource',
    key: 'fileSource',
    sorter: (a, b) => a.fileSource.localeCompare(b.fileSource),
    render: (text, file) => (
      <div>
        <div className="FileListView__results__integrationIcon">
          <img src={integrationImageFromKey(integrationKeyFromFile(file))} width={26} height={26} alt="" />
        </div>
        <span className="FileListView__results__integrationLabel">
          {integrationLabelFromKey(integrationKeyFromFile(file))}
        </span>
      </div>
    )
  }
];

class FileListView extends Component {
  state = { page: 1 };

  handlePageChange = page => {
    this.setState({ page });
  };

  renderPaginationItem = (page, type, originalElement) => {
    if (type === 'prev' || type === 'next') {
      return (
        <a className="ant-pagination-item-link">
          <i
            className={classNames('fas', {
              'fa-arrow-left': type === 'prev',
              'fa-arrow-right': type === 'next'
            })}
          />
        </a>
      );
    }
    return originalElement;
  };

  render() {
    const { files, keywords, caseSensitive, owners, loading } = this.props;
    const { page } = this.state;
    const paginationVisible = !loading && files.length > PAGE_SIZE;

    return (
      <div className="FileListView">
        <div className={classNames('FileListView__results', { loading })}>
          {paginationVisible && (
            <div className="pagination-container">
              <Pagination
                size="small"
                current={page}
                total={files.length}
                pageSize={PAGE_SIZE}
                hideOnSinglePage
                onChange={this.handlePageChange}
                itemRender={this.renderPaginationItem}
              />
            </div>
          )}

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
