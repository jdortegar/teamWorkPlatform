import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import String from '../../translations';

import { NewSubpageHeader, TimeActivityGraph } from '../../components';
import imageSrcFromFile from '../../lib/imageFiles';
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
    if (!files || !fileTypes) return null;

    const other = String.t('ckgPage.filterTypeOther');
    const filesFiltered = files.filter((file) => {
      const label = file.fileType || other;
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
            fileTypes.map((file) => {
              const label = file.fileType || other;
              const btnClass = this.state.excludeFilter[label] ? 'fileTypeButton fileTypeButtonGrayed' : 'fileTypeButton';
              return (
                <div
                  key={file.fileExtension}
                  className="fileTypeContainer"
                >
                  <div
                    className={btnClass}
                    onClick={() => {
                      const excludeFilter = { ...this.state.excludeFilter };
                      excludeFilter[label] = (excludeFilter[label] ? null : true);
                      this.setState({ excludeFilter });
                    }}
                  >
                    <img
                      src={imageSrcFromFile(file)}
                      width={32}
                      height={32}
                      alt=""
                      className="img"
                    />
                    <div className="fileTypeLabel">
                      {label}
                    </div>
                  </div>
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
