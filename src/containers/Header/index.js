import React, { Component } from 'react';
import { AppBar } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { arrayOf, func, object } from 'prop-types';
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setCurrentSubscriberOrg, logoutUser } from '../../actions';
import styles from './styles.scss';

class Header extends Component {
  static propTypes = {
    // TODO: match: object.isRequired, If route info is needed, use this.  Remove if not.
    user: object.isRequired,
    subscriberOrgs: arrayOf(object).isRequired,
    currentSubscriberOrg: object,
    setCurrentSubscriberOrg: func.isRequired,
    logoutUser: func.isRequired
  };

  static defaultProps = {
    currentSubscriberOrg: null
  };

  constructor(props) {
    super(props);
    this.onSelectSubscriberOrg = this.onSelectSubscriberOrg.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onSelectSubscriberOrg() {
    const subscriberOrg = null; // TODO: allow user to select.
    this.props.setCurrentSubscriberOrg(subscriberOrg);
  }

  onLogout() {
    this.props.logoutUser();
  }

  render() {
    const { user, subscriberOrgs, currentSubscriberOrg } = this.props;
    // TODO: remove print statements.  user will never be empty.  subscriberOrgs can have length = 0.  currentSubscriberOrg can be null.
    console.log(`AD: user=${JSON.stringify(user)}`);
    console.log(`AD: subscriberOrgs=${JSON.stringify(subscriberOrgs)}`);
    console.log(`AD: currentSubscriberOrg=${JSON.stringify(currentSubscriberOrg)}`);

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <AppBar className="" title="">
          <Link to="/">
            <img
              className="mui--text-left"
              src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png"
              alt="Habla AI"
              width="75"
            />
          </Link>
          <FlatButton
            label="Subpage"
            labelPosition="before"
            href="subpage"
            containerElement="label"
          />
          <FlatButton
            label="Logout"
            labelPosition="before"
            containerElement="label"
            onTouchTap={this.onLogout}
          />
          <Avatar src="src/images/Thomas.jpg" />
          <h1>{user.displayName}</h1>
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  subscriberOrgs: state.subscriberOrgs.data,
  currentSubscriberOrg: state.subscriberOrgs.currentSubscriberOrg
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentSubscriberOrg,
  logoutUser
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(cssModules(Header, styles, { allowMultiple: true }));
