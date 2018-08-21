import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { setNewPassword } from '../../actions';
import SetNewPassword from '../../layouts/SetNewPassword';

function mapDispatchToProps(dispatch) {
  return {
    setNewPassword: (rid, password) => dispatch(setNewPassword(rid, password))
  };
}

export default Form.create()(
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )(SetNewPassword)
  )
);
