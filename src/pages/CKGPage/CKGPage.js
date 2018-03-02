import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Menu, Tooltip, Dropdown } from 'antd';
import * as d3 from 'd3';
import String from '../../translations';
import {
  integrationLabelFromKey,
  integrationFromResourceUri,
  integrationImageFromKey
} from '../../utils/dataIntegrations';

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
  currentSubscriberOrgId: PropTypes.string.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  timeActivities: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

const defaultProps = {
  timeActivities: null
};

class CKGPage extends Component {
  state = {
    excludeTypesFilter: {},
    excludeIntegrationsFilter: {}
  };

  componentDidMount() {
    const { fetchTimeActivitiesBySubscriberOrgId, currentSubscriberOrgId } = this.props;
    const { subscriberOrgId } = this.props.match.params;
    fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId);
    if (currentSubscriberOrgId !== subscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }
  }

  render() {
    const { timeActivities } = this.props;
    if (!timeActivities) return null;
    const { files, fileTypes } = this.props.timeActivities;
    if (!files || !fileTypes || !fileTypes.files) return null;
    const { labels, integrations } = fileTypes;
    const other = String.t('ckgPage.filterTypeOther');
    const { excludeTypesFilter, excludeIntegrationsFilter } = this.state;
    const filesFiltered = files.filter(({ fileExtension, resourceUri }) => {
      const label = fileExtension || other;
      const key = integrationFromResourceUri(resourceUri);
      return !excludeTypesFilter[label] && !excludeIntegrationsFilter[key];
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
              {Object.keys(integrations).map((integration) => {
                const { key, count } = integrations[integration];
                const btnClass = this.state.excludeIntegrationsFilter[key] ? 'fileTypeButton fileTypeButtonGrayed' : 'fileTypeButton';
                const label = integrationLabelFromKey(key);
                return (
                  <div key={key} className="fileTypeContainer mr-05">
                    <Tooltip placement="top" title={String.t('ckgPage.integrationFileCount', { count, label })}>
                      <div
                        className={btnClass}
                        onClick={() => {
                          const newExcludeIntegrationsFilter = { ...this.state.excludeIntegrationsFilter };
                          newExcludeIntegrationsFilter[key] = (newExcludeIntegrationsFilter[key] ? null : true);
                          this.setState({ excludeIntegrationsFilter: newExcludeIntegrationsFilter });
                        }}
                      >
                        <img src={integrationImageFromKey(key)} width={32} height={32} alt="" className="img" />
                        <div className="fileTypeLabel">
                          {label}
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                );
              })
              }
              <div className="filetype-label habla-label ml-05">
                {(labels.length > 0) && (
                  <span className="filetype-label-number-badge">
                    {labels.length}
                  </span>)
                }
                {String.t('ckgPage.filterTypes', { count: labels.length })}
              </div>
              {
                labels.map(({ key, label, fileExtension, count }) => {
                  const btnClass = this.state.excludeTypesFilter[key] ? 'fileTypeButton fileTypeButtonGrayed' : 'fileTypeButton';
                  return (
                    <div key={key} className="fileTypeContainer">
                      <Tooltip placement="top" title={String.t('ckgPage.filterCount', { count, label })}>
                        <div
                          className={btnClass}
                          onClick={() => {
                            const newExcludeTypesFilter = { ...this.state.excludeTypesFilter };
                            newExcludeTypesFilter[key] = (newExcludeTypesFilter[key] ? null : true);
                            this.setState({ excludeTypesFilter: newExcludeTypesFilter });
                          }}
                          onDoubleClick={() => {
                            const newExcludeTypesFilter = {};
                            const keys = Object.keys(this.state.excludeTypesFilter);
                            if (keys.length < labels.length) {
                              labels.forEach((file) => { newExcludeTypesFilter[file.key] = true; });
                            }
                            this.setState({ excludeTypesFilter: newExcludeTypesFilter });
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
