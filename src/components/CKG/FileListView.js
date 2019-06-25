import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Pagination } from 'antd';
import moment from 'moment';

import String from 'src/translations';
import formatSize from 'src/lib/formatSize';
import { integrationKeyFromFile, integrationLabelFromKey, integrationImageFromKey } from 'src/utils/dataIntegrations';
import { ResultsList } from 'src/components';
import { AvatarWrapper, MessageText } from 'src/containers';
import FileDnD from './FileDnD';

const PAGE_SIZE = 16;

const propTypes = {
  files: PropTypes.array,
  keywords: PropTypes.array,
  owners: PropTypes.array,
  caseSensitive: PropTypes.bool,
  loading: PropTypes.bool,
  highlightSearch: PropTypes.bool,
  createMessage: PropTypes.func.isRequired,
  attachedFilesMode: PropTypes.bool,
  globalSearch: PropTypes.bool,
  teams: PropTypes.array,
  users: PropTypes.array,
  orgName: PropTypes.string.isRequired,
  conversationsById: PropTypes.object,
  messages: PropTypes.object
};

const defaultProps = {
  files: [],
  keywords: [],
  owners: [],
  caseSensitive: false,
  loading: false,
  highlightSearch: true,
  attachedFilesMode: false,
  globalSearch: false,
  teams: [],
  users: [],
  conversationsById: {},
  messages: {}
};

const formatTime = date =>
  String.t('timeActivityGraph.displayTime', {
    displayDate: moment(date).format(String.t('timeActivityGraph.dateFormat')),
    displayTime: moment(date).format(String.t('timeActivityGraph.timeFormat'))
  });

const findUserByFile = (users, file) => users.find(({ userId }) => userId === file.fileOwnerId) || {};

const getColumns = (keywords, caseSensitive, owners, highlightSearch, createMessage) => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <FileDnD
        keywords={keywords}
        text={text}
        file={file}
        highlightSearch={highlightSearch}
        caseSensitive={caseSensitive}
        showCopyIcon
        createMessage={createMessage}
      />
    )
  },
  {
    title: 'File Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    className: 'widthMax20',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: x => formatSize(x)
  },
  {
    title: 'File Type',
    dataIndex: 'fileExtension',
    key: 'fileExtension',
    className: 'widthMax20',
    sorter: (a, b) => {
      if (a && a.fileExtension) {
        return a.fileExtension.localeCompare(b.fileExtension);
      }
      return null;
    },
    render: text => <span className="FileListView__results__fileType">{text}</span>
  },
  {
    title: 'Created Time',
    dataIndex: 'fileCreatedAt',
    key: 'fileCreatedAt',
    sorter: (a, b) => moment(a.fileCreatedAt) - moment(b.fileCreatedAt),
    render: x => formatTime(x)
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
    render: text => <span>{text}</span>
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

const getGlobalSearchColumns = (keywords, caseSensitive, owners, highlightSearch, createMessage, teams, orgName) => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <FileDnD
        keywords={keywords}
        text={text}
        file={file}
        highlightSearch={highlightSearch}
        caseSensitive={caseSensitive}
        showCopyIcon
        createMessage={createMessage}
      />
    )
  },
  {
    title: 'Project Team',
    dataIndex: 'teamId',
    key: 'teamId',
    sorter: (a, b) => a.fileSize - b.fileSize,
    render: teamId => {
      const teamData = teams.find(team => team.teamId === teamId);
      return <span>{teamData ? teamData.name : `${orgName} - Org`}</span>;
    }
  },
  {
    title: 'File Size',
    dataIndex: 'fileSize',
    key: 'fileSize',
    className: 'widthMax20',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: x => formatSize(x)
  },
  {
    title: 'File Type',
    dataIndex: 'fileExtension',
    key: 'fileExtension',
    className: 'widthMax20',
    sorter: (a, b) => {
      if (a && a.fileExtension) {
        return a.fileExtension.localeCompare(b.fileExtension);
      }
      return null;
    },
    render: text => <span className="FileListView__results__fileType">{text}</span>
  },
  {
    title: 'Created Time',
    dataIndex: 'fileCreatedAt',
    key: 'fileCreatedAt',
    sorter: (a, b) => moment(a.fileCreatedAt) - moment(b.fileCreatedAt),
    render: x => formatTime(x)
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
    render: text => <span>{text}</span>
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

const getAttachedFilesColumns = (
  keywords,
  caseSensitive,
  owners,
  highlightSearch,
  createMessage,
  conversationsById,
  teams,
  users,
  messages
) => [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    render: (text, file) => (
      <FileDnD
        keywords={keywords}
        text={text}
        file={file}
        highlightSearch={highlightSearch}
        caseSensitive={caseSensitive}
        showCopyIcon
        createMessage={createMessage}
      />
    )
  },
  {
    title: 'Chat ID',
    dataIndex: 'cid',
    key: 'cid',
    sorter: (a, b) => {
      const nameA = users.find(userEl => userEl.userId === a.fileOwnerId).fullName;
      const nameB = users.find(userEl => userEl.userId === b.fileOwnerId).fullName;
      return nameA.localeCompare(nameB);
    },
    render: (cid, file) => {
      const fileOwner = users.find(userEl => userEl.userId === file.fileOwnerId);
      return (
        <div>
          <span className="AttachedFile__title">{conversationsById[cid].description}</span>
          <div className="AttachedFile__content">
            <AvatarWrapper size="small" user={fileOwner} />
            <div className="AttachedFile__body">
              <span className="AttachedFile__owner">
                {fileOwner.fullName} - {moment(file.fileCreatedAt).format('YYYY-MM-DD HH:mm')}
              </span>
              <span className="AttachedFile__excerpt">
                {messages[file.messageId] ? <MessageText text={messages[file.messageId].content[0].text} /> : ''}
              </span>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: 'File Type',
    dataIndex: 'fileType',
    key: 'fileType',
    className: 'widthMax20',
    sorter: (a, b) => {
      if (a && a.fileType) {
        return a.fileType.localeCompare(b.fileType);
      }
      return null;
    },
    render: text => <span className="FileListView__results__fileType">{text}</span>
  },
  {
    title: 'Created Time',
    dataIndex: 'fileCreatedAt',
    key: 'fileCreatedAt',
    sorter: (a, b) => moment(a.fileCreatedAt) - moment(b.fileCreatedAt),
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
      const userEl = findUserByFile(owners, file);
      return (
        <div>
          <AvatarWrapper user={userEl} size="small" hideStatusTooltip />
          <span className="FileListView__results__fileOwnerName">{userEl.fullName}</span>
        </div>
      );
    }
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
    const {
      files,
      keywords,
      caseSensitive,
      owners,
      loading,
      highlightSearch,
      createMessage,
      attachedFilesMode,
      globalSearch,
      teams,
      orgName,
      conversationsById,
      users,
      messages
    } = this.props;
    const { page } = this.state;
    const paginationVisible = !loading && files.length > PAGE_SIZE;

    let columns = getColumns(keywords, caseSensitive, owners, highlightSearch, createMessage);

    if (attachedFilesMode) {
      columns = getAttachedFilesColumns(
        keywords,
        caseSensitive,
        owners,
        highlightSearch,
        createMessage,
        conversationsById,
        teams,
        users,
        messages
      );
    } else if (globalSearch) {
      columns = getGlobalSearchColumns(keywords, caseSensitive, owners, highlightSearch, createMessage, teams, orgName);
    }

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
            columns={columns}
            dataSource={files}
            loading={loading}
            rowKey="fileKey"
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

FileListView.propTypes = propTypes;
FileListView.defaultProps = defaultProps;

export default FileListView;
