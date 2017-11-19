import String from '../../translations';

export const defaultMessages = {
  tooLong: String.t('error.validation.firstNameTooLong'),
  format: String.t('error.validation.firstNameFormat')
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
