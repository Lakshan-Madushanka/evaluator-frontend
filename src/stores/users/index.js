import * as userRequests from "@/api/requests/users/index";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const loading = ref(false);
  const users = ref(null);

  async function getAll(payload) {
    loading.value = true;
    try {
      const response = await userRequests.getAllRequest(payload);

      users.value = response;
    } catch (data) {
      //
    } finally {
      loading.value = false;
    }
  }

  return {
    getAll,
    loading,
    users,
  };
});
