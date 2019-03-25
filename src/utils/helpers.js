function getInitials(text) {
  let newText = text.replace(/[^a-zA-Z0-9 ]/g, '');
  newText = newText.split(' ');
  // split text into chunks of words separated by a 'space'
  // iterate through newText and get initial of each word and uppercase it
  const initials = newText.reduce((acc, cur) => acc + cur.substring(0, 1).toUpperCase(), '');
  if (initials.length > 2) {
    return initials.substring(0, 2);
  }
  return initials;
}

export default getInitials;
