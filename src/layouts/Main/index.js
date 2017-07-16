import React, { Component } from 'react';
import { arrayOf, func, object } from 'prop-types';
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { requestSubscriberOrgs, setCurrentSubscriberOrg } from '../../actions';
import Logout from '../../components/Logout/Logout';
import Spinner from '../../components/Spinner';
import Header from '../../containers/Header';
import HomeContainer from '../../containers/Home';
import Integrations from '../../containers/user/Integrations';
import SubpageContainer from '../../containers/Subpage';
import { routesPaths } from '../../routes';
import styles from './styles.scss';

class Main extends Component {
  static propTypes = {
    // TODO: match: object.isRequired, If route info is needed, use this.  Remove if not.
    user: object.isRequired,
    subscriberOrgs: arrayOf(object).isRequired,
    currentSubscriberOrg: object,
    requestSubscriberOrgs: func.isRequired,
    setCurrentSubscriberOrg: func.isRequired
  };

  static defaultProps = {
    currentSubscriberOrg: null
  };

  componentDidMount() {
    if (this.props.subscriberOrgs.length === 0) {
      this.props.requestSubscriberOrgs();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.currentSubscriberOrg === null) && (nextProps.subscriberOrgs.length > 0)) {
      // Default current subscriber org to first of list.
      this.props.setCurrentSubscriberOrg(this.props.subscriberOrgs[0]);
    }
  }

  content = () => {
    return (
      <div styleName="main">
        <Header />
        <Switch>
          <Route exact path={routesPaths.home} component={HomeContainer} />
          <Route exact path={routesPaths.integrations} component={Integrations} />
          <Route exact path={routesPaths.subpage} component={SubpageContainer} />
          <Route exact path={routesPaths.logout} component={Logout} />
          <Route path="*" render={props => <Redirect to={{ pathname: '/', state: { from: props.location } }} />} />
        </Switch>
      </div>
    );
  }

  render() {
    const { user, subscriberOrgs, currentSubscriberOrg } = this.props;
    if ((user === null) || (subscriberOrgs.length === 0) || (currentSubscriberOrg === null)) {
      return <Spinner />;
    }
    return this.content();
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  subscriberOrgs: state.subscriberOrgs.data,
  currentSubscriberOrg: state.subscriberOrgs.currentSubscriberOrg
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestSubscriberOrgs,
  setCurrentSubscriberOrg
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(cssModules(Main, styles, { allowMultiple: true }));
