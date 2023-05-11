import * as evaluationRequests from "@/api/requests/evaluations/index";

import { defineStore } from "pinia";

import { ref } from "vue";

export const useEvaluationsStore = defineStore("evaluations", () => {
  const loading = ref(false);
  const status = ref("");
  const errors = ref({});
  const evaluations = ref(null);

  async function getAll(payload) {
    resetStatus(true, "");
    errors.value = {};

    try {
      const response = await evaluationRequests.getAllRequest(payload);
      evaluations.value = response;
    } catch (data) {
      //
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
    evaluations,
    getAll,
  };
});
