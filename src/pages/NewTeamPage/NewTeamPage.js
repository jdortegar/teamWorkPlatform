import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired
}

class NewTeamPage extends Component {
  render() {
    const { subscriberOrgId } = this.props.match.params;
    const renderAvatarInput = (text) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
          <UploadImageField text={text} />
        </Col>
      );
    };

    return (
      <div>
        <SubpageHeader breadcrumb="Team Member" />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              { renderAvatarInput('Upload Avatar') }
              <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 16 }}>
                <div className="New-team__container">
                  <h1 className="New-team__title">Choose a Team Name</h1>
                  <TextField
                    componentKey="teamName"
                    inputClassName="New-team__add-textfield"
                    form={this.props.form}
                    hasFeedback={false}
                    placeholder=" "
                    label=""
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    className="New-team__button New-team__button--margin-right"
                  >
                    Create New Team
                  </Button>
                  <Button
                    type="primary"
                    className="New-team__button"
                    onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
                  >
                    Cancel
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
