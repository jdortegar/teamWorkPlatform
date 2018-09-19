import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, message } from 'antd';
import { range } from 'lodash';

import String from 'src/translations';
import { availableIntegrationKeys, integrationLabelFromKey } from 'src/utils/dataIntegrations';
import { Button } from '../common';

const { Option } = Select;

class SurveyModal extends Component {
  state = {
    currentStep: 1,
    answers: {
      step1: [],
      step2: [],
      step3: []
    }
  };

  handleNext = () => {
    if (this.state.currentStep >= 3) return;
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  handleSubmit = () => {
    this.props
      .submitSurvey(Object.values(this.state.answers))
      .then(() => message.success('Thanks for your feedback. Welcome to Habla AI.'))
      .catch(() => message.error('Sorry, something went wrong.'));
  };

  handleStep1Select = value => {
    this.setState({ answers: { ...this.state.answers, step1: [value] } });
  };

  handleStep2Select = values => {
    this.setState({ answers: { ...this.state.answers, step2: values } });
  };

  handleStep3Select = values => {
    this.setState({ answers: { ...this.state.answers, step3: values } });
  };

  renderStep1 = surveyType => (
    <div className="surveyContent padding-class-b habla-color-lightergrey">
      <p className="habla-bold-text">{String.t(`surveys.${surveyType}.question-1.title`)}</p>
      <div className="surveyAnswer mt-1">
        <Select
          onChange={this.handleStep1Select}
          placeholder={String.t(`surveys.${surveyType}.question-1.select`)}
          style={{ minWidth: 200 }}
        >
          {range(1, 9).map((value, index, array) => {
            const option = index === array.length - 1 ? `${value}+` : value;
            return <Option key={option}>{option}</Option>;
          })}
        </Select>
      </div>
    </div>
  );

  renderStep2 = surveyType => (
    <div className="surveyContent padding-class-b habla-color-lightergrey">
      <p className="habla-bold-text">{String.t(`surveys.${surveyType}.question-2.title`)}</p>
      <div className="surveyAnswer mt-1">
        <Select
          onChange={this.handleStep2Select}
          mode="tags"
          placeholder={String.t(`surveys.${surveyType}.question-2.select`)}
          style={{ minWidth: 250 }}
        >
          {availableIntegrationKeys().map(key => (
            <Option key={integrationLabelFromKey(key)}>{integrationLabelFromKey(key)}</Option>
          ))}
        </Select>
      </div>
    </div>
  );

  renderStep3 = surveyType => (
    <div className="surveyContent padding-class-b habla-color-lightergrey">
      <p className="habla-bold-text">{String.t(`surveys.${surveyType}.question-3.title`)}</p>
      <div className="surveyAnswer mt-1">
        <Select
          onChange={this.handleStep3Select}
          mode="tags"
          placeholder={String.t(`surveys.${surveyType}.question-3.select`)}
          style={{ minWidth: 250 }}
        >
          {[
            'Closing the books faster',
            'Selling more in my job',
            'Taking care of higher priorities',
            'Developing more products',
            'Creating better products and GTM',
            'Surfing Huntington Beach Southside Pier or the Internet'
          ].map(key => (
            <Option key={key}>{key}</Option>
          ))}
        </Select>
      </div>
    </div>
  );

  renderFooterButton() {
    const { currentStep, answers } = this.state;
    const { isSubmitting } = this.props;
    const lastStep = currentStep === 3;
    const buttonText = lastStep
      ? String.t('surveys.finish')
      : String.t('surveys.next', { current: currentStep, total: 3 });
    const handleSubmit = lastStep ? this.handleSubmit : this.handleNext;
    const noAnswers = answers[`step${currentStep}`].length === 0;

    return (
      <Button
        key="submit"
        type="main"
        onClick={handleSubmit}
        className="habla-button align-center-class"
        loading={isSubmitting}
        disabled={noAnswers}
      >
        {buttonText}
      </Button>
    );
  }

  render() {
    const { currentStep } = this.state;
    const { userName, visible, isFirstSurvey } = this.props;
    const surveyType = isFirstSurvey ? 'first' : 'recurrent';

    return (
      <div className="hablaModalSurvey">
        <Modal visible={visible} centered closable={false} footer={[this.renderFooterButton()]}>
          <div className="align-center-class">
            <div className="surveyHeeader padding-class-b">
              <p className="habla-title">{String.t('surveys.title', { name: userName })}</p>
              <p className="habla-title-light">{String.t('surveys.description')}</p>
            </div>
            {currentStep === 1 && this.renderStep1(surveyType)}
            {currentStep === 2 && this.renderStep2(surveyType)}
            {currentStep === 3 && this.renderStep3(surveyType)}
          </div>
        </Modal>
      </div>
    );
  }
}

SurveyModal.propTypes = {
  submitSurvey: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isFirstSurvey: PropTypes.bool
};

SurveyModal.defaultProps = {
  visible: false,
  isSubmitting: false,
  isFirstSurvey: true
};

export default SurveyModal;
