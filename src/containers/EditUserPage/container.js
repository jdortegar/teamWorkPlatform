import { connect } from 'react-redux';
import EditUserPage from '../../pages/EditUserPage';
import { toggleSideBar, updateUser } from '../../actions';

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    sideBarIsHidden: state.sideBar.hidden
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSideBar: () => dispatch(toggleSideBar()),
    updateUser: data => dispatch(updateUser(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserPage);
