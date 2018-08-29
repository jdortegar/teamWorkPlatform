import { connect } from 'react-redux';
import { SurveyModal } from 'components';
import { submitSurvey } from 'actions';
import { getCurrentUserFirstName, isSurveyVisible, isSubmittingSurvey } from 'selectors';

const mapStateToProps = state => ({
  userName: getCurrentUserFirstName(state),
  isSubmitting: isSubmittingSurvey(state),
  visible: isSurveyVisible(state)
});

const mapDispatchToProps = {
  submitSurvey
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyModal);
