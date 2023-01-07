import * as authRequests from "../api/requests/auth";

import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  async function login(payload) {
    await authRequests.loginRequest(payload);
  }
  return { login };
});
