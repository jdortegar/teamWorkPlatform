import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { integrateBox, integrateGoogle, requestIntegrations } from '../../actions';
import './styles/integrations.css';

class Integrations extends Component {
  static propTypes = {
    match: object.isRequired,
    requestIntegrations: func.isRequired,
    integrations: object.isRequired,
    integrateGoogle: func.isRequired,
    integrateBox: func.isRequired
  };

  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestIntegrations(subscriberOrgId);
  }

  handleGoogleDrive() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateGoogle(subscriberOrgId);
  }

  handleBox() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateBox(subscriberOrgId);
  }

  render() {
    const { integrationsBySubscriberOrgId, received, requesting, error } = this.props.integrations;

    if (error) {
      console.error(error);
      return (
        <div>Request for Integrations failed.</div>
      );
    }

    if ((received === false) || (requesting === true)) {
      return null;
    }

    const { subscriberOrgId } = this.props.match.params;
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || [];
    // TODO: using data, see which ones are integrated, not integrated, and expired.
    // Expired only makes sense if integrated = true.
    // Render accordingly.
    console.log(`AD: data=${JSON.stringify(data)}`);
    let googleIntegrated = false;
    let googleExpired = false;
    let boxIntegrated = false;
    let boxExpired = false;
    integrations.forEach((org) => {
      if (org.subscriberOrgId === subscriberOrgId) {
        if (org.google) {
          googleIntegrated = true;
          googleExpired = org.google.expired || false;
        }
        if (org.box) {
          boxIntegrated = true;
          boxExpired = org.box.expired || false;
        }
      }
    });

    return (
      <div style={{ marginLeft: '320px' }}>
        <section>
          <div className="row">
            <div className="col-md-12">
              <div className="header">
                <h1> Integrations </h1>
              </div>
              <div className="center">
                <a onClick={() => this.handleGoogleDrive()}><img alt="Google" src="https://c1.staticflickr.com/5/4240/35080287162_0d6aef000a_o.png" style={{ width: '200px', height: '200px' }} /></a>
                <br />
                <a onClick={() => this.handleBox()}><img alt="Box" src="https://c1.staticflickr.com/5/4220/34858435850_3ff5486f73_o.png" style={{ width: '200px', height: '200px' }} /></a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  integrations: state.integrations
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestIntegrations,
  integrateBox,
  integrateGoogle
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
