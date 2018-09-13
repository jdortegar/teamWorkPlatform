import { connect } from 'react-redux';
import NotificationsPage from '../../pages/NotificationsPage';
import { toggleSideBar } from '../../actions';
import { getCurrentUser } from '../../redux-hablaai/selectors';

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
