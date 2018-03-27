import { connect } from 'react-redux';
import SearchPage from '../../pages/SearchPage';
import { getCurrentUser } from '../../redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state)
  };
}

export default connect(mapStateToProps)(SearchPage);
