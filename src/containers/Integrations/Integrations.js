import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IntegrationCard from '../../components/IntegrationCard';
import { integrateBox, integrateGoogle, requestIntegrations } from '../../actions';
import './styles/style.css';

const propTypes = {
  match: object.isRequired,
  requestIntegrations: func.isRequired,
  integrations: object.isRequired,
  integrateGoogle: func.isRequired,
  integrateBox: func.isRequired
}

class Integrations extends Component {
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
    const { google, box } = integrations;
    const googleIntegrated = (google) ? true : false;
    const googleExpired = (google) ? google.expired : undefined;
    const boxIntegrated = (box) ? true : false;
    const boxExpired = (box) ? box.expired : undefined;

    return (
      <div>
        <h1 style={{ textAlign: 'center' }}> Integrations </h1>
        <Row style={{ marginTop: '30px' }} type="flex" justify="space-around">
          <Col className="gutter-row" span={5}>
            <IntegrationCard
              name="Google Drive"
              img="https://c1.staticflickr.com/5/4240/35080287162_0d6aef000a_o.png"
              integrated={googleIntegrated}
              expired={googleExpired}
              handleIntegration={() => this.handleGoogleDrive()}
            />
          </Col>
          <Col className="gutter-row" span={5}>
            <IntegrationCard
              name="Box"
              img="https://c1.staticflickr.com/5/4220/34858435850_3ff5486f73_o.png"
              integrated={boxIntegrated}
              expired={boxExpired}
              handleIntegration={() => this.handleBox()}
            />
          </Col>
        </Row>
      </div>
      // <div style={{ marginLeft: '320px' }}>
      //   <section>
      //     <div className="row">
      //       <div className="col-md-12">
      //         <div className="header">
      //
      //         </div>
      //         <div className="center">
      //           <div>Google Drive</div>
      //           <br />
      //           <a onClick={() => this.handleBox()}><img alt="Box" src="" style={{ width: '200px', height: '200px' }} /></a>
      //           <div>Box{(boxIntegrated) ? ' Integrated' : ''}{(boxExpired) ? ' (Expired)' : ''}</div>
      //         </div>
      //       </div>
      //     </div>
      //   </section>
      // </div>
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

Integrations.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
