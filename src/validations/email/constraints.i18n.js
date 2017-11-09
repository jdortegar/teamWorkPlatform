import constraints from './constraints';
import messages from './translations/messages';

function translatedConstraints(intl, customMessages) {
  const errorMessages = {
    email: intl.formatMessage(messages.email),
    ...customMessages
  };

  return constraints(errorMessages);
}

export default translatedConstraints;
