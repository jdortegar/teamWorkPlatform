import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { NewSubpageHeader, GraphViewSelector, LambWestonReports } from 'components';
import String from 'translations';
import './styles/style.css';

const reports = {
  dailyPlantUptime: {
    breadcrumb: 'dashboardPage.dailyPlantUptimeBreadcrumb',
    ReportComponent: LambWestonReports.DailyPlantUptimeByLineAndString
  },
  downtimeReasonLevel1: {
    breadcrumb: 'dashboardPage.downtimeReasonsLevel1Breadcrumb',
    ReportComponent: LambWestonReports.DowntimeAndReasonsLevelOne
  }
};

const DashboardPage = ({ currentSubscriberOrgId, match }) => {
  const { reportId } = match.params;
  const report = reports[reportId];

  if (!report) {
    return (
      <div className="DashboardPage">
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <GraphViewSelector currentSubscriberOrgId={currentSubscriberOrgId} />
            <div className="habla-title">
              {String.t('dashboardPage.breadcrumb')}
            </div>
          </div>
        </NewSubpageHeader>
        <div className="DashboardPage__reports-list">
          <h1 className="habla-title">Reports</h1>
          <ul>
            {Object.entries(reports).map(([key, value]) => (
              <li className="DashboardPage__report-link">
                <Link to={`/app/dashboard/${key}`}>{String.t(value.breadcrumb)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const { ReportComponent, breadcrumb } = report;
  return (
    <div className="DashboardPage">
      <NewSubpageHeader>
        <div className="habla-main-content-header-title">
          <GraphViewSelector currentSubscriberOrgId={currentSubscriberOrgId} />
          <Link to={'/app/dashboard'} style={{ color: 'black' }}>
            {String.t('dashboardPage.breadcrumb')}
          </Link>
          <span className="breadcrumbs-separator">
            <i className="fas fa-angle-right" />
          </span>
          <div className="habla-title">
            {String.t(breadcrumb)}
          </div>
        </div>
      </NewSubpageHeader>

      <div className="DashboardPage__reports">
        {<ReportComponent />}
      </div>
    </div>
  );
};

DashboardPage.propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string,
      status: PropTypes.string
    })
  }).isRequired
};

export default DashboardPage;
