import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logoutUser } from '../../actions';

function mapStateToProps(state) {
  return {
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
