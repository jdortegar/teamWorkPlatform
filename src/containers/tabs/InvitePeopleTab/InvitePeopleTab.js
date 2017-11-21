import React, { Component } from 'react';
import { Col, Row, Form } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EmailField from '../../../components/formFields/EmailField';
import { formShape } from '../../../propTypes';
import String from '../../../translations';

const propTypes = {
  form: formShape.isRequired,
  layout: PropTypes.object
};

const defaultProps = {
  layout: {
    labelCol: { xs: 24 },
    wrapperCol: { xs: 24 }
  }
};

class InvitePeopleTab extends Component {
  render() {
    const { layout } = this.props;

    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>{String.t('inviteTeamMembersTitle')}</h1>
        <Form onSubmit={this.handleSubmit} layout="vertical" style={{ marginTop: '30px' }}>
          <Row gutter={16}>
            <Col className="gutter-row" span={20}>
              <EmailField
                form={this.props.form}
                layout={layout}
                required
              />
            </Col>
            <Col className="gutter-row" span={3}>
              X
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

InvitePeopleTab.propTypes = propTypes;
InvitePeopleTab.defaultProps = defaultProps;

export default Form.create()(connect(null, null)(InvitePeopleTab));
