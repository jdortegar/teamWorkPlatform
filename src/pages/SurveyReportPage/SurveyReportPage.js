import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { map, pick } from 'lodash';
import { Tabs, Collapse, List, Icon, Tooltip } from 'antd';

import String from 'src/translations';
import { integrationImageFromLabel } from 'src/utils/dataIntegrations';
import { PageHeader, Spinner, AvatarWithLabel } from 'src/components';
import './styles/style.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const propTypes = {
  fetchSurveyAnswers: PropTypes.func.isRequired,
  report: PropTypes.object,
  isFetching: PropTypes.bool
};

const defaultProps = {
  report: [],
  isFetching: false
};

// const PANELS = ['hours-spent', 'tools', 'preferences'];
const PANELS = ['numberOfAnswers', 'hoursSpent', 'tools', 'preference'];

class SurveyReportPage extends Component {
  state = { openPanels: [] };

  componentDidMount() {
    this.props.fetchSurveyAnswers();
  }

  handleTogglePanel = openPanels => {
    this.setState({ openPanels });
  };

  renderQuestionHeader = (key, data) => {
    const { openPanels } = this.state;
    const isActive = openPanels.includes(key);

    return (
      <div>
        <h5 className="SurveyReportPage__question">{String.t(`SurveyReportPage.questions.${key}`)}</h5>
        <div className={classNames('SurveyReportPage__main', { active: isActive })}>
          <span className="SurveyReportPage__mainAnswer">
            {String.t(`SurveyReportPage.mainAnswer.${key}`, { answer: data.mainAnswer })}
          </span>
          <span className={classNames('SurveyReportPage__collapseControl', { active: isActive })}>
            {isActive ? 'Collapse full report' : 'See full report'}
            <Icon className="SurveyReportPage__arrowIcon" type="right" rotate={isActive ? 90 : 0} />
          </span>
        </div>
      </div>
    );
  };

  renderAnswer = (key, answer) => {
    if (!answer) return null;

    if (key === 'tools') {
      return (
        <div className="SurveyReportPage__integrationIcons">
          {answer.map(item => (
            <Tooltip key={item} placement="top" title={item}>
              <div className="SurveyReportPage__integrationIcon">
                <img src={integrationImageFromLabel(item)} width={26} height={26} alt="" />
              </div>
            </Tooltip>
          ))}
        </div>
      );
    }

    return <div className="SurveyReportPage__answer">{answer.join(', ')}</div>;
  };

  renderResult = (data, key) =>
    data.mainAnswer && (
      <Panel
        className="SurveyReportPage__panel"
        header={this.renderQuestionHeader(key, data)}
        key={key}
        showArrow={false}
      >
        {data.summary && (
          <div className="SurveyReportPage__summary">
            {String.t('SurveyReportPage.summary')} {map(data.summary, (count, name) => `${count} ${name}`).join(' · ')}
          </div>
        )}
        <List
          size="small"
          className="SurveyReportPage__list"
          itemLayout="horizontal"
          dataSource={data.answers}
          renderItem={item => (
            <List.Item className="SurveyReportPage__listItem">
              <AvatarWithLabel item={item.user} enabled />
              {this.renderAnswer(key, item.answer)}
            </List.Item>
          )}
        />
      </Panel>
    );

  renderReport = (results, date) => (
    <TabPane tab={moment(date).format('ll')} key={date}>
      <Collapse className="SurveyReportPage__results" onChange={this.handleTogglePanel} bordered={false}>
        {map(pick(results, PANELS), this.renderResult)}
      </Collapse>
    </TabPane>
  );

  render() {
    const { isFetching, report } = this.props;

    if (isFetching) return <Spinner />;

    return (
      <div className="SurveyReportPage">
        <PageHeader pageBreadCrumb={{ routes: [{ title: String.t('SurveyReportPage.title') }] }} settingsIcon />
        <div className="SurveyReportPage__container">
          <Tabs onChange={this.handleTabClick} className="SurveyReportPage__tabs">
            {map(report, this.renderReport)}
          </Tabs>
        </div>
      </div>
    );
  }
}

SurveyReportPage.propTypes = propTypes;
SurveyReportPage.defaultProps = defaultProps;

export default SurveyReportPage;
