import React, { Component } from 'react'
import { AppBar } from 'material-ui'
import Avatar from 'material-ui/Avatar';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import { getUser } from '../../session';

const { displayName, icon } = getUser;
//console.log('displayName', displayName);

class Header extends Component {
  render() {
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
          containerElement="label" >
        </FlatButton>
        <FlatButton
          label="Logout"
          labelPosition="before"
          href="logout"
          containerElement="label" >
        </FlatButton>
        <Avatar src="src/images/Thomas.jpg" />
        <h1>user{displayName}</h1>
      </AppBar>
      </MuiThemeProvider>
    )
  }
}

export default Header;
