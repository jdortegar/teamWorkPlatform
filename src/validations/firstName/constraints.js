import String from 'src/translations';

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
      pattern: "[a-zA-Z\\sàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð,.'-]+[^\\s]+[^\\s]*",
      message: messages.format
    }
  };
}

export default constraints;
