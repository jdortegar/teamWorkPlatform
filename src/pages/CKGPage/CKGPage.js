import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'antd';
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

    return (
      <div>
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <i className="fas fa-chart-area fa-2x" />
            <div className="habla-title">{String.t('ckgPage.title')}</div>
          </div>
        </NewSubpageHeader>
        <TimeActivityGraph files={filesFiltered.map(buildDataObject)} />
        <div className="bottomBar">
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
    );
  }
}

CKGPage.propTypes = propTypes;
CKGPage.defaultProps = defaultProps;

export default CKGPage;
