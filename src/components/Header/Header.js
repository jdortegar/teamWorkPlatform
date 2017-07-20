import React, { Component } from 'react';
import { AppBar } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Drawer from 'material-ui/Drawer';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import { getUser } from '../../session';


const { displayName, icon } = getUser;


class Header extends Component {
  state = {
    valueSingle: '3',
    valueMultiple: ['3', '5'],
  };
  handleOnRequestChange = (value) => {
    this.setState({
      openMenu: value,
    });
    console.log(this.state.openMenu);
  }
  render() {
    return (
      <MuiThemeProvider>
      <AppBar 
        
        iconElementLeft={
          <Link to="/">
          <img
            className="mui--text-left"
            src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png"
            alt="Habla AI"
            style={{ width: "35px", height: "35px", margin: "5px 0 0 20px" }}
          />
        </Link>
        }
        className="" title="">
        
        <FlatButton
          label="Subpage"
          labelPosition="before"
          href="subpage"
          containerElement="label"
          style={{color: "white"}}
        >
        </FlatButton>
        <FlatButton
          label="Logout"
          labelPosition="before"
          href="logout"
          containerElement="label"
          style={{color: "white"}}
        >
        </FlatButton>

        <IconMenu
          iconButtonElement={<IconButton><Avatar src="src/images/Thomas.jpg" /></IconButton>}
          open={this.state.openMenu}
          onRequestChange={this.handleOnRequestChange}
        >
          <MenuItem value="1" primaryText="User Profile" />
          <MenuItem value="2" primaryText="Your Organizations" />
          <MenuItem value="3" primaryText="Setting" />
          <MenuItem value="4" primaryText="Logout" />
        </IconMenu>

        
        <p style={{fontSize: "15px", margin: "20px 0 0 10px", color: "white"}}>user{displayName}</p>
      </AppBar>
      </MuiThemeProvider>
    )
  }
}

export default Header;
