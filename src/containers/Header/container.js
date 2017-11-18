import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logoutUser } from '../../actions';
import { getCurrentUser } from '../../redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
