import { connect } from 'react-redux';
import EditUserPage from '../../pages/EditUserPage';
import { toggleSideBar, updateUser } from '../../actions';
import { getCurrentUser } from '../../redux-hablaai/selectors';

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
