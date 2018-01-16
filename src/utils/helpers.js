function getInitials(text) {
  const newText = text.split(' '); // split text into chunks of words separated by a 'space'
  return newText.reduce((acc, cur) => { // iterate through newText and get initial of each word and uppercase it
    return acc + cur.substring(0, 1).toUpperCase();
  }, '');
}

export default getInitials;
