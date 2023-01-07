import * as authRoutes from "../routes/auth";

import http from "@/http";

export async function loginRequest(payload) {
  await http.get(authRoutes.csrf_route);
  const response = await http.post(authRoutes.login_route, payload);

  return response;
}
