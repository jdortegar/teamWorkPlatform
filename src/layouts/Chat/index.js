import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Transcript from '../../containers/Transcript';
import { routesPaths } from '../../routes';
import styles from './styles.scss';

class Chat extends Component {
  render() {
    return (
      <div>
        <Route exact path={routesPaths.chat} component={Transcript} />
      </div>
    );
  }
}

export default Chat;
