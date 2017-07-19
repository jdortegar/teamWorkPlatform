import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from "redux-form";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import { FormTextField, FormSelectField } from '../../components/formFields';
import { toggleOrgDialog, createSubscriberOrg } from '../../actions';

class OrgDialog extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit({ name }) {
    this.props.createSubscriberOrg({ name });
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
    let actions = [];

    if(this.props.submittingOrgForm) {
      actions = [
        <FlatButton
          label="Cancel"
          onTouchTap={this.props.toggleOrgDialog.bind(this, false)}
        />,
        <CircularProgress style={{ marginRight: '10px'}} />
      ];
    } else {
      actions = [
        <FlatButton
          label="Cancel"
          onTouchTap={this.props.toggleOrgDialog.bind(this, false)}
        />,
        <FlatButton
          label="Submit"
          type="submit"
          primary={true}
          onTouchTap={handleSubmit(this.onSubmit.bind(this))}
        />,
      ];
    }

    return (
      <div>
        <Dialog
          actions={actions}
          modal={true}
          open={this.props.showOrgDialog}
        >
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="col-xs-12">
              <h1 className="text-center display-4">Create New Organization</h1>
              <div className="row">
                <div className="col-xs-12">
                  <Field name="name" label="Organization Name" fullWidth component={FormTextField} />
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
    showOrgDialog: state.dialogs.showOrgDialog,
    submittingOrgForm: state.subscriberOrgs.submittingOrgForm
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleOrgDialog,
    createSubscriberOrg
  }, dispatch);
}

export default reduxForm({
  form: 'orgDialog'
})(connect(mapStateToProps, mapDispatchToProps)(OrgDialog));
