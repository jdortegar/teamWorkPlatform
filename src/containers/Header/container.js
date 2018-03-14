import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logoutUser, updateUser } from '../../actions';
import { getCurrentUser } from '../../redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
    updateUser: data => dispatch(updateUser(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
