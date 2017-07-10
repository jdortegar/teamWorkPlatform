import React, { Component } from 'react';
import { object, bool, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestSubpageData } from '../../../actions';
import Spinner from '../../../components/Spinner';
import styles from './styles.scss';

class Integrations extends Component {
  static propTypes = {
    subscriberOrgId: string,
    subpageData: object,
    requestSubpageData: func.isRequired,
    isFetching: bool
  };

  static defaultProps = {
    subpageData: {},
    isFetching: true
  };

  componentDidMount() {
    //this.props.getIntegrations();
    const { subscriberOrgId } = this.props.match.params;
    this.props.requestSubpageData();
  }

  handleGoogleDrive() {
    console.log('AD: handleGoogleDrive()');
  }

  handleBox() {
    console.log('AD: handleBox()');
  }

  content = () => {
    if (this.props.isFetching) {
      return <Spinner />;
    }
    // TODO: remove return <Subpage data={this.props.subpageData} meta={meta} />;

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
  isFetching: state.subpageReducer.isFetching,
  subpageData: state.subpageReducer.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestSubpageData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);

