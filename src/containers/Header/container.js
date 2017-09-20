import { connect } from 'react-redux';
import Header from '../../components/Header';
import { logoutUser } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(null, mapDispatchToProps)(Header);
