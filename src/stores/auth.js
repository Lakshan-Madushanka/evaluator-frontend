import * as authRequests from "../api/requests/auth";

import { reactive, ref } from "vue";

import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const loading = ref(false);
  const errors = ref({});
  const data = reactive({ id: "", name: "", role: "", email: "" });

  async function login(payload) {
    loading.value = true;
    try {
      const response = await authRequests.loginRequest(payload);
      setData(response);
    } catch (data) {
      errors.value = data.errors;
    } finally {
      loading.value = false;
    }
  }

  function setData(response) {
    data.id = response.id;
    data.name = response.attributes.name;
    data.email = response.attributes.email;
    data.role = response.attributes.role;
  }
  return { login, loading, data, errors };
});
