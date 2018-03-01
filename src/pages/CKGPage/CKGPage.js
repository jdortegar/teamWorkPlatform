import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Menu, Tooltip, Dropdown } from 'antd';
import * as d3 from 'd3';
import String from '../../translations';

import { NewSubpageHeader, TimeActivityGraph } from '../../components';
import imageSrcFromFileExtension from '../../lib/imageFiles';
import './styles/style.css';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const buildTime = dateTime => moment().startOf('day').set({
  hour: dateTime.hour(),
  minute: dateTime.minutes(),
  second: dateTime.seconds()
});

const buildDataObject = (file) => {
  const dateTime = moment(file.lastModified);
  return {
    ...file,
    date: dateTime,
    time: buildTime(dateTime),
    color: color(file.fileExtension)
  };
};

const propTypes = {
  currentSubscriberOrgId: PropTypes.string,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  timeActivities: PropTypes.object
};

const defaultProps = {
  currentSubscriberOrgId: null,
  timeActivities: null
};

class CKGPage extends Component {
  state = {
    excludeFilter: {}
  };

  componentDidMount() {
    const { currentSubscriberOrgId, fetchTimeActivitiesBySubscriberOrgId } = this.props;
    if (currentSubscriberOrgId) {
      fetchTimeActivitiesBySubscriberOrgId(currentSubscriberOrgId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentSubscriberOrgId, fetchTimeActivitiesBySubscriberOrgId } = this.props;
    if (currentSubscriberOrgId !== nextProps.currentSubscriberOrgId) {
      fetchTimeActivitiesBySubscriberOrgId(nextProps.currentSubscriberOrgId);
    }
  }

  render() {
    const { timeActivities } = this.props;
    if (!timeActivities) return null;
    const { files, fileTypes } = this.props.timeActivities;
    if (!files || !fileTypes || !fileTypes.files) return null;
    const { labels } = fileTypes;
    const other = String.t('ckgPage.filterTypeOther');
    const filesFiltered = files.filter((file) => {
      const label = file.fileExtension || other;
      return !this.state.excludeFilter[label];
    });

    const activitySelectorMenu = (
      <Menu className="activitySelectorMenu">
        <div className="habla-label padding-class-a">{String.t('ckgPage.activityLabel')}</div>
        <Menu.Item key="activitySelectorMenu">
          <a><span><i className="fas fa-tasks" /> {String.t('ckgPage.allActivity')}</span></a>
        </Menu.Item>
        <Menu.Item key="activitySelectorMenu">
          <a><span><i className="fas fa-eye" /> {String.t('ckgPage.viewsActivity')}</span></a>
        </Menu.Item>
        <Menu.Item key="activitySelectorMenu" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-share" /> {String.t('ckgPage.sharesActivity')}</span></a>
        </Menu.Item>
      </Menu>
    );

    const dateSelectorMenu = (
      <Menu className="dateSelectorMenu">
        <div className="habla-label padding-class-a">{String.t('ckgPage.dateLabel')}</div>
        <Menu.Item key="dateSelectorMenu">
          <a><span>Add calendar selector here</span></a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="CKGPage">
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <i className="fas fa-chart-area fa-2x" />
            <div className="habla-title">{String.t('ckgPage.title')}</div>
          </div>
        </NewSubpageHeader>

        <div className="ckg-tools-container">
          <div className="habla-ckg-tools">
            <div className="habla-ckg-tools-bar habla-ckg-activity-selector">
              <Dropdown overlay={activitySelectorMenu} trigger={['click']}>
                <a className="no-border">
                  <i className="fas fa-tasks" />
                  <span className="ckg-activity-label">All Activity</span>
                  <i className="fas fa-angle-down" />
                </a>
              </Dropdown>
            </div>

            <div className="habla-ckg-tools-bar habla-ckg-actions-selector">
              <Tooltip placement="bottom" title="Zoom In" arrowPointAtCenter>
                <a><i className="fas fa-search-plus" /></a>
              </Tooltip>
              <Tooltip placement="bottom" title="Zoom Out" arrowPointAtCenter>
                <a><i className="fas fa-search-minus" /></a>
              </Tooltip>
              <Tooltip placement="bottom" title="View All" arrowPointAtCenter>
                <a className="no-border"><i className="fa fa-expand" /></a>
              </Tooltip>
            </div>
          </div>

          <div className="habla-ckg-date-picker">
            <div className="habla-ckg-date-picker-content">
              <Dropdown overlay={dateSelectorMenu} trigger={['click']}>
                <a>
                  <span className="habla-ckg-date-picker-content-text">Aug 9, 2017 - Aug 17, 2017</span>
                  <span className="habla-ckg-date-picker-content-icon"><i className="fa fa-calendar" /></span>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>

        <TimeActivityGraph files={filesFiltered.map(buildDataObject)} />

        <div className="bottomBar">
          <div className="bottomBar-selectors">
            <div className="bottomBar-selectors-content padding-class-a">
              <div className="team-select-container">
                <select className="team-select">
                  <option>All</option>
                  <option>Team 1</option>
                  <option>Team with a very long text in the select item</option>
                </select>
              </div>
              <div className="team-room-select-container">
                <select className="team-room-select">
                  <option>Lobby</option>
                  <option>Team Room 1</option>
                  <option>Team Room with a very long name in the select item</option>
                </select>
              </div>
              <div className="clear" />
            </div>
          </div>
          <div className="bottomBar-files-filter">
            <div className="bottomBar-files-filter-content">
              <div className="filetype-label habla-label">
                <span className="filetype-label-number-badge">33</span> File Types
              </div>
              {
                labels.map(({ key, label, fileExtension, count }) => {
                  const btnClass = this.state.excludeFilter[key] ? 'fileTypeButton fileTypeButtonGrayed' : 'fileTypeButton';
                  return (
                    <div key={key} className="fileTypeContainer">
                      <Tooltip placement="top" title={String.t('ckgPage.filterCount', { count, label })}>
                        <div
                          className={btnClass}
                          onClick={() => {
                            const excludeFilter = { ...this.state.excludeFilter };
                            excludeFilter[key] = (excludeFilter[key] ? null : true);
                            this.setState({ excludeFilter });
                          }}
                          onDoubleClick={() => {
                            const excludeFilter = {};
                            const keys = Object.keys(this.state.excludeFilter);
                            if (keys.length < labels.length) {
                              labels.forEach((file) => { excludeFilter[file.key] = true; });
                            }
                            this.setState({ excludeFilter });
                          }}
                        >
                          <img src={imageSrcFromFileExtension(fileExtension)} width={32} height={32} alt="" className="img" />
                          <div className="fileTypeLabel">
                            {label}
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="clear" />
        </div>
      </div>
    );
  }
}

CKGPage.propTypes = propTypes;
CKGPage.defaultProps = defaultProps;

export default CKGPage;
