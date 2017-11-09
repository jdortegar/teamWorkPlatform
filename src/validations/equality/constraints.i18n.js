import constraints from './constraints';
import messages from './translations/messages';

function translatedConstraints(intl, comparator, customMessages) {
  const errorMessages = {
    equality: intl.formatMessage(messages.equality),
    ...customMessages
  };

  return constraints(comparator, errorMessages);
}

export default translatedConstraints;
