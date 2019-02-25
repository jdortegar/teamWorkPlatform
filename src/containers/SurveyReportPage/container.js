import { connect } from 'react-redux';
import { fetchSurveyAnswers } from 'src/actions';
import { getSurveyAnswers, getSurveyReport, isFetchingSurveys } from 'src/selectors';
import { SurveyReportPage } from 'src/pages';

const mapStateToProps = state => ({
  surveyAnswers: getSurveyAnswers(state),
  report: getSurveyReport(state),
  isFetching: isFetchingSurveys(state)
});

const mapDispatchToProps = {
  fetchSurveyAnswers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyReportPage);
