import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { PageHeader, SimpleCardContainer, AvatarWrapper, Spinner, Button } from 'src/components';
import { Form, message, Tooltip, Switch, Select } from 'antd';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const { Option } = Select;
const FormItem = Form.Item;

const renderOptions = () => {
  const roleOptions = ['Administrator', 'User'];
  return roleOptions.map(option => (
    <Option key={option} value={option}>
      {option}
    </Option>
  ));
};

class EditTeamMemberPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      switchStatus: this.props.user.enabled
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeSwitch = this.onChangeSwitch.bind(this);
  }

  onChangeSwitch(checked) {
    this.setState({
      switchStatus: checked
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { userId } = this.props.user;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const valuesToSend = { ...values };
        this.props
          .updateUser(valuesToSend, userId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.goBack();
            message.success(String.t('OrganizationManageMembers.userUpdated'));
          })
          .catch(error => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { user } = this.props;
    const { switchStatus } = this.state;

    const { getFieldDecorator } = this.props.form;

    if (!user) {
      return <Spinner />;
    }

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('editTeamMemberPage.title')
        }
      ]
    };

    return (
      <div className="EditTeamMemberPage-main">
        <PageHeader pageBreadCrumb={pageBreadCrumb} settingsIcon />
        <SimpleCardContainer className="subpage-block padding-class-b border-bottom-light">
          <AvatarWrapper size="large" user={user} hideStatusTooltip />
          <div className="EditTeamMember__name">
            <span className="habla-bold-text habla-black">{user.fullName}</span>
            <span className="EditTeamMember__mail">{user.email}</span>
          </div>
        </SimpleCardContainer>
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-b EditTeamMember__formContainer">
              <div className="Edit-team__container">
                <h1 className="Edit-team__title">{String.t('editTeamMemberPage.teamMemberRole')}</h1>
                <FormItem>
                  {getFieldDecorator('role', { initialValue: user.role || 'User' })(
                    <Select size="large">{renderOptions()}</Select>
                  )}
                </FormItem>
              </div>
              <div className="EditTeamMember__icon-container">
                <div className="EditTeamMember__switch-container">
                  <h1 className="Edit-team__title">{String.t('active')}</h1>
                  <Tooltip
                    placement="top"
                    title={
                      user.enabled
                        ? String.t('OrganizationManageTeams.setInactive')
                        : String.t('OrganizationManageTeams.setActive')
                    }
                  >
                    <FormItem>
                      {getFieldDecorator('active', { initialValue: this.state.switchStatus })(
                        <Switch
                          checkedChildren={String.t('OrganizationManageTeams.activeState')}
                          unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
                          checked={switchStatus}
                          onChange={this.onChangeSwitch}
                        />
                      )}
                    </FormItem>
                  </Tooltip>
                </div>
              </div>
              {/* <div className="Edit-team__Actions">
                <span>{String.t('editTeamMemberPage.resetPassword')}</span>
                <Divider type="vertical" />
                <span className="habla-red">{String.t('editTeamMemberPage.deleteTeamMember')}</span>
              </div> */}
            </div>
            <div className="edit-org__buttons border-top-lighter">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.goBack()}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="main" fitText onClick={this.handleSubmit} loading={this.state.loading}>
                {String.t('Buttons.save')}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

EditTeamMemberPage.propTypes = propTypes;

export default Form.create()(EditTeamMemberPage);
