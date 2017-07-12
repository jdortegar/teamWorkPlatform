export function getShortName(fullname) {
  const arrayName = fullname.split(' ');
  return arrayName.length > 1 ? arrayName[0].charAt(0) + arrayName[arrayName.length - 1].charAt(0) : fullname;
}
