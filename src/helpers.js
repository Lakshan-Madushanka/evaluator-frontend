export function uppercaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function snake(str, symbol = "_") {
  return str.replace(/\s+/g, symbol);
}

export function formatText(str, limit = 10) {
  if (str.length <= limit) {
    return str;
  }
  return str.slice(0, limit) + "...";
}

// Get related relationship from api response
export function findRelations(relationships, id, type) {
  for (const relationship in relationships) {
    if (
      type === relationships[relationship].type &&
      id === relationships[relationship].id
    ) {
      return relationships[relationship];
    }
  }
}

export function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(`${name}=`)) {
      // Return the decoded cookie value
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }

  return null;
}

export function formatMinutes(minutes) {
  var hours = Math.floor(minutes / 60);
  var mins = minutes % 60;
  var secs = Math.floor((minutes - hours * 60 - mins) * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (mins < 10) {
    mins = "0" + mins;
  }

  if (secs < 10) {
    secs = "0" + secs;
  }

  return hours + " : " + mins + " : " + secs;
}
