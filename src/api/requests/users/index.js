import * as userRoutes from "@/api/routes/users";

import { buildQueryString } from "@/api/queryStringBuilder";
import http from "@/http";

export async function getAllRequest(payload) {
  let query = buildQueryString(payload);
  const response = await http.get(userRoutes.get_all_route + query);

  return response;
}
