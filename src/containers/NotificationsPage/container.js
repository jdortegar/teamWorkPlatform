import { connect } from 'react-redux';
import { toggleSideBar } from 'src/actions';
import { getCurrentUser } from 'src/selectors';
import { NotificationsPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    sideBarIsHidden: state.sideBar.hidden
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSideBar: () => dispatch(toggleSideBar())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPage);
