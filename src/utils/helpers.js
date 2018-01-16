function getInitials(text) {
  const newText = text.split(' '); // split text into chunks of words separated by a 'space'
  const initials = newText.reduce((acc, cur) => { // iterate through newText and get initial of each word and uppercase it
    return acc + cur.substring(0, 1).toUpperCase();
  }, '');
  if (initials.length > 2) {
    return initials.substring(0, 2);
  }
  return initials;
}

export default getInitials;
