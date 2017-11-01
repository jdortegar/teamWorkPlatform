import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import PropTypes from 'prop-types';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  createTeam: PropTypes.func.isRequired
};

class NewTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.props.createTeam(values, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}`);
          });
      }
    });
  }

  render() {
    const { subscriberOrgId } = this.props.match.params;
    const renderAvatarInput = (text) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 5 }} md={{ span: 5 }}>
          <UploadImageField text={text} />
        </Col>
      );
    };

    return (
      <div>
        <SubpageHeader breadcrumb="Team" />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              { renderAvatarInput('Upload Avatar') }
              <Col xs={{ span: 24 }} sm={{ span: 17 }} md={{ span: 16 }}>
                <div className="New-team__container">
                  <h1 className="New-team__title">{messages.chooseTeamName}</h1>
                  <TextField
                    componentKey="name"
                    inputClassName="New-team__add-textfield"
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder=" "
                    label=""
                    required
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    className="New-team__button New-team__button--margin-right"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                  >
                    { messages.createNewTeam }
                  </Button>
                  <Button
                    type="primary"
                    className="New-team__button"
                    onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
                  >
                    { messages.cancel }
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

NewTeamPage.propTypes = propTypes;

export default Form.create()(NewTeamPage);
