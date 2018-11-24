import { connect } from 'react-redux';
import { updateUser } from 'src/actions';
import { getUserById } from 'src/selectors';
import { EditTeamMemberPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { userId } = props.match.params;
  return {
    user: getUserById(state, userId)
  };
};

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeamMemberPage);
