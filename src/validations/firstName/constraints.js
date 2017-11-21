import String from '../../translations';

export const defaultMessages = {
  tooLong: String.t('validationError.firstNameTooLong'),
  format: String.t('validationError.firstNameFormat')
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
