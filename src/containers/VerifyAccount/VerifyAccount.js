import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { verifyEmailAccount } from '../../actions';
import './styles/style.css';

const propTypes = {
  verifyEmailAccount: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

class VerifyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = { verified: false };
  }

  componentDidMount() {
    const uuid = this.props.match.params.uuid;
    this.props.verifyEmailAccount(uuid)
      .then(() => this.setState({ verified: true }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      !this.state.verified ?
        <div>Loading</div> :
        <Row className="account-block">
          <Col span="24">
            <h2>Your email has been verified!</h2>
            <h3><Link to="/createAccount">Click here to create your account</Link></h3>
          </Col>
        </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    verifyEmailAccount: uuid => dispatch(verifyEmailAccount(uuid)),
  };
}

VerifyAccount.propTypes = propTypes;

export default connect(null, mapDispatchToProps)(VerifyAccount);