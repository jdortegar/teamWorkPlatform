import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, DatePicker } from 'antd';

import String from 'src/translations';
import { PageHeader, Button, Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  fetchSurveys: PropTypes.func.isRequired,
  createSurvey: PropTypes.func.isRequired,
  survey: PropTypes.object,
  isFetching: PropTypes.bool,
  isCreating: PropTypes.bool
};

const defaultProps = {
  survey: null,
  isFetching: false,
  isCreating: false
};

const disableDate = current => current && current < moment().subtract(1, 'day');

class SurveySettingsPage extends Component {
  state = { startDate: null, endDate: null };

  componentDidMount() {
    this.props.fetchSurveys();
  }

  handleSelection = selected => {
    this.setState({ startDate: selected, endDate: selected ? moment(selected).add(30, 'days') : null });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { survey, createSurvey } = this.props;
    const { startDate, endDate } = this.state;

    if (!survey) {
      createSurvey({ startDate, endDate });
    }
  };

  render() {
    const { endDate } = this.state;
    const { survey = {}, isFetching, isCreating } = this.props;

    if (isFetching) return <Spinner />;

    return (
      <div className="SurveySettingsPage">
        <PageHeader pageBreadCrumb={{ routes: [{ title: String.t('surveySettingsPage.title') }] }} settingsIcon />
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <div className="SurveySettingsPage__fields">
            <Form.Item label={String.t('surveySettingsPage.startDateLabel')}>
              <DatePicker
                defaultValue={survey ? survey.startDate : null}
                className="SurveySettingsPage__datePicker"
                showTime={{ format: 'HH:mm' }}
                format="ddd, MMM DD, Y - HH:mm"
                disabledDate={disableDate}
                placeholder=""
                onChange={this.handleSelection}
                onOk={this.handleSelection}
              />
            </Form.Item>
            <Form.Item label={String.t('surveySettingsPage.endDateLabel')}>
              <DatePicker
                defaultValue={survey ? survey.endDate : null}
                className="SurveySettingsPage__datePicker"
                value={endDate}
                showTime={{ format: 'HH:mm' }}
                format="ddd, MMM DD, Y - HH:mm"
                placeholder=""
                disabled
              />
            </Form.Item>
          </div>
          <div className="SurveySettingsPage__buttons margin-top-class-b">
            <Button type="default" fitText className="margin-right-class-a" onClick={() => this.props.history.goBack()}>
              {String.t('Buttons.cancel')}
            </Button>
            <Button type="primary" fitText onClick={this.handleSubmit} loading={isCreating} disabled={!endDate}>
              {String.t('surveySettingsPage.saveButton')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

SurveySettingsPage.propTypes = propTypes;
SurveySettingsPage.defaultProps = defaultProps;

export default SurveySettingsPage;
