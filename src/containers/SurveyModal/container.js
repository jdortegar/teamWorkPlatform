import { connect } from 'react-redux';
import { submitSurvey } from 'src/actions';
import { SurveyModal } from 'src/components';
import {
  getActiveSurvey,
  getCurrentUserFirstName,
  isSurveyVisible,
  getSurveyType,
  isSubmittingSurvey
} from 'src/selectors';

const mapStateToProps = state => ({
  survey: getActiveSurvey(state),
  userName: getCurrentUserFirstName(state),
  isSubmitting: isSubmittingSurvey(state),
  visible: isSurveyVisible(state),
  surveyType: getSurveyType(state)
});

const mapDispatchToProps = {
  submitSurvey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyModal);
