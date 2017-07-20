import React, { Component } from 'react';
import { AppBar } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { arrayOf, func, object } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setCurrentSubscriberOrg, logoutUser } from '../../actions';
import './style.css';

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
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
  }

  onSelectSubscriberOrg() {
    const subscriberOrg = null; // TODO: allow user to select.
    this.props.setCurrentSubscriberOrg(subscriberOrg);
  }

  onLogout() {
    this.props.logoutUser();
  }

  state = {
    valueSingle: '3',
    valueMultiple: ['3', '5'],
    drawerOpen: true,
  };
  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
    console.log(value);
  }

  handleSelectValue(event, value) {
    switch (value) {
      case "4" : console.log("Logout");
    }
  }

  handleOpenDrawer() {
    this.setState({ drawerOpen: !this.state.drawerOpen})
  }

  render() {
    const { user, subscriberOrgs, currentSubscriberOrg } = this.props;
    // TODO: remove print statements.  user will never be empty.  subscriberOrgs can have length = 0.  currentSubscriberOrg can be null.
    // console.log(`AD: user=${JSON.stringify(user)}`);
    // console.log(`AD: subscriberOrgs=${JSON.stringify(subscriberOrgs)}`);
    // console.log(`AD: currentSubscriberOrg=${JSON.stringify(currentSubscriberOrg)}`);
    const width = "300px";
    return (
      <AppBar
        style={{backgroundColor: "black"}}
        iconElementLeft={
          <div onClick={() => this.handleOpenDrawer()}>
            <div style={{ height: "100%", padding: "0", margin: "0"}}>
              <div style={{height: "50px", display: "inline-block", padding: "0", marginTop: "5px"}}>
                <img
                  className="mui--text-left"
                  src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png"
                  alt="Habla AI"
                  style={{ width: "35px", height: "35px", margin: "0 0 6px 20px"}}
                /><span style={{ marginLeft: '6px', color: 'white', fontSize: '18px' }}>Habla AI</span>
              </div>
            </div>
          </div>
        }
        >
        <div style={{margin: "0auto 0 auto", width: "80%", color: "white", textAlign: "center"}}>
          <div className="team-header-icon" style={{display: "inline-block", marginTop: "0px", paddingLeft: "20px", width: "100px" }}>
            <i className="fa fa-newspaper-o" style={{textAlign: "center", fontSize: "20px", paddingTop: "10px"}} />
            <div className="team-header-nav-text" style={{color: "grey", fontSize: "12px"}}>
              TEAM
            </div>
          </div>
          <div className="team-header-icon" style={{display: "inline-block", marginTop: "0px", paddingLeft: "20px", width: "100px" }}>
            <i className="fa fa-bolt" style={{textAlign: "center", fontSize: "20px", paddingTop: "10px"}} />
            <div className="team-header-nav-text" style={{color: "grey", fontSize: "12px"}} >
              CCG
            </div>
          </div>
          <div className="team-header-icon" style={{display: "inline-block", marginTop: "0px", paddingLeft: "20px", width: "100px" }}>
            <i className="fa fa-comments" style={{textAlign: "center", fontSize: "20px", paddingTop: "10px"}} />
            <div className="team-header-nav-text" style={{color: "grey", fontSize: "12px"}}>
              MESSAGING
            </div>
          </div>
          <div className="team-header-icon" style={{display: "inline-block", marginTop: "0px", paddingLeft: "20px", width: "100px" }}>
            <i className="fa fa-calendar-o" style={{textAlign: "center", fontSize: "20px", paddingTop: "10px"}} />
            <div className="team-header-nav-text" style={{color: "grey", fontSize: "12px"}}>
              CALENDAR
            </div>
          </div>
        </div>
        <IconMenu
          iconButtonElement={<img src="src/images/Thomas.jpg" style={{width: "40px", height: "40px", borderRadius: "5px", marginTop: "10px"}} />}
          open={this.state.openMenu}
          onRequestChange={this.handleOnRequestChange}
          onChange={this.handleSelectValue}
          
        >
          <MenuItem value="1" primaryText="User Profile" />
          <MenuItem value="2" primaryText="Your Organizations" />
          <MenuItem value="3" primaryText="Setting" />
          <Divider />
          <MenuItem value="4" primaryText="Logout" onTouchTap={this.onLogout} />
        </IconMenu>


        <p style={{fontSize: "15px", margin: "20px 0 0 10px", color: "white"}}>{user.displayName}</p>
      </AppBar>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
