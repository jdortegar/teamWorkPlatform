import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import { verifyConfirmationCode } from 'src/actions';
import { Button } from 'src/components';

const propTypes = {
  verifyConfirmationCode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
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
    const { uuid } = this.props.match.params;
    this.props
      .verifyConfirmationCode(uuid)
      .then(() => this.setState({ verified: true }))
      .catch(() => this.props.history.replace('/app'));
  }

  render() {
    return !this.state.verified ? (
      <div className="padding-class-a habla-label">Loading ...</div>
    ) : (
      <Row className="account-block align-center-class">
        <Col span="24">
          <div className="padding-class-b">
            <i className="fas fa-check-circle fa-3x habla-green mb-1" />
            <div className="habla-big-title habla-bold-text">{String.t('verifyAccount.successText')}</div>
            <div className="margin-top-class-a">
              <Link to="/createAccount">
                <Button type="main" fitText>
                  {String.t('Buttons.createAccount')}
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    verifyConfirmationCode: uuid => dispatch(verifyConfirmationCode(uuid))
  };
}

VerifyAccount.propTypes = propTypes;

export default connect(
  null,
  mapDispatchToProps
)(VerifyAccount);
