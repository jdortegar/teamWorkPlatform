import { connect } from 'react-redux';
import { getCurrentUser, getUserByUserId } from 'src/selectors';
import { toggleSideBar, updateUser } from 'src/actions';
import { EditUserPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    sideBarIsHidden: state.sideBar.hidden,
    currentUser: getCurrentUser(state),
    users: getUserByUserId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSideBar: () => dispatch(toggleSideBar()),
    updateUser: data => dispatch(updateUser(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserPage);
