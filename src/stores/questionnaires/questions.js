import * as questionnaireRequests from "@/api/requests/questionnaires/questions";

import { defineStore } from "pinia";
import { useAppStore } from "../app";

import { ref } from "vue";

export const useQuestionnairesQuestionsStore = defineStore(
  "questionnairesQuestions",
  () => {
    const appStore = useAppStore();

    const loading = ref(false);
    const status = ref("");
    const errors = ref({});
    const questions = ref(null);
    const question = ref(null);

    async function getAll(id) {
      resetStatus(true, "", {});

      try {
        const results = await questionnaireRequests.getAllRequest(id);
        questions.value = results.data;
      } catch (data) {
        //
      } finally {
        loading.value = false;
      }
    }

    async function checkQuestionEligibility(questionnaireId, questionId) {
      resetStatus(false, "searching", {});

      try {
        const results =
          await questionnaireRequests.checkQuestionEligibilityRequest(
            questionnaireId,
            questionId
          );

        if (results.eligible === false) {
          errors.value.questionId = "Invalid or not eligible question id";
          appStore.setToast(
            "warn",
            "Counld not find eligible question for id " + questionId
          );
        }
        question.value = results.data;
      } catch (data) {
        //
      } finally {
        status.value = "";
      }
    }

    async function syncQuestions(questionnaireId, questions) {
      resetStatus(false, "syncing", {});

      try {
        const results = await questionnaireRequests.syncQuestionsRequest(
          questionnaireId,
          questions
        );

        appStore.setToast(
          "success",
          "Questions of questiionnaire " +
            questionnaireId +
            " synced successfully"
        );
      } catch (data) {
        //
      } finally {
        status.value = "";
      }
    }

    function resetStatus(
      isLoading,
      statusValue,
      errorsValue,
      questionValue = null
    ) {
      loading.value = isLoading;
      status.value = statusValue;
      errors.value = errorsValue;
      question.value = questionValue;
    }

    return {
      loading,
      status,
      errors,
      questions,
      question,
      getAll,
      checkQuestionEligibility,
      syncQuestions,
    };
  }
);
