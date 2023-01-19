export function buildQueryString(payload) {
  let queryString;

  if (!payload || !payload.query) {
    return "";
  }
  queryString = payload.query;

  let query = "?";

  if (queryString.pagination) {
    query += buildPagination(queryString.pagination) + "&";
  }

  if (queryString.sort) {
    query += buildSorts(queryString.sort);
  }

  return query;
}

function buildPagination(data) {
  const params = new URLSearchParams({
    "page[number]": data.number,
    "page[size]": data.size,
  });

  return params.toString();
}

function buildSorts(sorts) {
  const params = new URLSearchParams();
  let tmpSorts = [];

  for (let sort in sorts) {
    if (sorts[sort] === "asc") {
      tmpSorts.push(sort);
    }

    if (sorts[sort] === "desc") {
      tmpSorts.push(`-${sort}`);
    }
  }

  if (tmpSorts.length === 0) {
    return "";
  }

  params.set("sort", tmpSorts.join(","));

  return params.toString();
}
