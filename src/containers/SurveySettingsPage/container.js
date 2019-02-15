import { connect } from 'react-redux';
import { fetchSurveys, createSurvey } from 'src/actions';
import { getLastSurvey, isFetchingSurveys, isCreatingSurvey } from 'src/selectors';
import { SurveySettingsPage } from 'src/pages';

const mapStateToProps = state => ({
  survey: getLastSurvey(state),
  isFetching: isFetchingSurveys(state),
  isCreating: isCreatingSurvey(state)
});

const mapDispatchToProps = { fetchSurveys, createSurvey };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveySettingsPage);
