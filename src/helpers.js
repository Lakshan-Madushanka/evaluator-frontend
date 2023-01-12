export function uppercaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatText(str, limit = 10) {
  if (str.length <= limit) {
    return str;
  }
  return str.slice(0, limit) + "...";
}
