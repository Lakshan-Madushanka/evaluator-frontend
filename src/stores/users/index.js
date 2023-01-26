import * as userRequests from "@/api/requests/users/index";

import { defineStore } from "pinia";
import { useAppStore } from "../app";

import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const appStore = useAppStore();

  const loading = ref(false);
  const status = ref("");
  const users = ref(null);

  async function getAll(payload) {
    /* loading.value = true;
    status.value = ""; */
    resetStatus(true, "");

    try {
      const response = await userRequests.getAllRequest(payload);

      users.value = response;
    } catch (data) {
      //
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id) {
    /*  loading.value = true;
    status.value = ""; */
    resetStatus(true, "");

    try {
      await userRequests.deleteUserRequest(id);
      status.value = "deleted";
      appStore.setToast("success", "User deleted successfully");
    } catch (data) {
      //
      appStore.setToast(
        "error",
        "Error occurred while deleting user please try again"
      );
    } finally {
      loading.value = false;
    }
  }

  async function bulkDeleteUsers(payload) {
    /* loading.value = true;
    status.value = ""; */
    resetStatus(true, "deleting");

    try {
      await userRequests.bulkDeleteUsersRequest(payload);
      status.value = "deleted";
      appStore.setToast(
        "success",
        `${payload.ids.length} no of users deleted successfully`
      );
    } catch (data) {
      //
      appStore.setToast(
        "error",
        "Error occurred while deleting user please try again"
      );
    } finally {
      loading.value = false;
    }
  }

  function resetStatus(isLoading, statusValue) {
    loading.value = isLoading;
    status.value = statusValue;
  }

  return {
    getAll,
    deleteUser,
    bulkDeleteUsers,
    loading,
    users,
    status,
  };
});
