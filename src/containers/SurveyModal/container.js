import { connect } from 'react-redux';
import { submitSurvey } from 'src/actions';
import { SurveyModal } from 'src/components';
import { getCurrentUserFirstName, isSurveyVisible, isFirstSurvey, isSubmittingSurvey } from 'src/selectors';

const mapStateToProps = state => ({
  userName: getCurrentUserFirstName(state),
  isSubmitting: isSubmittingSurvey(state),
  visible: isSurveyVisible(state),
  isFirstSurvey: isFirstSurvey(state)
});

const mapDispatchToProps = {
  submitSurvey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyModal);
