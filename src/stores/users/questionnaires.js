import { checkAvailability } from "@/api/requests/questionnaires/index";
import * as usersQuestionnairesRequests from "@/api/requests/users/questionnaires";

import { defineStore } from "pinia";

import { useAppStore } from "../app";

import { ref, reactive } from "vue";

export const useUsersQuestionnairesStore = defineStore(
  "usersQuestionnaires",
  () => {
    const appStore = useAppStore();

    const status = ref("");
    const availableId = ref(null);
    const errors = reactive({ questionnaireId: "" });

    async function checkAvalability(id) {
      clearState();
      status.value = "searching";

      try {
        const response = await checkAvailability(id);
        if (response.available) {
          availableId.value = id;
        } else {
          errors.questionnaireId = "Incompleted or invalid questionnaire id";
        }
      } catch (error) {
        appStore.setToast(
          "error",
          "Error occurred while deleting questionnaire please try again"
        );
      } finally {
        status.value = "";
      }
    }

    async function attach(userId) {
      errors.questionnaireId = "";
      status.value = "attaching";

      try {
        await usersQuestionnairesRequests.attach(userId, availableId.value);
        status.value = "attached";
        appStore.setToast(
          "success",
          `Questionnaire with ${availableId.value} attached to user ${userId}`
        );
      } catch (error) {
        appStore.setToast(
          "error",
          "Error occurred while attaching questionnaire please try again"
        );
      }
    }

    function clearState() {
      status.value = "";
      errors.questionnaireId = "";
      availableId.value = null;
    }

    return {
      status,
      availableId,
      errors,
      checkAvalability,
      attach,
      clearState,
    };
  }
);
