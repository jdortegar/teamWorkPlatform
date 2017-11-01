import React, { Component } from 'react';
import { Row, Col, Form, Button, notification, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import SwitchField from '../../components/formFields/SwitchField';
import UserIcon from '../../components/UserIcon';
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
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateTeam: PropTypes.func.isRequired
};

class EditTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.props.updateTeam(values, teamId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}`);
            notification.open({
              message: messages.success,
              description: messages.teamUpdated,
              duration: 4
            });
          })
          .catch((requestErr) => {
            console.error(requestErr);
          });
      }
    });
  }

  render() {
    const { teamId } = this.props.match.params;
    const { teams, subscriberOrgById } = this.props;
    const team = teams.teamById[teamId];
    const teamIcon = `data:image/png;base64,${team.icon}`;
    const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];

    return (
      <div>
        <SubpageHeader
          icon={<UserIcon user={team} type="team" clickable={false} />}
          breadcrumb={
            <div>
              <Link to={`/app/organization/${subscriberOrg.subscriberOrgId}`}>
                <span className="breadcrumb_underline">{subscriberOrg.name}</span>
              </Link> / {team.name} (Edit)
            </div>
          }
        />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 5 }}>
                <div className="Edit-team__icon-container">
                  <UploadImageField text={messages.changeAvatar} image={teamIcon} />
                  <div className="Edit-team__switch-container">
                    <Tooltip placement="top" title={team.active ? messages.setInactive : messages.setActive}>
                      <SwitchField
                        checkedChildren={messages.active}
                        unCheckedChildren={messages.inactive}
                        form={this.props.form}
                        componentKey="active"
                        initialValue={team.active}
                        valuePropName="checked"
                      />
                    </Tooltip>
                  </div>
                </div>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 16 }}>
                <div className="Edit-team__container">
                  <h1 className="Edit-team__title">{messages.teamName}</h1>
                  <TextField
                    componentKey="name"
                    initialValue={team.name}
                    inputClassName="Edit-team__add-textfield"
                    form={this.props.form}
                    hasFeedback={false}
                    label=""
                    required
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    className="Edit-team__button New-team__button--margin-right"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                  >
                    { messages.save }
                  </Button>
                  <Button
                    type="primary"
                    className="Edit-team__button"
                    onClick={() => this.props.history.push(`/app/team/${teamId}`)}
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

EditTeamPage.propTypes = propTypes;

export default Form.create()(EditTeamPage);
