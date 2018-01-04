import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { verifyEmailAccount } from '../../actions';
import String from '../../translations';

const propTypes = {
  verifyEmailAccount: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

class VerifyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = { verified: false };
  }

  componentDidMount() {
    const uuid = this.props.match.params.uuid;
    this.props.verifyEmailAccount(uuid)
      .then(() => this.setState({ verified: true }))
      .catch(err => console.error(err)); // eslint-disable-line no-console
  }

  render() {
    return (
      !this.state.verified ?
        <div className="padding-class-a habla-label">Loading ...</div> :
        <Row className="account-block align-center-class">
          <Col span="24">
            <div className="padding-class-b">
              <div className="habla-big-title habla-bold-text">{String.t('verifyAccount.successText')}</div>
            </div>
            <Link to="/createAccount" className="habla-button">{String.t('verifyAccount.continueLink')}</Link>
          </Col>
        </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    verifyEmailAccount: uuid => dispatch(verifyEmailAccount(uuid))
  };
}

VerifyAccount.propTypes = propTypes;

export default connect(null, mapDispatchToProps)(VerifyAccount);
