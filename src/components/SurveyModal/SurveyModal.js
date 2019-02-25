import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Select, message } from 'antd';
import { map, isEmpty } from 'lodash';

import String from 'src/translations';
import { Button } from 'src/components';

const { Option } = Select;

const propTypes = {
  survey: PropTypes.object,
  submitSurvey: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  surveyType: PropTypes.string
};

const defaultProps = {
  survey: null,
  visible: false,
  isSubmitting: false,
  surveyType: 'first'
};

const TOTAL_STEPS = 3;
const QUESTIONS = [
  { name: 'hours-spent', step: 1, mode: 'default' },
  { name: 'tools', step: 2, mode: 'tags' },
  { name: 'preference', step: 3, mode: 'tags' }
];

class SurveyModal extends Component {
  state = {
    currentStep: 1,
    answers: {}
  };

  handleNext = () => {
    if (this.state.currentStep >= TOTAL_STEPS) return;
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  handleSubmit = () => {
    const { survey, submitSurvey } = this.props;
    const answers = survey.questions.map(({ id, question }) => ({
      questionId: id,
      answer: this.state.answers[question]
    }));

    submitSurvey(survey.id, answers)
      .then(() => message.success(String.t('surveys.messages.success')))
      .catch(() => message.error(String.t('surveys.messages.error')));
  };

  handleSelect = (question, values) => {
    this.setState({ answers: { ...this.state.answers, [question]: [...values] } });
  };

  renderQuestion = (name, mode = 'default') => {
    const { survey, surveyType } = this.props;
    const { question, options } = survey.questions.find(q => q.question === name);
    if (!question) return null;

    return (
      <div key={question} className="surveyContent padding-class-b habla-color-lightergrey">
        <p className="habla-bold-text">{String.t(`surveys.${surveyType}.${question}.title`)}</p>
        <div className="surveyAnswer mt-1">
          <Select
            onChange={value => this.handleSelect(question, value)}
            placeholder={String.t(`surveys.${surveyType}.${question}.select`)}
            style={{ minWidth: 250 }}
            mode={mode}
          >
            {options.map(option => (
              <Option key={option}>{option}</Option>
            ))}
          </Select>
        </div>
      </div>
    );
  };

  renderFooterButton() {
    const { currentStep, answers } = this.state;
    const { isSubmitting } = this.props;
    const lastStep = currentStep === TOTAL_STEPS;
    const buttonText = lastStep
      ? String.t('surveys.finish')
      : String.t('surveys.next', { current: currentStep, total: TOTAL_STEPS });
    const handleSubmit = lastStep ? this.handleSubmit : this.handleNext;
    const step = QUESTIONS.find(q => q.step === currentStep);
    const noAnswers = isEmpty(answers[step.name]);

    return (
      <Button
        key="submit"
        type="primary"
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
    const { survey } = this.props;
    if (!survey) return null;

    const { currentStep } = this.state;
    const { userName, visible } = this.props;

    return (
      <div className="hablaModalSurvey">
        <Modal visible={visible} centered closable={false} footer={[this.renderFooterButton()]}>
          <div className="align-center-class">
            <div className="surveyHeeader padding-class-b">
              <p className="habla-title">{String.t('surveys.title', { name: userName })}</p>
              <p className="habla-title-light">{String.t('surveys.description')}</p>
            </div>
            {map(QUESTIONS, item => currentStep === item.step && this.renderQuestion(item.name, item.mode))}
          </div>
        </Modal>
      </div>
    );
  }
}

SurveyModal.propTypes = propTypes;
SurveyModal.defaultProps = defaultProps;

export default SurveyModal;
