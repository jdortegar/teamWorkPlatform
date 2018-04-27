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
            <div className="flexClass breadcrumbLevels">
              <div className="habla-title-light">{String.t('dashboardPage.industryGraphsTitle')}</div>
              <i className="fas fa-angle-right" />
              <div className="habla-title">{String.t('dashboardPage.industryTitleManufacturing')}</div>
            </div>
          </div>
        </NewSubpageHeader>
        <div className="DashboardPage__reports-list habla-color-blue">
          <div className="DashboardPage__reports-list-content">
            {Object.entries(reports).map(([key, value]) => (
              <div className="DashboardPage__report-item">
                <div className="DashboardPage__report-item-content">
                  <Link className="habla-label" to={`/app/dashboard/${key}`}>
                    <i className="far fa-chart-bar mr-1" />
                    {String.t(value.breadcrumb)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
          <div className="flexClass breadcrumbLevels">
            <div className="habla-title-light">{String.t('dashboardPage.industryGraphsTitle')}</div>
            <i className="fas fa-angle-right" />
            <Link to={'/app/dashboard'} style={{ color: 'black' }}>
              <div className="habla-title-light">{String.t('dashboardPage.industryTitleManufacturing')}</div>
            </Link>
            <i className="fas fa-angle-right" />
            <div className="habla-title">{String.t(breadcrumb)}</div>
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
