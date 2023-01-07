import * as authRoutes from "../routes/auth";

import http from "@/http";

export async function loginRequest(payload) {
  const response = await http.post(authRoutes.login_route, payload);

  return response;
}
