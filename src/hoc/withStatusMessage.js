import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

import String from 'src/translations';
import { integrationLabelFromKey } from 'src/utils/dataIntegrations';

export default Component =>
  class extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      source: PropTypes.string.isRequired,
      status: PropTypes.string
    };

    static defaultProps = {
      status: ''
    };

    componentDidMount() {
      const { source, status, location, history } = this.props;
      if (status) {
        if (status.includes('CREATED')) {
          message.success(
            String.t('integrationPage.message.createdDescription', { name: integrationLabelFromKey(source) })
          );
        } else {
          message.error(status);
        }

        // Remove status from visible url to disallow reloading and bookmarking of url with status.
        let { pathname: path } = location;
        path = path.substring(0, path.lastIndexOf('/'));
        history.replace(path);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
