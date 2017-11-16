import React from 'react';
// import { Row, Col, Form, Button, notification, Tooltip } from 'antd';
import { Form } from 'antd';
// import PropTypes from 'prop-types';
// import SubpageHeader from '../../components/SubpageHeader';
// import SimpleCardContainer from '../../components/SimpleCardContainer';
// import UploadImageField from '../../components/formFields/UploadImageField';
// import TextField from '../../components/formFields/TextField';
// import SwitchField from '../../components/formFields/SwitchField';
// import UserIcon from '../../components/UserIcon';
// import { formShape } from '../../propTypes';
// import messages from './messages';
import './styles/style.css';

const propTypes = {
  // form: formShape.isRequired,
  // history: PropTypes.shape({
  //   push: PropTypes.func.isRequired
  // }).isRequired,
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     userId: PropTypes.string.isRequired
  //   }).isRequired
  // }).isRequired,
  // user: PropTypes.object.isRequired
};

const EditUserPage = () => {
  return (
    <h1>asdasdas</h1>
  );
};

// class EditUserPage extends Component {
//   render() {
//     return (
//       <div>
//         <h1>EDIT USER DETAILS!</h1>
//       </div>
//     );
//   }
// }

EditUserPage.propTypes = propTypes;

export default Form.create()(EditUserPage);
