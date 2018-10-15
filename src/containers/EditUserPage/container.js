import { connect } from 'react-redux';
import { getCurrentUser } from 'src/selectors';
import { toggleSideBar, updateUser } from 'src/actions';
import { EditUserPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    sideBarIsHidden: state.sideBar.hidden
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
