import * as userRequests from "@/api/requests/users/index";

import { defineStore } from "pinia";
import { useAppStore } from "../app";

import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const appStore = useAppStore();

  const loading = ref(false);
  const status = ref("");
  const users = ref(null);
  const errors = ref({});

  async function getAll(payload) {
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

  async function createUser(payload) {
    resetStatus(false, "creating", {});

    try {
      const response = await userRequests.createUserRequest(payload);

      appStore.setToast(
        "success",
        "User created successfully with id " + response.data.id
      );
      errors.value = {};
    } catch (data) {
      errors.value = data.errors;
      appStore.setToast("error", data.message);
    } finally {
      resetStatus(false, "");
    }
  }

  async function deleteUser(id) {
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
    resetStatus(true, "deleting");

    try {
      await userRequests.bulkDeleteUsersRequest(payload);

      status.value = "deleted";
      appStore.setToast(
        "success",
        `${payload.ids.length} no of users deleted successfully`
      );
    } catch (data) {
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
    loading,
    status,
    errors,
    users,
    getAll,
    createUser,
    deleteUser,
    bulkDeleteUsers,
  };
});
