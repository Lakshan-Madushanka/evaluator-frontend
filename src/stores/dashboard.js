import { reactive, ref } from "vue";

import { defineStore } from "pinia";

import * as dashBoardRequests from "@/api/requests/dashboard";

export const useDashboardStore = defineStore("dashboard", () => {
  const loading = ref(false);
  const data = reactive({ questionnaires: {} });

  async function getQuestionnairesData() {
    loading.value = true;
    try {
      const response = await dashBoardRequests.getQuestionnairesDataRequest();
      data.questionnaires = response;
    } catch (data) {
      //
    } finally {
      loading.value = false;
    }
  }

  return { loading, data, getQuestionnairesData };
});
