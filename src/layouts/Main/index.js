import React from 'react';
import cssModules from 'react-css-modules';
import { Route, Switch } from 'react-router-dom';
//import Header from '../../components/Header';
import Header from '../../components/Header2/Header';
import Logout from '../../components/Logout/Logout';
import HomeContainer from '../../containers/Home';
import Integrations from '../../containers/user/Integrations';
import SubpageContainer from '../../containers/Subpage';
import { routesPaths } from '../../routes';
import styles from './styles.scss';

const Main = () => (
  <div styleName="main">
    <Header />
    <Switch>
      <Route exact path={routesPaths.home} component={HomeContainer} />
      <Route exact path={routesPaths.integrations} component={Integrations} />
      <Route exact path={routesPaths.subpage} component={SubpageContainer} />
      <Route exact path={routesPaths.logout} component={Logout} />
    </Switch>
  </div>
);

// Main.propTypes = {
//   children: oneOfType([arrayOf(element), object]).isRequired
// };

export default cssModules(Main, styles, { allowMultiple: true });
