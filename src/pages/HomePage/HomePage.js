import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  teamMembers: PropTypes.array,
  user: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string
};

const defaultProps = {
  teamMembers: [],
  teamId: null
};

class HomePage extends Component {
  componentDidMount() {
    const { teamMembers, user, teamId, orgId } = this.props;

    if ((teamMembers && teamMembers.length === 0) || !teamMembers.some(userId => userId === user.userId)) {
      this.props.history.push(`/app/organization/${orgId}`);
    } else {
      this.props.history.push(`/app/team/${teamId}`);
    }
  }

  render() {
    return <Spinner />;
  }
}

HomePage.propTypes = propTypes;
HomePage.defaultProps = defaultProps;

export default HomePage;
