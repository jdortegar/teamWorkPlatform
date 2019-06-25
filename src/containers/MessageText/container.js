import { connect } from 'react-redux';
import { getUserByUserId } from 'src/selectors';
import { MessageText } from 'src/components';

const mapStateToProps = state => {
  const usersObj = getUserByUserId(state);
  return {
    users: Object.values(usersObj)
  };
};

export default connect(mapStateToProps)(MessageText);
