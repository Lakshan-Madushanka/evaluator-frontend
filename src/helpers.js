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
