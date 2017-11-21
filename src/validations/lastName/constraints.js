import String from '../../translations';

export const defaultMessages = {
  tooLong: String.t('validationError.lastNameTooLong'),
  format: String.t('validationError.lastNameFormat')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      maximum: 30,
      tooLong: messages.tooLong
    },
    format: {
      pattern: "[a-zA-Z\\sàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð ,.'-]*",
      message: messages.format
    }
  };
}

export default constraints;
