import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from "redux-form";
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import { FormTextField, FormSelectField } from '../../components/formFields';
import { toggleInviteDialog, inviteUser } from '../../actions';
import './styles/style.css';

class InviteDialog extends Component {
  constructor(props) {
    super(props);

    this.addInvitees = this.addInvitees.bind(this);
    this.removeInvitees = this.removeInvitees.bind(this);
    this.state = { invitees: 1 }
  }

  onSubmit(form) {
    //this.props.registerUser({ email });
    const result = Object.keys(form).reduce((obj, key) => {
      if (key !== "orgs") {
        obj[key] = form[key];
      }
      return obj;
    }, {});
    const users = _.values(result);
    console.log(this);
    this.props.inviteUser(users, form.orgs);
  }

  addInvitees() {
    if(this.state.invitees < 5) {
      this.setState({ invitees: this.state.invitees + 1 });
    }
  }

  removeInvitees() {
    if(this.state.invitees > 1) {
      this.setState({ invitees: this.state.invitees - 1 });
    }
  }

  renderOrgs() {
    return this.props.subscriberOrgs.map(({ name, subscriberOrgId }) => {
      return (
        <MenuItem key={subscriberOrgId} value={subscriberOrgId} primaryText={name} />
      );
    });
  }

  renderChildren() {
    const children = [];

    for (let i = 0; i < this.state.invitees; i++) {
      children.push(
        <div className="row">
          <div className="col-xs-7">
            <Field name={`email${i}`} hintText="jsmith@example.com" label="Email" fullWidth component={FormTextField} />
          </div>
          <div className="col-xs-4">
            <Field label="Organization" name="orgs" fullWidth component={FormSelectField}>
              {this.renderOrgs()}
            </Field>
          </div>
          <div className="col-xs-1" style={{ display: 'flex', alignItems: 'center' }}>
          {
            this.state.invitees > 1 ?
            <a className="remove-invitees" onClick={this.removeInvitees}>
              <FontIcon className="material-icons" style={{ top: '5px' }}>clear</FontIcon>
            </a> :
            null
          }
          </div>
        </div>
      );
    }

    return children;
  }

  render() {
    const { handleSubmit } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.toggleInviteDialog.bind(this, false)}
      />,
      <FlatButton
        label="Submit"
        type="submit"
        primary={true}
        onTouchTap={handleSubmit(this.onSubmit.bind(this))}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={true}
          open={this.props.showInviteDialog}
        >
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="col-xs-12">
              <h1 className="text-center display-4">Invite New People</h1>
              {this.renderChildren()}
              <div className="row" style={{ marginTop: '16px' }}>
                <div className="col-xs-12">
                  <a className="add-invitees" onClick={this.addInvitees}>
                    <FontIcon className="material-icons" style={{ marginRight: '6px', top: '5px' }}>add_circle</FontIcon>
                    Add Another
                  </a>
                </div>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showInviteDialog: state.dialogs.showInviteDialog,
    subscriberOrgs: state.subscriberOrgs.data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleInviteDialog,
    inviteUser
  }, dispatch);
}

export default reduxForm({
  form: 'inviteDialog'
})(connect(mapStateToProps, mapDispatchToProps)(InviteDialog));
