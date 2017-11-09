import constraints from './constraints';
import messages from './translations/messages';

function translatedConstraints(intl, customMessages) {
  const errorMessages = {
    length: intl.formatMessage(messages.length),
    oneLowercase: intl.formatMessage(messages.oneLowercase),
    oneNumber: intl.formatMessage(messages.oneNumber),
    oneSpecial: intl.formatMessage(messages.oneSpecial),
    oneUppercase: intl.formatMessage(messages.oneUppercase),
    ...customMessages
  };

  return constraints(errorMessages);
}

export default translatedConstraints;
