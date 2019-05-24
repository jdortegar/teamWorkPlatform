import { connect } from 'react-redux';
import { getCurrentUser, getUserById } from 'src/selectors';
import { updateUser } from 'src/actions';
import { EditUserPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { userId } = props.match.params;
  const user = getUserById(state, userId);
  const currentUser = getCurrentUser(state);

  return { user: user || currentUser };
};

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserPage);
