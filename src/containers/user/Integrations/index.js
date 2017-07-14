import React, { Component } from 'react';
import { object, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { integrateBox, integrateGoogle, requestIntegrations, requestSubpageData } from '../../../actions';
import Spinner from '../../../components/Spinner';
import styles from './styles.scss';

class Integrations extends Component {
  static propTypes = {
    match: object.isRequired,
    requestIntegrations: func.isRequired,
    isFetching: bool,
    integrations: object,
    integrateGoogle: func.isRequired,
    integrateBox: func.isRequired,
    subpageData: object,
    requestSubpageData: func.isRequired,
  };

  static defaultProps = {
    isFetching: true,
    integrations: {},
    subpageData: {}
  };

  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestIntegrations(subscriberOrgId);
    this.props.requestSubpageData();
  }

  handleGoogleDrive() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateGoogle(subscriberOrgId);
  }

  handleBox() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.integrateBox(subscriberOrgId);
  }

  content = () => {
    if (this.props.isFetching) {
      return <Spinner />;
    }
    const { integrations } = this.props.integrations;
    const integrationsForOrg = integrations; // TODO:

    return (
      <div>
        <section>
          <div className="row">
            <div className="col-md-12">
              <div className="header">
                <h1> Integrations </h1>
              </div>
              <div className="center">
                <img onClick={() => this.handleGoogleDrive()} src="https://c1.staticflickr.com/5/4240/35080287162_0d6aef000a_o.png" style={{ width: '200px', height: '200px' }} />
                <br />
                <img onClick={() => this.handleBox()} src="https://c1.staticflickr.com/5/4220/34858435850_3ff5486f73_o.png" style={{ width: '200px', height: '200px' }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  render() {
    return (
      <div>{this.content()}</div>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.integrationsReducer.isFetching,
  subpageData: state.subpageReducer.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestIntegrations,
  requestSubpageData,
  integrateBox,
  integrateGoogle
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);

