import constraints from './constraints';
import messages from './translations/messages';

function translatedConstraints(intl, customMessages) {
  const errorMessages = {
    length: intl.formatMessage(messages.length),
    format: intl.formatMessage(messages.format),
    ...customMessages
  };

  return constraints(errorMessages);
}

export default translatedConstraints;
