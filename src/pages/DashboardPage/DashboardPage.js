import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NewSubpageHeader, GraphViewSelector, LambWestonReports } from 'components';
import String from 'translations';
import './styles/style.css';

const reportComponents = {
  plantUptime: LambWestonReports.PlantUptimeByLineAndString,
  dailyPlantUptime: LambWestonReports.DailyPlantUptimeByLineAndString,
  plantUpMultipleComparisons: LambWestonReports.PlantUpMultipleComparisons,
  downtimeReasonLevelOne: LambWestonReports.DowntimeAndReasonsLevelOne,
  downtimeComparisonMultiplePlants: LambWestonReports.DowntimeComparisonMultiplePlants
};

class DashboardPage extends React.Component {
  renderReport = (reportId) => {
    const ReportComponent = reportComponents[reportId];
    if (!ReportComponent) return null;
    return (
      <div className="DashboardPage__reports">
        <ReportComponent />
      </div>
    );
  };

  renderReportsList() {
    return (
      <div className="DashboardPage__reports-list habla-color-blue">
        <div className="DashboardPage__reports-list-content">
          {Object.entries(this.props.reports).map(([key, value]) => (
            <div className="DashboardPage__report-item" key={key}>
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
    );
  }

  render() {
    const { currentSubscriberOrgId, selectedReport, reportId } = this.props;

    return (
      <div className="DashboardPage">
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <GraphViewSelector currentSubscriberOrgId={currentSubscriberOrgId} />
            <div className="flexClass breadcrumbLevels">
              <div className="habla-title-light responsiveHideClass">{String.t('dashboardPage.industryGraphsTitle')}</div>
              <i className="fas fa-angle-right responsiveHideClass" />
              {!selectedReport && <div className="habla-title">{String.t('dashboardPage.industryTitleManufacturing')}</div>}
              {selectedReport && (
                <div className="flexClass">
                  <Link to={'/app/dashboard'} style={{ color: 'black' }}>
                    <div className="habla-title-light responsiveHideClass">{String.t('dashboardPage.industryTitleManufacturing')}</div>
                  </Link>
                  <i className="fas fa-angle-right responsiveHideClass" />
                  <div className="habla-title">{String.t(selectedReport.breadcrumb)}</div>
                </div>
              )}
            </div>
          </div>
        </NewSubpageHeader>

        {!selectedReport && this.renderReportsList()}
        {selectedReport && this.renderReport(reportId)}
      </div>
    );
  }
}

DashboardPage.propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  reports: PropTypes.object.isRequired,
  reportId: PropTypes.string,
  selectedReport: PropTypes.shape({
    breadcrumb: PropTypes.string.isRequired
  })
};

DashboardPage.defaultProps = {
  reportId: null,
  selectedReport: null
};

export default DashboardPage;
