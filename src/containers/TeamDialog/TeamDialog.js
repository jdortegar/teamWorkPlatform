import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from "redux-form";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { FormTextField, FormSelectField } from '../../components/formFields';
import { toggleTeamDialog } from '../../actions';

class TeamDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { open: true }
  }

  onSubmit({ email }) {
    //this.props.registerUser({ email });
    console.log(email);
  }

  renderOrgs() {
    return this.props.subscriberOrgs.map(({ name, subscriberOrgId }) => {
      return (
        <MenuItem key={subscriberOrgId} value={subscriberOrgId} primaryText={name} />
      );
    });
  }

  render() {
    const { handleSubmit } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.toggleTeamDialog.bind(this, false)}
      />,
      <FlatButton
        label="Submit"
        type="submit"
        primary={true}
        onTouchTap={handleSubmit(this.onSubmit)}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={true}
          open={this.props.showTeamDialog}
        >
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="col-xs-12">
              <h1 className="text-center display-4">Invite New People</h1>
              <div className="row">
                <div className="col-xs-8">
                  <Field name="email" hintText="jsmith@example.com" label="Email" fullWidth component={FormTextField} />
                </div>
                <div className="col-xs-4">
                <Field label="Organization" name="orgs" fullWidth component={FormSelectField}>
                  {this.renderOrgs()}
                </Field>
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
    showTeamDialog: state.dialogs.showTeamDialog,
    subscriberOrgs: state.subscriberOrgs.data,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleTeamDialog
  }, dispatch);
}

export default reduxForm({
  form: 'teamDialog'
})(connect(mapStateToProps, mapDispatchToProps)(TeamDialog));
